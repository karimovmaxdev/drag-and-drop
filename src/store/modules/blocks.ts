// store/modules/blocks.ts
import type { Module } from "vuex";

export interface IBlock {
  id: number;
  x: number;
  y: number;
}

export type selectedId = number | null;

export interface IBlocksState {
  blocks: IBlock[];
  draggingBlockId: selectedId;
}

const blocksModule: Module<IBlocksState, any> = {
  namespaced: true,
  state: () => ({
    blocks: [
      { id: 1, x: 100, y: 100 },
      { id: 2, x: 500, y: 100 },
      { id: 3, x: 100, y: 500 },
      { id: 4, x: 500, y: 500 },
    ], // Массив блоков для рендера
    draggingBlockId: null, // блок который драгается в данный момент
  }),
  mutations: {
    updateBlockPosition(state, { id, x, y }: IBlock) {
      const block = state.blocks.find((b) => b.id === id);
      if (block) {
        block.x = x;
        block.y = y;
      }
    },
    setDraggingBlock(state, blockId: number | null) {
      state.draggingBlockId = blockId;
    },
  },
  getters: {
    allBlocks(state) {
      return state.blocks;
    },
    draggingBlockId(state) {
      return state.draggingBlockId;
    },
  },
};

export default blocksModule;
