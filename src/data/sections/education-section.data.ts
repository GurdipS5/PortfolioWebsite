import type { EducationSection } from '@/types/sections/education-section.types';
import type { ReadonlyDeep } from 'type-fest';
import { website } from '../helpers/links';

const educationSectionData = {
  config: {
    title: 'Education',
    slug: 'education',
    icon: 'fa6-solid:graduation-cap',
    visible: true,
  },
  diplomas: [
    {
      title: 'Certified Kubernetes Application Developer',
      institution: 'Brunel University',
      image: import('@/assets/logos/ckad.png'),
      dates: [new Date('2004.09'), new Date('2007.07')],
      description: 'Examination covering concepts related to Kubernetes development.',
      links: [website({ url: '#' })],
    },
    {
      title: 'Hashicorp Terraform Associate',
      institution: 'Hashicorp',
      image: import('@/assets/logos/ckad.png'),
      dates: [new Date('2004.09'), new Date('2007.07')],
      description: 'Examination covering concepts related to Terraform and its application.',
      links: [website({ url: '#' })],
    },
    {
      title: 'Azure Architect',
      institution: 'Hashicorp',
      image: import('@/assets/logos/ckad.png'),
      dates: [new Date('2004.09'), new Date('2007.07')],
      description: 'Examination covering concepts related to Terraform and its application.',
      links: [website({ url: '#' })],
    },
    {
      title: 'Business & Management (Computing)',
      institution: 'Brunel University',
      image: import('@/assets/logos/Uni-brunel.jpg'),
      dates: [new Date('2004.09'), new Date('2007.07')],
      description: 'Specialization in software development.',
      links: [website({ url: '#' })],
    },
  ],
} as const satisfies ReadonlyDeep<EducationSection>;

export default educationSectionData;
