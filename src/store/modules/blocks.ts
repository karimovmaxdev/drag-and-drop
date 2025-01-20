// store/modules/blocks.ts
import type { Module } from "vuex";

export interface IBlock {
  id: number;
  x: number;
  y: number;
}

export type selectedId = number | null;

export interface IBlocksState {
  blocks: IBlock[]; // список всех блоков для рендера
  currentDraggingBlock: IBlock | null; // блок который перетаскивается в данный момент
}

const blocksModule: Module<IBlocksState, any> = {
  namespaced: true,
  state: () => ({
    blocks: [
      { id: 1, x: 100, y: 100 },
      { id: 2, x: 500, y: 100 },
      { id: 3, x: 100, y: 500 },
      { id: 4, x: 500, y: 500 },
    ],
    currentDraggingBlock: null,
  }),
  mutations: {
    updateBlockPosition(state, { id, x, y }: IBlock) {
      const block = state.blocks.find((b) => b.id === id);
      if (block) {
        block.x = x;
        block.y = y;
      }
    },
    setCurrentDraggingBlock(state, block: IBlock | null) {
      state.currentDraggingBlock = block;
    },
  },
  getters: {
    allBlocks(state) {
      return state.blocks;
    },
    currentDraggingBlock(state) {
      return state.currentDraggingBlock;
    },
  },
};

export default blocksModule;
