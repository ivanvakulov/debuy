import { Action, Module, VuexModule, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { ACTION_LOGIN, ACTION_LOGOUT, GETTER_SHORT_ADDRESS, ACTION_SET_MAIN_SUBSCRIBERS, AUTH_STORE, MUTATION_LOGIN } from "@/store-consts"
import Moralis from "moralis/dist/moralis.min.js";
import { USER_ACCOUNT_KEY } from "@/helpers/consts";

export interface IAuthState {
    account: string | null
}

@Module({ name: AUTH_STORE, store, dynamic: true, namespaced: true, stateFactory: true })
class AuthStore extends VuexModule implements IAuthState {
    account: string | null = localStorage.getItem(USER_ACCOUNT_KEY) || null

    get [GETTER_SHORT_ADDRESS](): string {
        if (!this.account) return ``

        return `${this.account.substring(0, 5)}...${this.account.slice(-4)}`
    }

    @Mutation
    [MUTATION_LOGIN](account: string | null): void {
        localStorage.setItem(USER_ACCOUNT_KEY, account || ``)
        this.account = account
    }

    @Action({ rawError: true })
    async [ACTION_LOGIN](): Promise<void> {
        try {
            await Moralis.enableWeb3()

            this.context.commit(MUTATION_LOGIN, Moralis.account)
        }  catch (e) {
            console.log(e)
            return Promise.resolve()
        }
    }

    @Action({ rawError: true })
    async [ACTION_LOGOUT](): Promise<void> {
        this.context.commit(MUTATION_LOGIN, null)
    }

    @Action({ rawError: true })
    async [ACTION_SET_MAIN_SUBSCRIBERS](): Promise<void> {
        try {
            if ((this.context.state as IAuthState).account) {
                await this.context.dispatch(ACTION_LOGIN)
            }

            // Moralis.onWeb3Enabled((result) => {
            //     console.log(`ENABLED`, result)
            // })
            //
            // Moralis.onWeb3Deactivated((result) => {
            //     console.log(`DEACTIVATED`, result)
            // })

            Moralis.onAccountChanged((account: string | null) => {
                console.log(`ACC CHANGED`, account)
                if (!account) {
                    this.context.dispatch(ACTION_LOGOUT)
                } else {
                    this.context.commit(MUTATION_LOGIN, account)
                }
            })

            Moralis.onChainChanged((chainId: string | null) => {
                console.log(`CHANGED CHAIN`, chainId)
            })
        }  catch (e) {
            console.log(e)
            return Promise.resolve()
        }
    }
}

export const AuthModule = getModule(AuthStore)
