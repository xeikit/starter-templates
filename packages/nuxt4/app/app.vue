<script setup lang="ts">
const nuxtAppId = useId();
</script>

<template>
  <div :id="nuxtAppId">
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
