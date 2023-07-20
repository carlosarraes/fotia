await import('./src/env.mjs')

const config = {
  reactStrictMode: true,
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  images: {
    domains: ['arrais.s3.sa-east-1.amazonaws.com'],
  },
}

export default config
