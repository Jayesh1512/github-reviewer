export const siteConfig = {
  name: 'GitReview',
  description: 'A better way to review pull requests at scale.',
  url: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  github: 'https://github.com/your-org/gitreview',
} as const;
