<script setup lang="ts">
import Index from '@/components/index/Index.vue';

const indexPageId = useId();
</script>

<template>
  <section :id="indexPageId">
    <Index />
  </section>
</template>
