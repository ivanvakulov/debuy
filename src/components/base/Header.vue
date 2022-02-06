<template>
<v-app-bar
    app
    color='primary'
    dark>
    <div class='d-flex align-center'>
        <router-link :to='{ name: "HomePage" }'>
            <v-img
                alt='Debuy'
                class='shrink mt-1 hidden-sm-and-down'
                contain
                min-width='100'
                src='@/assets/logo-white.svg'
                width='100'></v-img>
        </router-link>
    </div>

    <v-spacer></v-spacer>

    <v-chip
        v-if='account'
        class='ma-2'
        close
        color='white'
        text-color='primary'
        @click:close='onLogoutClick'>
        {{ accountShort }}
    </v-chip>
    <UserMenu
        v-if='account'
        :last-active-text='lastActiveText'
        @updatedActivity='loadActivity'>
    </UserMenu>
    <v-btn
        v-else
        text
        :loading='isLoginLoading'
        @click='onLoginClick'>
        <v-icon>
            mdi-login
        </v-icon>
        <span class='ml-2'>Connect</span>
    </v-btn>
</v-app-bar>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import UserMenu from "@/components/base/UserMenu.vue";
import { ACTION_LOAD_ACTIVITY, ACTION_LOGIN, ACTION_LOGOUT } from "@/store-consts";
import { AuthModule } from "@/store/modules/AuthStore";
import { GETTER_SHORT_ADDRESS } from "@/store-consts/getterNames/modules/auth";
import Moralis from "moralis/dist/moralis.min.js";

@Component({
    components: { UserMenu }
})
export default class Header extends Vue {
    isLoginLoading: boolean = false
    lastActive: number | null = null
    unubscribe: any = null

    get account(): string | null {
        return AuthModule.account || null
    }

    get accountShort(): string | null {
        return AuthModule[GETTER_SHORT_ADDRESS] || null
    }

    get lastActiveText(): string {
        return this.lastActive ? new Date(this.lastActive * 1000).toLocaleDateString() : ``
    }

    async onLoginClick(): Promise<void> {
        this.isLoginLoading = true

        await AuthModule[ACTION_LOGIN]()

        this.isLoginLoading = false
    }

    async onLogoutClick(): Promise<void> {
        await AuthModule[ACTION_LOGOUT]()
    }

    async loadActivity(): Promise<void> {
        this.lastActive = await AuthModule[ACTION_LOAD_ACTIVITY](this.account as string)
    }

    created() {
        if (Moralis.isWeb3Enabled()) {
            this.loadActivity()
        } else {
            this.unubscribe = Moralis.onWeb3Enabled(async() => {
                this.loadActivity()
            })
        }
    }

    beforeDestroy() {
        if (this.unubscribe) {
            this.unubscribe()
        }
    }
}
</script>

<style lang="sass">

</style>
