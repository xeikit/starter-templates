<script setup lang="ts">
const defaultLayoutId = useId();
</script>

<template>
  <main :id="defaultLayoutId">
    <slot />
  </main>
</template>
