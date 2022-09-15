<script setup lang="ts">
  const { t } = useI18n()
  const head = useLocaleHead({ addSeoAttributes: true })
  const title = computed(() => t('layouts.title', { title: 'Wang' }))
  </script>
  
  <template>
    <div class="h-full">
      <Html :lang="head?.htmlAttrs?.lang">
        <Head>
          <Title>{{ title }}</Title>
          <template v-for="(link, index) in head.link" :key="index">
            <Link :hid="link.hid" :rel="link.rel" :href="link.href" :hreflang="link.hreflang" />
          </template>
          <template v-for="(meta, index) in head.meta" :key="index">
            <Meta :hid="meta.hid" :property="meta.property" :content="meta.content" />
          </template>
        </Head>
        <Body>
          <div class="h-full">
            <div class="content--canvas"></div>
            <slot />
          </div>
        </Body>
      </Html>
    </div>
  </template>