import type { ExperienceSection } from '@/types/sections/experience-section.types';
import type { ReadonlyDeep } from 'type-fest';
import { facebook, github, linkedin, twitter, website } from '../helpers/links';
import {
  eks,
  azure,
  azuredevops,
  aws,
  csharp,
  git,
  helm,
  kubernetes,
  nginx,
  npm,
  kong,
  prometheus,
  redis,
  grafana,
  openai,
  octopusdeploy,
  proget,
  sonarqube,
  swagger,
  teamcity,
  terraform,
} from '../helpers/skills';

const experienceSectionData = {
  config: {
    title: 'Work experience',
    slug: 'experience',
    icon: 'fa6-solid:suitcase',
    visible: true,
  },
  jobs: [
    {
      role: 'DevOps Lead',
      company: 'Virgin Money',
      image: import('@/assets/logos/virginmoney.jpg'),
      dates: [new Date('2020-02'), null],
      description: `
        - Led a seamless migration of 50+ applications to AWS/Azure, resulting in a 30% reduction in infrastructure costs and improved scalability.
        - Implemented efficient resource allocation strategies, leading to a 30% reduction in cloud infrastructure costs.
        - Successfully designed, deployed, and maintained highly available Kubernetes clusters in production environments, supporting over 100 microservices, ensuring seamless application delivery and scalability.
        - Developed common Terraform modules, reducing code duplication and time to release and leading to an increase in developer productivity and code standardisation, reducing bugs and time to deployment.
        - Worked as a DevOps Lead for the Dynamics 365 team, to improve their release management processes, automate TOIL and instil a DevOps culture of experimentation.
        - Built a Research and Development function to look at innovation and improving our digital products. This includes using AI, Machine Learning and Data Engineering in Azure.
      `,
      tagsList: {
        title: 'Technologies',
        tags: [azure(), kubernetes(), helm(), openai(), sonarqube, git(), terraform(), npm()],
      },
      links: [facebook({ url: '#' }), linkedin({ url: '#' })],
    },
    {
      role: 'Senior DevOps Engineer',
      company: 'Maritech',
      image: import('@/assets/logos/sea.jpg'),
      dates: [new Date('2019-04'), new Date('2019-05')],
      description: `
        - Integrated Veracode into Azure DevOps CICD pipelines, thereby improving our security posture, compliance and ability to win new customers
        - Integrated Kubernetes with best-in-class security tooling (e.g., Istio, Calico) to enforce network policies and secure inter-service communication, achieving compliance with industry standards.
        - Championed an AppSec program with developers, to implement secure development practices, resulting in less CI failures.
        - Created Terraform modules for an Akamai CDN/DDOS deployment, to protect against bot attacks. This improved productivity and reduced repetition.
        - Deployed a comprehensive monitoring and alerting system using Prometheus and Grafana, reducing system downtime by 40% through proactive incident management.
        - Implemented a robust CI/CD pipeline using Azure DevOps, which reduced the deployment frequency from monthly to daily, enhancing product delivery speed and reliability.
      `,
      tagsList: {
        title: 'Technologies',
        tags: [
          csharp(),
          kubernetes(),
          helm(),
          nginx(),
          sonarqube(),
          redis(),
          prometheus(),
          grafana(),
          azuredevops(),
          octopusdeploy(),
          proget(),
          swagger(),
          teamcity(),
        ],
      },
      links: [website({ url: '#' })],
    },
    {
      role: 'Senior DevOps Engineer',
      company: 'Reed Technology',
      image: import('@/assets/logos/reed.png'),
      dates: [new Date('2016-09'), new Date('2016-10')],
      description: `
      - Achieved significant cost savings by analyzing and optimizing AWS usage, resulting in 20% reduction in monthly expenses. This involved educating developers, and using native tooling such as AWS Cloud Explorer.
      - Deployed Kong, as an API Gateway for our Kubernetes microservices. This helped improve reliability and developer productivity, by offloading
      `,
      tagsList: {
        title: 'Technologies',
        tags: [aws(), azuredevops(), kong(), eks()],
      },
      links: [twitter({ url: '#' }), github({ url: '#' })],
    },
  ],
} as const satisfies ReadonlyDeep<ExperienceSection>;

export default experienceSectionData;
