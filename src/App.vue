<script lang="ts" setup>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import type { IBlock } from "./store/modules/blocks";
import type { IConnection } from "./store/modules/connections";

const store = useStore();
// Данные о блоках и текущем перетаскиваемом блоке
const blocks = computed<IBlock[]>(() => store.getters["blocks/allBlocks"]);
const currentDraggingBlock = computed<IBlock | null>(
  () => store.getters["blocks/currentDraggingBlock"]
);
const offset = ref({ x: 0, y: 0 }); // Смещение курсора относительно блока

// Список связей и выбранного блока для обновления связей
const connections = computed<IConnection[]>(
  () => store.getters["connections/allConnections"]
);
const selectedBlockId = computed<number | null>(
  () => store.getters["connections/selectedBlockId"]
);

// Начало перетаскивания
const startDrag = (event: PointerEvent, blockId: number) => {
  const block = blocks.value.find((b) => b.id === blockId);
  if (!block) return;

  store.commit("blocks/setCurrentDraggingBlock", block);

  // Вычисляем смещение курсора относительно блока
  offset.value = {
    x: event.clientX - block.x,
    y: event.clientY - block.y,
  };

  const target = event.target as HTMLElement;
  target.setPointerCapture(event.pointerId);
  if (currentDraggingBlock.value) {
    selectBlock(currentDraggingBlock.value.id);
  }
};

// Перетаскивание
const drag = (event: PointerEvent) => {
  if (!currentDraggingBlock.value) return;

  // Обновляем координаты блока через
  store.commit("blocks/updateBlockPosition", {
    id: currentDraggingBlock.value.id,
    x: event.clientX - offset.value.x,
    y: event.clientY - offset.value.y,
  });
};

// Завершение перетаскивания
const stopDrag = (event: PointerEvent) => {
  if (currentDraggingBlock.value !== null) {
    const target = event.target as HTMLElement;
    target.releasePointerCapture(event.pointerId);
    store.commit("blocks/setCurrentDraggingBlock", null);
  }
};

// Выбрать блок для установки связи
const selectBlock = (blockId: number) => {
  // Если ни один блок не выбран, выбираем текущий
  if (selectedBlockId.value === null) {
    const block = blocks.value.find((b) => b.id === blockId);
    store.commit("connections/setSelectedBlock", blockId);
    store.commit("blocks/setCurrentDraggingBlock", block); // Устанавливаем текущий перетаскиваемый блок
  } else {
    // Если блок уже выбран, проверяем на существующую связь
    const existingConnectionIndex = connections.value.findIndex(
      (connection) =>
        (connection.from === selectedBlockId.value &&
          connection.to === blockId) ||
        (connection.from === blockId && connection.to === selectedBlockId.value)
    );

    if (existingConnectionIndex !== -1) {
      // Если связь существует, удаляем ее
      store.commit("connections/removeConnection", {
        from: selectedBlockId.value,
        to: blockId,
      });
    } else if (selectedBlockId.value !== blockId) {
      // Если связи нет, создаем новую
      store.commit("connections/addConnection", {
        from: selectedBlockId.value,
        to: blockId,
      });
    }

    // Сбрасываем выбор
    store.commit("connections/setSelectedBlock", null);
    store.commit("blocks/setCurrentDraggingBlock", null);
  }
};

// Вычисляем координаты всех связей
const connectionLines = computed(() =>
  connections.value
    .map((connection) => {
      const fromBlock = blocks.value.find((b) => b.id === connection.from);
      const toBlock = blocks.value.find((b) => b.id === connection.to);

      if (!fromBlock || !toBlock) return false;

      return {
        x1: fromBlock.x + 50,
        y1: fromBlock.y + 50,
        x2: toBlock.x + 50,
        y2: toBlock.y + 50,
      };
    })
    .filter((line) => line !== false)
);

const clickOutside = () => {
  store.commit("connections/setSelectedBlock", null);
  store.commit("blocks/setCurrentDraggingBlock", null);
};
</script>

<template>
  <div @pointerup="clickOutside" id="parent">
    <!-- SVG для отрисовки связей -->
    <svg class="connections">
      <line
        v-for="(line, index) in connectionLines"
        :key="index"
        :x1="line.x1"
        :y1="line.y1"
        :x2="line.x2"
        :y2="line.y2"
        stroke="black"
        stroke-width="2"
      />
    </svg>

    <!-- Блоки -->
    <div
      v-for="block in blocks"
      :key="block.id"
      :style="{ transform: `translate(${block.x}px, ${block.y}px)` }"
      class="box"
      :class="{ selected: block.id === selectedBlockId }"
      @pointerdown="startDrag($event, block.id)"
      @pointermove="drag"
      @pointerup.stop="stopDrag"
      @pointerleave="stopDrag"
    >
      <span>{{ block.id }}</span>
    </div>
  </div>
</template>

<style scoped>
#parent {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: gainsboro;
  overflow: hidden;
}

.connections {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

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
