import { Module, VuexModule, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { Chain } from "../../../types/Global";
import { GLOBAL_STORE, GETTER_ACTIVE_CHAIN } from "@/store-consts";
import Moralis from "moralis/dist/moralis.min.js";

export interface IGlobalState {
    supportedChains: Array<Chain>
}

@Module({ name: GLOBAL_STORE, store, dynamic: true, namespaced: true, stateFactory: true })
export default class GlobalStore extends VuexModule implements IGlobalState {
    supportedChains: Array<Chain> = [
        {
            id: `0x13881`,
            symbol: `MATIC`,
            address: `0x3aC41c017b4813fF73E15d1031E30a2A7048bA76`,
        }
    ]

    get [GETTER_ACTIVE_CHAIN](): Chain | null {
        return this.supportedChains.find(chain => chain.id === Moralis.getChainId()) || null
    }
}

export const GlobalModule = getModule(GlobalStore)
