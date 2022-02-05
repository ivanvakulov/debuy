import Vue from 'vue';
import Vuex from 'vuex';
import { IGlobalState } from "@/store/modules/GlobalStore";
import { IAuthState } from "@/store/modules/AuthStore";

Vue.use(Vuex);

// const store = new Vuex.Store({
//     state: {},
//     mutations: {},
//     actions: {},
//     modules: {
//         GlobalStore,
//         AuthStore,
//     },
// });
export interface IRootState {
  GlobalStore: IGlobalState
  AuthStore: IAuthState
}

export default new Vuex.Store<IRootState>({})
// export const GlobalStoreModule = getModule(GlobalStore, store);
// export const AuthStoreModule = getModule(AuthStore, store);
