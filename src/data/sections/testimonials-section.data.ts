import type { TestimonialsSection } from '@/types/sections/testimonials-section.types';
import type { ReadonlyDeep } from 'type-fest';
// @ts-ignore
import { github, linkedin, website } from '../helpers/links';

const testimonialsSectionData = {
  config: {
    title: 'Testimonials',
    slug: 'testimonials',
    icon: 'fa6-solid:comment',
    visible: true,
  },
  testimonials: [
    {
      image: import('@/assets/testimonials/testimonial-1.jpeg'),
      author: 'Howard Stewart',
      relation: 'We work together at Virgin Money',
      content:
        'As a DevOps Lead responsible for ensuring the security and efficiency of our Kubernetes infrastructure, we have always sought out tools that align with our high standards for runtime security, visibility, and policy enforcement. Our search led us to KubeArmor, and it has significantly transformed our approach to container security.',
      links: [github({ url: '#' }), linkedin({ url: '#' })],
    },
    {
      image: import('@/assets/testimonials/testimonial-2.jpeg'),
      author: 'Jean Richards',
      relation: 'My project manager at GitLab',
      content:
        'As a DevOps Lead responsible for ensuring the security and efficiency of our Kubernetes infrastructure, we have always sought out tools that align with our high standards for runtime security, visibility, and policy enforcement. Our search led us to KubeArmor, and it has significantly transformed our approach to container security.',
      links: [linkedin({ url: '#' })],
    },
  ],
} as const satisfies ReadonlyDeep<TestimonialsSection>;

export default testimonialsSectionData;
