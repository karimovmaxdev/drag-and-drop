// store/modules/connections.ts
import type { Module } from "vuex";

export interface IConnection {
  from: number;
  to: number;
}

export type activeBlock = number | null;

export interface IConnectionsState {
  connections: IConnection[];
  selectedBlockId: activeBlock;
}

const connectionsModule: Module<IConnectionsState, any> = {
  namespaced: true,
  state: () => ({
    connections: [], // Список связей
    selectedBlockId: null, // выбранный блок, готовый установить или разорвать связь
  }),
  mutations: {
    addConnection(state, connection: IConnection) {
      state.connections.push(connection);
    },
    removeConnection(state, connection: IConnection) {
      state.connections = state.connections.filter(
        (c) =>
          !(
            (c.from === connection.from && c.to === connection.to) ||
            (c.from === connection.to && c.to === connection.from)
          )
      );
    },
    clearConnections(state) {
      state.connections = [];
    },
    setSelectedBlock(state, blockId: number | null) {
      state.selectedBlockId = blockId;
    },
  },
  getters: {
    allConnections(state) {
      return state.connections;
    },
    selectedBlockId(state) {
      return state.selectedBlockId;
    },
  },
};

export default connectionsModule;
