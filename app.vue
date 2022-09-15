<script setup lang="ts">
const { t } = useI18n()
useHead({
  title: t('layouts.title'),
})
</script>
  
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
