import type { MainSection } from '@/types/sections/main-section.types';
import type { ReadonlyDeep } from 'type-fest';
import { medium, github, linkedin, twitter } from '../helpers/links';

const mainSectionData = {
  config: {
    icon: 'fa6-solid:user',
    title: 'Profile',
    slug: 'profile',
    visible: true,
  },
  image: import('@/assets/my-image.jpeg'),
  fullName: 'Gurdip Sira',
  role: 'DevOps Lead',
  details: [
    { label: 'Email', value: 'gurdip.sira@gmail.com', url: 'mailto:mark.freeman.dev@gmail.com' },
    { label: 'From', value: 'London, England' },
    { label: 'Salary range', value: '100  000 - 110 000 GBP' },
  ],
  pdfDetails: [
    { label: 'Email', value: 'gurdip.sira@gmail.com' },
    { label: 'LinkedIn', value: '/in/gurdipsira', url: 'https://linkedin.com' },
    { label: 'GitHub', value: '/gurdips5', url: 'https://github.com' },
    { label: 'Website', value: 'https://gurdipsira.dev', url: '/', fullRow: true },
  ],
  description:
    "Ever since I wrote my first line of code, I've been captivated by the power of technology to transform ideas into reality. My journey into the world of DevOps began with a fascination for how infrastructure and development can seamlessly work together to deliver robust, scalable, and efficient solutions. Over the past decade, I have dedicated myself to mastering the art of DevOps, spearheading initiatives that have revolutionized deployment pipelines, enhanced system reliability, and optimized workflows.\n" +
    '\n' +
    'From automating complex CI/CD processes to implementing comprehensive monitoring solutions, my career is a testament to my passion for continuous improvement and innovation. As a DevOps lead, I have successfully led cross-functional teams, driven cloud migration projects, and ensured the stability and performance of mission-critical applications. Join me as I share the milestones, projects, and experiences that define my professional journey and showcase my commitment to excellence in the ever-evolving field of DevOps.',
  tags: [
    { name: 'Not open for work' },
    { name: 'Available for mentoring' },
    { name: 'Working on side projects and certs.' },
    { name: 'R35 GT-R Owner' },
  ],
  action: {
    label: 'Download CV',
    url: '/cv.pdf',
    downloadedFileName: 'CV-GurdipSira.pdf',
  },
  links: [
    medium({ url: '' }),
    github({ url: 'https://github.com/GurdipS5' }),
    linkedin({ url: 'https://www.linkedin.com/in/gurdipsira/' }),
    twitter({ url: '#' }),
  ],
} as const satisfies ReadonlyDeep<MainSection>;

export default mainSectionData;
