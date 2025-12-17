<script setup lang="ts">
const appId = useId();
</script>

<template>
  <div :id="appId">
    <NuxtRouteAnnouncer />
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
