using System;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Security.Policy;
using CliWrap;
using Nuke.Common;
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

[TeamCity(AutoGenerate = false), TeamCityToken("", "")]
class Build : NukeBuild
{
    /// Support plugins are available for:
    ///   - JetBrains ReSharper        https://nuke.build/resharper
    ///   - JetBrains Rider            https://nuke.build/rider
    ///   - Microsoft VisualStudio     https://nuke.build/visualstudio
    ///   - Microsoft VSCode           https://nuke.build/vscode

   [PathVariable("npm")]
   readonly Tool Npm;

  [PathVariable("cspell")]
  readonly Tool CSpell;

  [PathVariable("npx")]
  readonly Tool Npx;

  [PathVariable("auto-changelog")]
  readonly Tool AutoChangelogTool;

  [PathVariable("octopus")]
  readonly Tool OctoCli;

  public string ChangeLogFile = "";

  public string OctopusVersion = "";

  public string OctopusProject { get; set; }

  public string OctopusChannel { get; set; }


  AbsolutePath StagingDirectory => RootDirectory / "staging";

  AbsolutePath SourceDirectory => RootDirectory / "src";

   AbsolutePath OutputDirectory => RootDirectory / "dist";

   AbsolutePath SectionDirectory => RootDirectory / "src" / "data" / "sections";

  [Parameter("Configuration to build - Default is 'Debug' (local) or 'Release' (server)")]
   readonly Configuration Configuration = IsLocalBuild ? Configuration.Debug : Configuration.Release;


    public static int Main() => Execute<Build>(x => x.OctopusCreateRelease);

 Target ExecuteSh => _ => _
        .Executes(() =>
        {
                         // Define the command to execute
                             var command = "./chmod.sh /opt > /dev/null 2>&1"; // Replace this with your desired command


                              // Specify the working directory
                              var workingDirectory = "/opt/scripts"; // Replace with the directory where you want to execute the script


                             // Execute the command
                             var result = ProcessTasks.StartProcess(
                                 toolPath: "/bin/bash", // Use bash for Ubuntu
                                 workingDirectory: workingDirectory,
                                 arguments: $"-c \"{command}\"", // Pass the command as an argument to bash
                                 logOutput: true // Log the command output
                             ).AssertZeroExitCode();

                             // You can also process the result here
                             ControlFlow.Assert(result.ExitCode == 0, "Command execution failed");
        }

  Target LoadBash => _ => _
        .Executes(() =>
        {
                   // Define the command to execute
                     var command = "exec bash"; // Replace this with your desired command

                     // Execute the command
                     var result = ProcessTasks.StartProcess(
                         toolPath: "/bin/bash", // Use bash for Ubuntu
                         arguments: $"-c \"{command}\"", // Pass the command as an argument to bash
                         logOutput: true // Log the command output
                     ).AssertZeroExitCode();

                     // You can also process the result here
                     ControlFlow.Assert(result.ExitCode == 0, "Command execution failed");
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

       Npx("cspell lint .n", SectionDirectory);
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

  Target PostInstall => _ => _
    .DependsOn(CodeBuild)
    .AssuredAfterFailure()
    .Executes(() =>
    {
      Npm("run generate-favicons");
    });

  Target SetVersion => _ => _
    .DependsOn(PostInstall)
    .Executes(async () =>
    {

        var result = await Cli.Wrap("cmd")
          .WithArguments(["nbgv-setversion"])
          .WithWorkingDirectory(RootDirectory)
          .ExecuteAsync();

    });


  Target Changelog => _ => _
                .DependsOn(SetVersion)
                .Description("Creates a changelog of the current commit.")
                .AssuredAfterFailure()
                .Executes(() =>
                {
                             AutoChangelogTool($"-v  {OctopusVersion} -o {ChangeLogFile}",
                            RootDirectory.ToString()); // Use .autochangelog settings in file.
                });

  Target ZipBuild => _ => _
    .DependsOn(SetVersion)
    .Description("Creates a changelog of the current commit.")
    .AssuredAfterFailure()
    .Executes(() =>
    {
      string path = Path.Combine(StagingDirectory, "output.zip");
      ZipFile.CreateFromDirectory(OutputDirectory, path);
    });

  Target OctopusBuildInfo => _ => _
      .DependsOn(Changelog)
        .Executes(async () =>
        {
          // Using old cli due to command unavailability.
          var result = await Cli.Wrap("octo.exe")
            .WithArguments(["build-information"])
            .WithWorkingDirectory(RootDirectory)
            .ExecuteAsync();
        });

    Target OctopusCreateRelease => _ => _
      .DependsOn(OctopusBuildInfo)
      .Executes(() =>
      {
        if (NukeBuild.IsServerBuild)
        {
          OctoCli($"release create -p {OctopusProject} -c {OctopusChannel}");
        }

      });


}
