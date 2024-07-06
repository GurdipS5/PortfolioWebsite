import createSkillFactory from '@/data/_internals/create-skill-factory';

/*

Place where you can define all your skills.
This way, you can ensure one skill has the same name, icon, and URL among all resume sections.

Where skills are used:
- experience-section.data.ts
- portfolio-section.data.ts
- skills-section.data.ts

Usage examples:
skill() — returns skill object without any customizations.
skill({ level: 3 }) — returns a levelled-skill. It can be used only in skills-section.data.ts.
skill({ name: '...' }) — returns skill object with a custom name.
skill({ description: '...' }) — returns skill with a description displayed when user hovers over it.

*/

export const apolloGraphql = createSkillFactory({
  name: 'Apollo GraphQL',
  icon: 'simple-icons:apollographql',
  iconColor: '#311C87',
  url: 'https://www.apollographql.com/',
});

export const ansible = createSkillFactory({
  name: 'Ansible',
  icon: 'simple-icons:ansible',
  iconColor: '#311C87',
  url: 'https://www.apollographql.com/',
});

export const checkmarx = createSkillFactory({
  name: 'Ansible',
  icon: 'simple-icons:checkmarx',
  iconColor: '#54B848',
  url: 'https://www.apollographql.com/',
});

export const astro = createSkillFactory({
  name: 'Astro',
  icon: 'simple-icons:astro',
  iconColor: '#FF5D01',
  url: 'https://astro.build/',
});

export const aws = createSkillFactory({
  name: 'Amazon Web Services',
  icon: 'simple-icons:amazonaws',
  iconColor: '#232F3E',
  url: 'https://astro.build/',
});

export const azure = createSkillFactory({
  name: 'Azure',
  icon: 'simple-icons:microsoftazure',
  iconColor: '#0078D4',
  url: 'https://azure.com/',
});

export const azuredevops = createSkillFactory({
  name: 'Azure DevOps',
  icon: 'simple-icons:azuredevops',
  iconColor: '#0078D7',
  url: 'https://azure.com/',
});

export const blazor = createSkillFactory({
  name: 'Blazor',
  icon: 'simple-icons:blazor',
  iconColor: '#0078D4',
  url: 'https://azure.com/',
});

export const nginx = createSkillFactory({
  name: 'NGINX',
  icon: 'simple-icons:nginx',
  iconColor: '#009639',
  url: 'https://azure.com/',
});

export const csharp = createSkillFactory({
  name: 'CSharp',
  icon: 'simple-icons:csharp',
  iconColor: '#512BD4',
  url: 'https://azure.com/',
});

export const owasp = createSkillFactory({
  name: 'OWasp',
  icon: 'simple-icons:owasp',
  iconColor: '#512BD4',
  url: 'https://azure.com/',
});

export const securityscorecard = createSkillFactory({
  name: 'OWasp',
  icon: 'simple-icons:securityscorecard',
  iconColor: '#7033FD',
  url: 'https://azure.com/',
});

export const dotnet = createSkillFactory({
  name: 'Dot NET',
  icon: 'simple-icons:dotnet',
  iconColor: '#512BD4',
  url: 'https://azure.com/',
});

export const eks = createSkillFactory({
  name: 'Amazon EKS',
  icon: 'simple-icons:amazoneks',
  iconColor: '#FF9900',
  url: 'https://azure.com/',
});

export const Go = createSkillFactory({
  name: 'Go',
  icon: 'simple-icons:eslint',
  iconColor: '#00ADD8',
  url: 'https://git-scm.com/',
});

export const Splunk = createSkillFactory({
  name: 'Go',
  icon: 'simple-icons:splunk',
  iconColor: '#000000',
  url: 'https://git-scm.com/',
});

export const Git = createSkillFactory({
  name: 'Git',
  icon: 'simple-icons:git',
  iconColor: '#4B32C3',
  url: 'https://git-scm.com/',
});

