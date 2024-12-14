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

  public string OctopusProject { get; set; } = "Portfolio";

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

                   string s = RootDirectory.ToString();

                   // Define the command to execute
                   var command = "npx auto-changelog -v {OctopusVersion} -o {ChangeLogFile} {s}"; // Replace this with your desired command

                   // Execute the command
                   var result = ProcessTasks.StartProcess(
                     toolPath: "/bin/bash", // Use bash for Ubuntu
                     arguments: $"-c {command}", // Pass the command directly without extra quotes
                     logOutput: true // Log the command output
                   ).AssertZeroExitCode();

                               });

  Target ZipBuild => _ => _
    .DependsOn(Changelog)
    .Description("Creates a changelog of the current commit.")
    .AssuredAfterFailure()
    .Executes(() =>
    {
      string path = Path.Combine(StagingDirectory, "output.zip");
      ZipFile.CreateFromDirectory(OutputDirectory, path);
    });

  Target OctopusBuildInfo => _ => _
      .DependsOn(Changelog)
      .AssuredAfterFailure()
        .Executes(async () =>
        {

        // Define the command to execute
        var command = "octo build-information"; // Replace this with your desired command

           // Execute the command
           var result = ProcessTasks.StartProcess(
             toolPath: "/bin/bash", // Use bash for Ubuntu
             arguments: $"-c {command}", // Pass the command directly without extra quotes
             logOutput: true // Log the command output
           ).AssertZeroExitCode();
        });

    Target OctopusCreateRelease => _ => _
      .DependsOn(OctopusBuildInfo)
      .AssuredAfterFailure()
      .Executes(() =>
      {
        if (NukeBuild.IsServerBuild)
        {
          // Define the command to execute
          var command = "octopus release create -p "; // Replace this with your desired command

          // Execute the command
          var result = ProcessTasks.StartProcess(
            toolPath: "/bin/bash", // Use bash for Ubuntu
            arguments: $"-c {command}", // Pass the command directly without extra quotes
            logOutput: true // Log the command output
          ).AssertZeroExitCode();
        }

      });
}
