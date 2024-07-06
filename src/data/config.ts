import type { Config } from '@/types/data';
import { enUS } from 'date-fns/locale';
import type { ReadonlyDeep } from 'type-fest';

const config = {
  i18n: {
    locale: enUS,
    dateFormat: 'MMMM yyyy',
    translations: {
      now: 'Now',
    },
  },
  meta: {
    title: 'Gurdip Sira - DevOps Lead',
    description:
      'Specialist in CICD pipelines, infrastructure automation and enhancing team communication. My expertise in CI/CD, cloud services, and microservices architecture ensures rapid, reliable, and scalable software deployment.',
    faviconPath: '/src/assets/my-image.jpeg',
  },
  pdf: {
    footer:
      'I hereby give consent for my personal data included in my application to be processed for the purposes of the recruitment process.',
  },
} as const satisfies ReadonlyDeep<Config>;

export default config;
