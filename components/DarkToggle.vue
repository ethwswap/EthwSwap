<script setup lang="ts">
const color = useColorMode()

function toggleDark() {
  color.preference = color.value === 'dark' ? 'light' : 'dark'
}
</script>
  
<template>
  <button aria-label="DarkToggle" dark="text-white" light="text-black" hover="opacity-100" class="text-fs24 opacity-50 transition delay-50 !outline-none" @click="toggleDark">
    <div class="dark:i-carbon-moon i-carbon-sun text-fs24" />
  </button>
</template>
  