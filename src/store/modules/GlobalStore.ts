import { Module, VuexModule, getModule, Mutation } from 'vuex-module-decorators'
import store from '@/store'
import { Chain } from "../../../types/Global";
import {
    GLOBAL_STORE,
    GETTER_ACTIVE_CHAIN,
    MUTATION_SET_SUPPORTED_CHAINS,
    MUTATION_SET_ACTIVE_CHAIN
} from "@/store-consts";
import Moralis from "moralis/dist/moralis.min.js";

export interface IGlobalState {
    supportedChains: Array<Chain>
}

@Module({ name: GLOBAL_STORE, store, dynamic: true, namespaced: true, stateFactory: true })
export default class GlobalStore extends VuexModule implements IGlobalState {
    supportedChains: Array<Chain> = []
    activeChain: Chain | null = null

    get [GETTER_ACTIVE_CHAIN](): Chain | null {
        return this.activeChain
    }

    @Mutation
    [MUTATION_SET_ACTIVE_CHAIN](chainId?: string): void {
        this.activeChain = this.supportedChains.find(chain => chain.id === (chainId || Moralis.getChainId())) || null
    }

    @Mutation
    [MUTATION_SET_SUPPORTED_CHAINS](chains: Array<Chain>): void {
        this.supportedChains = chains
        this.activeChain = this.supportedChains.find(chain => chain.id === Moralis.getChainId()) || null
    }
}

export const GlobalModule = getModule(GlobalStore)
