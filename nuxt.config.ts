import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  app: {
    head: {
      title: 'EthwSwap',
      meta: [
        { name: 'referrer', content: 'no-referrer' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=true' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/logo.png' }
      ],
      script: [
        { src: 'https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js' },
        { src: '/js/util.js' },
        { src: '/js/coalesce.js' },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  modules: [
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    "@nuxtjs/i18n",
    '@kevinmarrec/nuxt-pwa'
  ],
  pwa: {
    meta: {
      mobileAppIOS: true,
      name: 'EthwSwap',
      author: 'ethwswap@gmail.com',
      description: 'EthwSwap',
      lang: 'en',
    },
    manifest: {
      name: 'EthwSwap',
      short_name: 'EthwSwap',
      description: 'Trading as Arbitrage',
    },
    workbox: {
      enabled: true
    }
  },
  experimental: {
    reactivityTransform: true,
    viteNode: false,
  },
  unocss: {
    preflight: true,
  },
  colorMode: {
    classSuffix: '',
  },
  i18n: {
    langDir: 'assets/locales/',
    lazy: true,
    baseUrl: 'http://localhost:3000',
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        file: 'en.json',
        name: 'English'
      },
      {
        code: 'zhCN',
        iso: 'zh-CN',
        file: 'zh-CN.json',
        name: '中文简体'
      }
    ],
    detectBrowserLanguage: false,
    onBeforeLanguageSwitch: (oldLocale, newLocale, initial, context) => {
      // console.log('onBeforeLanguageSwitch', oldLocale, newLocale, initial, context)
    },
    onLanguageSwitched: (oldLocale, newLocale) => {
      // console.log('onLanguageSwitched', oldLocale, newLocale)
    },
    vueI18n: {
      legacy: false,
      locale: "en",
    },
  },
  hooks: {
    'vite:extendConfig': function (config: any, { isServer }: any) {
      if (isServer) {
        config.build.rollupOptions.output.inlineDynamicImports = true
      }
    },
  },
})