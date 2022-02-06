import { Action, Module, VuexModule, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import {
    ACTION_LOGIN,
    ACTION_LOGOUT,
    GETTER_SHORT_ADDRESS,
    ACTION_SET_MAIN_SUBSCRIBERS,
    AUTH_STORE,
    MUTATION_LOGIN,
    ACTION_ENABLE_WEB3, MUTATION_SET_SUPPORTED_CHAINS, ACTION_UPDATE_ACTIVITY
} from "@/store-consts"
import Moralis from "moralis/dist/moralis.min.js";
import { SUPPORTED_CHAINS, USER_ACCOUNT_KEY } from "@/helpers/consts";
import { getContractParameters, getShortAddress } from "@/helpers/contract";
import { GlobalModule } from "@/store/modules/GlobalStore";

export interface IAuthState {
    account: string | null
}

@Module({ name: AUTH_STORE, store, dynamic: true, namespaced: true, stateFactory: true })
class AuthStore extends VuexModule implements IAuthState {
    account: string | null = localStorage.getItem(USER_ACCOUNT_KEY) || null

    get [GETTER_SHORT_ADDRESS](): string {
        if (!this.account) return ``

        return getShortAddress(this.account)
    }

    @Mutation
    [MUTATION_LOGIN](account: string | null): void {
        localStorage.setItem(USER_ACCOUNT_KEY, account || ``)
        this.account = account
    }

    @Action({ rawError: true })
    async [ACTION_LOGIN](): Promise<void> {
        try {
            await Moralis.authenticate()

            this.context.commit(MUTATION_LOGIN, Moralis.account)
        }  catch (e) {
            console.log(e)
            return Promise.resolve()
        }
    }

    @Action({ rawError: true })
    async [ACTION_ENABLE_WEB3](): Promise<void> {
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
        await Moralis.User.logOut()
        this.context.commit(MUTATION_LOGIN, null)
    }

    @Action({ rawError: true })
    async [ACTION_UPDATE_ACTIVITY](): Promise<void> {
        try {
            const options = getContractParameters(`updateActivity`, {})

            const transaction = await Moralis.executeFunction(options)

            await transaction.wait();
        }  catch (e) {
            console.log(e)
            return Promise.resolve()
        }
    }

    @Action({ rawError: true })
    async [ACTION_SET_MAIN_SUBSCRIBERS](): Promise<void> {
        try {
            if ((this.context.state as IAuthState).account) {
                await this.context.dispatch(ACTION_ENABLE_WEB3)
            }

            GlobalModule[MUTATION_SET_SUPPORTED_CHAINS](SUPPORTED_CHAINS)

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
