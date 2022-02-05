import { Action, Module, VuexModule, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { GLOBAL_STORE } from "@/store-consts/moduleNames"
// import {
//     ACTION_GET_START_SPA_DATA,
//     GETTER_MAIN_SITE_LINK,
//     MUTATION_SET_FIXED_BG_NOT_DESTROY_ON_CLICK
// } from "@/store-consts"

export interface IGlobalState {

}

@Module({ name: GLOBAL_STORE, store, dynamic: true, namespaced: true, stateFactory: true })
export default class GlobalStore extends VuexModule implements IGlobalState {

    // get [GETTER_MAIN_SITE_LINK](): string {
    //     return ``
    // }
    //
    // @Mutation
    // [MUTATION_SET_FIXED_BG_NOT_DESTROY_ON_CLICK](status: boolean): void {
    // }
    //
    // @Action({ rawError: true })
    // async [ACTION_GET_START_SPA_DATA](): Promise<void> {
    //     // this.context.commit(MUTATION_UPDATE_APP_CONFIG, data.config)
    //     // this.context.commit(`${REGIONS_STORE}/${MUTATION_UPDATE_REGIONS_LIST}`, data.regions, { root: true })
    //     // this.context.commit(`${CATEGORIES_STORE}/${MUTATION_UPDATE_CATEGORIES_LIST}`, data.categories, { root: true })
    // }
}

export const GlobalModule = getModule(GlobalStore)
