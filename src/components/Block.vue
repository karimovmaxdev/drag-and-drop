<script lang="ts" setup>
import { defineProps } from "vue";
import type { IBlock } from "../store/modules/blocks";

defineProps<{
  block: IBlock;
  isSelected?: boolean;
}>();

const emit = defineEmits(["dragstart", "drag", "dragend"]);
</script>

<template>
  <div
    :style="{ transform: `translate(${block.x}px, ${block.y}px)` }"
    class="box"
    :class="{ selected: isSelected }"
    @pointerdown="$emit('dragstart', $event, block.id)"
    @pointermove="$emit('drag', $event)"
    @pointerup.stop="$emit('dragend', $event)"
    @pointerleave="$emit('dragend', $event)"
  >
    <span>{{ block.id }}</span>
  </div>
</template>

<style scoped>
.box {
  position: absolute;
  width: 100px;
  height: 100px;
  background: indianred;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
  user-select: none;
  border-radius: 5px;
}

.box.selected {
  border: 3px solid yellow;
  background: lightcoral;
  cursor: pointer;
}
</style>
