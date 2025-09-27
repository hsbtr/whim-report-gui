<script setup lang="ts">
import EChartBar from "@/components/ve-chart/EChartBar.vue";
</script>
<template>
  <div class="about">

    <EChartBar title="shh" :data-source="[]" />
  </div>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
