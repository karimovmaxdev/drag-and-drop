import { createStore } from "vuex";
import blocksModule from "./modules/blocks.ts";
import connectionsModule from "./modules/connections.ts";

const store = createStore({
  modules: {
    blocks: blocksModule,
    connections: connectionsModule,
  },
});

export default store;
