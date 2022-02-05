import { Action, Module, VuexModule, Mutation, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { ACTION_LOGIN, AUTH_STORE } from "@/store-consts"
import Moralis from "moralis/dist/moralis.min.js";
import User = Moralis.User;

export interface IAuthState {
    account: string | null
}

@Module({ name: AUTH_STORE, store, dynamic: true, namespaced: true, stateFactory: true })
class AuthStore extends VuexModule implements IAuthState {
    account: string | null = null
    user: User | null = Moralis.User.current() || null;
    // get [GETTER_MAIN_SITE_LINK](): string {
    //     return ``
    // }
    //
    // @Mutation
    // [MUTATION_SET_FIXED_BG_NOT_DESTROY_ON_CLICK](status: boolean): void {
    //     this.fixedBgNotDestroyOnClick = status
    // }
    //
    @Action({ rawError: true })
    async [ACTION_LOGIN](): Promise<void> {
        try {
            const web3Provider = await Moralis.enableWeb3();
            console.log(web3Provider, Moralis.isWeb3Enabled())
            // if (!this.user) {
            // user = await Moralis.authenticate();
            // }
        }  catch (e) {
            console.log(e)
            return Promise.resolve()
        }
    }
}

export const AuthModule = getModule(AuthStore)
