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




  Target NpmInstall => _ => _
        .Executes(() =>
        {
          // Define the command to execute
          var command = "npm install"; // Replace this with your desired command

          // Execute the command
          var result = ProcessTasks.StartProcess(
              toolPath: "/bin/bash", // Use bash for Ubuntu
              arguments: $"-c {command}", // Pass the command directly without extra quotes
              logOutput: true // Log the command output
          ).AssertZeroExitCode();

        });

  Target CSpellTarget => _ => _
    .DependsOn(NpmInstall)
    .AssuredAfterFailure()
    .Executes(() =>
    {

          // Define the command to execute
          var command = "npx cspell lint ."; // Replace this with your desired command

          // Execute the command
          var result = ProcessTasks.StartProcess(
              toolPath: "/bin/bash", // Use bash for Ubuntu
              arguments: $"-c {command}", // Pass the command directly without extra quotes
              logOutput: true // Log the command output
          ).AssertZeroExitCode();

    });

  Target Prettier => _ => _
    .DependsOn(CSpellTarget)
    .AssuredAfterFailure()
    .Executes(async () =>
    {


       // Define the command to execute
       var command = "npm run prettier:check"; // Replace this with your desired command

       // Execute the command
        var result = ProcessTasks.StartProcess(
           toolPath: "/bin/bash", // Use bash for Ubuntu
           arguments: $"-c {command}", // Pass the command directly without extra quotes
           logOutput: true // Log the command output
                ).AssertZeroExitCode();

    });

  Target PrettierWrite => _ => _
    .DependsOn(Prettier)
    .AssuredAfterFailure()
    .Executes(async () =>
    {

             // Define the command to execute
             var command = "npm run prettier:write"; // Replace this with your desired command

             // Execute the command
              var result = ProcessTasks.StartProcess(
                 toolPath: "/bin/bash", // Use bash for Ubuntu
                 arguments: $"-c {command}", // Pass the command directly without extra quotes
                 logOutput: true // Log the command output
                      ).AssertZeroExitCode();

    });

  Target CodeBuild => _ => _
    .DependsOn(PrettierWrite)
    .AssuredAfterFailure()
    .Executes(() =>
    {
                   // Define the command to execute
                   var command = "npm run build"; // Replace this with your desired command

                   // Execute the command
                    var result = ProcessTasks.StartProcess(
                       toolPath: "/bin/bash", // Use bash for Ubuntu
                       arguments: $"-c {command}", // Pass the command directly without extra quotes
                       logOutput: true // Log the command output
                            ).AssertZeroExitCode();
    });

  Target PostInstall => _ => _
    .DependsOn(CodeBuild)
    .AssuredAfterFailure()
    .Executes(() =>
    {

                         // Define the command to execute
                         var command = "npm run generate-favicons"; // Replace this with your desired command

                         // Execute the command
                          var result = ProcessTasks.StartProcess(
                             toolPath: "/bin/bash", // Use bash for Ubuntu
                             arguments: $"-c {command}", // Pass the command directly without extra quotes
                             logOutput: true // Log the command output
                                  ).AssertZeroExitCode();
    });

  Target SetVersion => _ => _
    .DependsOn(PostInstall)
    .AssuredAfterFailure()
    .Executes(() =>
    {

                    // Define the command to execute
                             var command = "npx nbgv-setversion"; // Replace this with your desired command

                             // Execute the command
                              var result = ProcessTasks.StartProcess(
                                 toolPath: "/bin/bash", // Use bash for Ubuntu
                                 arguments: $"-c {command}", // Pass the command directly without extra quotes
                                 logOutput: true // Log the command output
                                      ).AssertZeroExitCode();



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
