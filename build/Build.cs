using System;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Security.Policy;
using CliWrap;
using Nuke.Common;
using Nuke.Common.ChangeLog;
using Nuke.Common.CI;
using Nuke.Common.CI.TeamCity;
using Nuke.Common.Execution;
using Nuke.Common.IO;
using Nuke.Common.ProjectModel;
using Nuke.Common.Tooling;
using Nuke.Common.Utilities.Collections;
using static Nuke.Common.EnvironmentInfo;
using static Nuke.Common.IO.FileSystemTasks;
using static Nuke.Common.IO.PathConstruction;

[TeamCity(AutoGenerate = true), TeamCityToken("test", "c202f1a5-e758-4ae4-be74-8dbb2fda3483")]
class Build : NukeBuild
{
  /// Support plugins are available for:
  ///   - JetBrains ReSharper        https://nuke.build/resharper
  ///   - JetBrains Rider            https://nuke.build/rider
  ///   - Microsoft VisualStudio     https://nuke.build/visualstudio
  ///   - Microsoft VSCode           https://nuke.build/vscode


  /// <summary>
  ///
  /// </summary>
  readonly AbsolutePath GgConfig = RootDirectory / "gitguardian.yml";

  [Secret] [Parameter] readonly string OctopusApiKey;

  [Secret] [Parameter] readonly string ProGetApiKey;



  [PathVariable("npm")] readonly Tool Npm;

  [PathVariable] readonly Tool CSpell;

  [PathVariable("nuget")] readonly Tool NuGet;

  [PathVariable("auto-changelog")] readonly Tool AutoChangelogTool;

  [PathVariable("octopus")] readonly Tool OctopusCli;

  /// <summary>
  ///  New octopus cli.
  /// </summary>
  [PathVariable("octo")]
  readonly Tool OctoCli;

  [PathVariable("ggshield")] readonly Tool GGCli;

  public string ChangeLogFile = "";

  public string OctopusVersion = "";

  public string OctopusProject = "Portfolio";

  public string OctopusServerUrl = "http://octopusd.gssira.com";

  public string OctopusChannel { get; set; }

  public string progetUrl { get; set; } = "http://proget.gssira.com:8624/upack/Portfolio";

  readonly AbsolutePath packagePath = RootDirectory / "staging" / "output.zip";

  /// <summary>
  /// Zip file for Octopus Deploy is stored here.
  /// </summary>
  AbsolutePath StagingDirectory => RootDirectory / "staging";

  AbsolutePath SourceDirectory => RootDirectory / "src";

  /// <summary>
  /// Out put of npm build task.
  /// </summary>
  AbsolutePath OutputDirectory => RootDirectory / "dist";

  AbsolutePath SectionDirectory => RootDirectory / "src" / "data" / "sections";

  [Parameter("Configuration to build - Default is 'Debug' (local) or 'Release' (server)")]
  readonly Configuration Configuration = IsLocalBuild ? Configuration.Debug : Configuration.Release;

  string packageid = "Gurdip Portfolio";
  string packageName = "Portfolio";

  public static int Main() => Execute<Build>(x => x.OctopusCreateRelease);

  Target SnykVulnerabilityCheck => _ => _
    .Executes(() =>
    {
      Npm("install", RootDirectory);
    });

  Target NpmInstall => _ => _
    .Executes(() =>
    {
      Npm("install", RootDirectory);
    });

  Target CSpellTarget => _ => _
    .DependsOn(NpmInstall)
    .Executes(() =>
    {
      CSpell("*", SectionDirectory);
    });

  Target Prettier => _ => _
    .DependsOn(CSpellTarget)
    .AssuredAfterFailure()
    .Executes(async () =>
    {
      Npm("run prettier:check");
    });

  Target PrettierWrite => _ => _
    .DependsOn(Prettier)
    .AssuredAfterFailure()
    .Executes(async () =>
    {
      Npm("run prettier:write");
    });

  Target CodeBuild => _ => _
    .DependsOn(PrettierWrite)
    .AssuredAfterFailure()
    .Executes(() =>
    {
      Npm("run build", RootDirectory);
    });

  Target CheckSecrets => _ => _
    .DependsOn(CodeBuild)
    .AssuredAfterFailure()
    .Executes(() =>
    {
      if (IsLocalBuild)
      {
        //     GGShield("auth login");
        GGCli($"--config-path {GgConfig} secret scan commit-range HEAD~1");
      }
    });

  Target PostInstall => _ => _
    .DependsOn(CodeBuild)
    .AssuredAfterFailure()
    .Executes(() =>
    {
      Npm("run generate-favicons");
    });

  Target SetVersion => _ => _
    .DependsOn(PostInstall)
    .Description("Set version on package.json")
    .AssuredAfterFailure()
    .Executes(async () =>
    {

      Npm("nbgv cloud");

    });

  /// <summary>
  /// Generates changelog entry based on Git.
  /// </summary>
  Target Changelog => _ => _
    .DependsOn(SetVersion)
    .Description("Creates a changelog of the current commit.")
    .AssuredAfterFailure()
    .Executes(() =>
    {
      AutoChangelogTool($"-v  {OctopusVersion} -o {ChangeLogFile}",
        RootDirectory.ToString()); // Use .autochangelog settings in file.
    });


  Target CheckInGit => _ => _
    .DependsOn(Changelog)
    .Description("")
    .AssuredAfterFailure()
    .Executes(() =>
    {



    });



/// <summary>
  ///  Zips build output to send to ProGet.
  /// </summary>
  Target ZipBuild => _ => _
    .DependsOn(CheckInGit)
    .Description("Creates a zip of the build, to send to ProGet - used by OD.")
    .AssuredAfterFailure()
    .Executes(() =>
    {
      string path = Path.Combine(StagingDirectory, "output.zip");
      ZipFile.CreateFromDirectory(OutputDirectory, path);
    });

  /// <summary>
  ///
  /// </summary>
  Target OctopusBuildInfo => _ => _
      .DependsOn(ZipBuild)
      .AssuredAfterFailure()
        .Executes(async () =>
        {
          if (NukeBuild.IsServerBuild)
          {
            Console.WriteLine("Local build.");
          }

          else
          {
            // Using old cli due to command unavailability.
            var result = await Cli.Wrap("octo.exe")
              .WithArguments([$"build-information package-id {packageid} --version {OctopusVersion}"])
              .WithWorkingDirectory(RootDirectory)
              .ExecuteAsync();
          }
        });

  /// <summary>
  /// Push proceeding zip to ProGet.
  /// </summary>
  Target PushToProGet => _ => _
    .DependsOn(OctopusBuildInfo)
    .AssuredAfterFailure()
    .Executes(() =>
    {
      NuGet($"push  {packagePath}  {ProGetApiKey} -src {progetUrl}");
    });

  /// <summary>
  ///  Create relese in Octopus Deploy. Uses new CLI.
  /// </summary>
  Target OctopusCreateRelease => _ => _
      .DependsOn(PushToProGet)
      .AssuredAfterFailure()
      .Executes(() =>
      {

        if (NukeBuild.IsLocalBuild)
        {
          Console.WriteLine("This is a local build");
        }

        if (NukeBuild.IsServerBuild)
        {
          OctoCli($"release create -p {OctopusProject} -c {OctopusChannel} -apiKey {OctopusApiKey} --server {OctopusServerUrl}");
        }

      });


}
