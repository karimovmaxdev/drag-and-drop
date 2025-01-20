<script lang="ts" setup>
import { defineProps } from "vue";

// Пропсы для линии
defineProps({
  x1: {
    type: Number,
    required: true,
  },
  y1: {
    type: Number,
    required: true,
  },
  x2: {
    type: Number,
    required: true,
  },
  y2: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <line
    :x1="x1"
    :y1="y1"
    :x2="x2"
    :y2="y2"
    stroke="black"
    stroke-width="2"
  />
</template>