export const Hasura = createSkillFactory({
  name: 'Hasura',
  icon: 'simple-icons:hasura',
  iconColor: '#1EB4D4',
  url: 'https://hasura.io/',
});

export const helm = createSkillFactory({
  name: 'Helm',
  icon: 'simple-icons:helm',
  iconColor: '#0F1689',
  url: 'https://helm.com/',
});

export const kubernetes = createSkillFactory({
  name: 'Kubernetes',
  icon: 'simple-icons:kubernetes',
  iconColor: '#326CE5',
  url: 'https://eslint.org/',
});

export const kong = createSkillFactory({
  name: 'Kong',
  icon: 'simple-icons:kong',
  iconColor: '#003459',
  url: 'https://eslint.org/',
});

export const npm = createSkillFactory({
  name: 'NPM',
  icon: 'simple-icons:npm',
  iconColor: '#CB3837',
  url: 'https://www.npmjs.com/',
});

export const octopusdeploy = createSkillFactory({
  name: 'Octopus Deploy',
  icon: 'simple-icons:octopusdeploy',
  iconColor: '#143055',
  url: 'https://octopusdeploy.com',
});

export const openai = createSkillFactory({
  name: 'OpenAI',
  icon: 'simple-icons:openai',
  iconColor: '#412991',
  url: 'https://octopusdeploy.com',
});

export const postgreSql = createSkillFactory({
  name: 'PostgreSQL',
  icon: 'simple-icons:postgresql',
  iconColor: '#4169E1',
  url: 'https://www.postgresql.org/',
});

export const proget = createSkillFactory({
  name: 'ProGet',
  icon: 'simple-icons:nuget',
  iconColor: '#4169E1',
  url: 'https://www.postgresql.org/',
});

export const pulumi = createSkillFactory({
  name: 'Pulumi',
  icon: 'simple-icons:pulumi',
  iconColor: '#8A3391',
  url: 'https://pulumi.com',
});

export const redis = createSkillFactory({
  name: 'Redis',
  icon: 'simple-icons:redis',
  iconColor: '#8A3391',
  url: 'https://pulumi.com',
});

export const sqlserver = createSkillFactory({
  name: 'SQL Server',
  icon: 'simple-icons:microsoftsqlserver',
  iconColor: '#4E9BCD',
  url: 'https://sonarqube.org',
});

export const git = createSkillFactory({
  name: 'Sonatype',
  icon: 'simple-icons:git',
  iconColor: '#F05032',
  url: 'https://snyk.io',
});

export const prometheus = createSkillFactory({
  name: 'Prometheus',
  icon: 'simple-icons:prometheus',
  iconColor: '#E6522C',
  url: 'https://snyk.io',
});

export const grafana = createSkillFactory({
  name: 'Grafana',
  icon: 'simple-icons:grafana',
  iconColor: '#F46800',
  url: 'https://snyk.io',
});

export const sonarqube = createSkillFactory({
  name: 'SonarQube',
  icon: 'simple-icons:sonarqube',
  iconColor: '#4C4A73',
  url: 'https://snyk.io',
});

export const snyk = createSkillFactory({
  name: 'Snyk',
  icon: 'simple-icons:snyk',
  iconColor: '#4E9BCD',
  url: 'https://sonarqube.org',
});

export const swagger = createSkillFactory({
  name: 'Swagger',
  icon: 'simple-icons:swagger',
  iconColor: '#85EA2D',
  url: 'https://swagger.io/',
});

export const teamcity = createSkillFactory({
  name: 'Teamcity',
  icon: 'simple-icons:teamcity',
  iconColor: '#000000',
  url: 'https://jetbrains.com/',
});

export const terraform = createSkillFactory({
  name: 'Terraform',
  icon: 'simple-icons:terraform',
  iconColor: '#844FBA',
  url: 'https://tailwindcss.com/',
});

export const typescript = createSkillFactory({
  name: 'TypeScript',
  icon: 'simple-icons:typescript',
  iconColor: '#3178C6',
  url: 'https://www.typescriptlang.org/',
});
