using System;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Security.Policy;
using System.Text;
using CliWrap;
using CliWrap.Buffered;
using Nuke.Common;
using Nuke.Common.ChangeLog;
using Nuke.Common.CI;
using Nuke.Common.CI.TeamCity;
using Nuke.Common.Execution;
using Nuke.Common.Git;
using Nuke.Common.IO;
using Nuke.Common.ProjectModel;
using Nuke.Common.Tooling;
using Nuke.Common.Tools.GitHub;
using Nuke.Common.Utilities.Collections;
using Octokit;
using Serilog;
using static Nuke.Common.EnvironmentInfo;
using static Nuke.Common.IO.FileSystemTasks;
using static Nuke.Common.IO.PathConstruction;
using System.IO;
using System.Text.Json;
using System.Text.RegularExpressions;
using NuGet.Packaging;

[TeamCity(AutoGenerate = true), TeamCityToken("test", "c202f1a5-e758-4ae4-be74-8dbb2fda3483")]
class Build : NukeBuild
{
  /// Support plugins are available for:
  ///   - JetBrains ReSharper        https://nuke.build/resharper
  ///   - JetBrains Rider            https://nuke.build/rider
  ///   - Microsoft VisualStudio     https://nuke.build/visualstudio
  ///   - Microsoft VSCode           https://nuke.build/vscode


  TeamCity TeamCity => TeamCity.Instance;

  /// <summary>
  ///
  /// </summary>
  readonly AbsolutePath GgConfig = RootDirectory / "gitguardian.yml";

  [Secret] [Parameter] readonly string OctopusApiKey;

  [Secret] [Parameter] readonly string ProGetApiKey;

  [Secret] [Parameter] readonly string GithubKey;



  [PathVariable("npm")] readonly Tool Npm;

  [PathVariable("cspell")] readonly Tool CSpell;

  [PathVariable("nuget")] readonly Tool NuGet;

  [PathVariable("auto-changelog")] readonly Tool AutoChangelogTool;

  [PathVariable("octopus")] readonly Tool OctopusCli;

  /// <summary>
  ///  New octopus cli.
  /// </summary>
  [PathVariable("octo")]
  readonly Tool OctoCli;

  [PathVariable("dotnet")]
  readonly Tool Dotnet;

  [PathVariable("ggshield")] readonly Tool GGCli;

  [PathVariable("nuget")]
  readonly Tool Nuget;


  [GitRepository] readonly GitRepository Repository;

  public string ChangeLogFile = "";

  public string OctopusVersion = "";

  public string OctopusProject = "Portfolio";

  public string OctopusServerUrl = "http://octopusd.gssira.com";



  public string OctopusChannel { get; set; }

  public string progetUrl { get; set; } = "http://proget.gssira.com:8624/feeds/PortfolioApp";

  readonly static AbsolutePath packagePath = RootDirectory / "staging" ;

  readonly static string NukpgPath = packagePath.GlobFiles("*.nupkg").First();

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
        GGCli($"--config-path {GgConfig.ToString()} secret scan commit-range HEAD~1");
      }
    });

  Target PostInstall => _ => _
    .DependsOn(CheckSecrets)
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

      if (NukeBuild.IsServerBuild)
      {
        Npm("nbgv cloud");
      }

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
      if (NukeBuild.IsLocalBuild) {
            AutoChangelogTool($"-v  {OctopusVersion} -o {ChangeLogFile}",
              RootDirectory.ToString()); // Use .autochangelog settings in file.
      }

      else {
      AutoChangelogTool($"-v {TeamCity.BuildNumber} -o {ChangeLogFile}",
        RootDirectory.ToString()); // Use .autochangelog settings in file.
      }
    });

  Target SetOctopusVersion => _ => _
    .DependsOn(Changelog)
    .Description("")
    .AssuredAfterFailure()
    .Executes(async () =>
    {

      string jsonString = File.ReadAllText("package.json");

      // Parse the JSON
      JsonDocument jsonDoc = JsonDocument.Parse(jsonString);

      // Get a specific value, e.g., "version"
      OctopusVersion = jsonDoc.RootElement.GetProperty("version").GetString();
    });


  Target CheckInGit => _ => _
    .DependsOn(SetOctopusVersion)
    .Description("")
    .AssuredAfterFailure()
    .Executes(async () =>
    {

      if (IsLocalBuild)
      {
        var stdOutBuffer = new StringBuilder();

        var dbDailyTasks =  await Cli.Wrap("powershell")
          .WithArguments(new[] { "Split-Path -Leaf (git remote get-url origin)" })
          .WithStandardOutputPipe(PipeTarget.ToStringBuilder(stdOutBuffer))
          .ExecuteAsync();

        var repoName = stdOutBuffer.ToString();

        Log.Information(repoName);
        Log.Information(Repository.Endpoint);

        var gitCommand = "git";
        var gitAddArgument = @"add -A";
        var gitCommitArgument = @"commit -m ""chore(ci): checking in changed code from local ci""";
        var gitPushArgument = $@"push https://{GithubKey}@github.com/{Repository.GetGitHubOwner()}/{repoName}";

        string replacement = Regex.Replace(gitPushArgument, @"\t|\n|\r", "");

        Process.Start(gitCommand, gitAddArgument).WaitForExit();
        Process.Start(gitCommand, gitCommitArgument).WaitForExit();
        Process.Start(gitCommand, replacement).WaitForExit();
      }

    });

  /// <summary>
  /// Zips build output to send to ProGet.
  /// </summary>
  Target CreateNupkg => _ => _
    .DependsOn(CheckInGit)
    .Description("Creates a zip of the build, to send to ProGet - used by OD.")
    .AssuredAfterFailure()
    .Executes(() =>
    {
      Nuget($"pack .nuspec -OutputDirectory {StagingDirectory}");
    });

  /// <summary>
  /// Creates Octopus Build Information.
  /// </summary>
  Target OctopusBuildInfo => _ => _
      .DependsOn(CreateNupkg)
      .AssuredAfterFailure()
        .Executes(async () =>
        {
          if (NukeBuild.IsLocalBuild)
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
  /// Push proceeding nupkg ton ProGet.
  /// </summary>
  Target PushToProGet => _ => _
    .DependsOn(OctopusBuildInfo)
    .AssuredAfterFailure()
    .Executes(() =>
    {
      NuGet($"push {packagePath} {ProGetApiKey} -src {progetUrl}");
    });

  /// <summary>
  ///  Create release in Octopus Deploy. Uses new CLI.
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
