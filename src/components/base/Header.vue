<template>
<v-app-bar
    app
    color='primary'
    dark>
    <div class='d-flex align-center'>
        <v-img
            alt='Debuy'
            class='shrink mt-1 hidden-sm-and-down'
            contain
            min-width='100'
            src='@/assets/logo-white.svg'
            width='100'></v-img>
    </div>

    <v-spacer></v-spacer>

    <v-btn
        v-if='account'
        class='mx-2'
        color='white'
        elevation='2'
        icon
        outlined
        x-large>
        <v-icon>
            mdi-account
        </v-icon>
    </v-btn>
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
import { ACTION_LOGIN } from "@/store-consts";
import { AuthModule } from "@/store/modules/AuthStore";
import Moralis from "moralis";

@Component
export default class Header extends Vue {
    account: string | null = AuthModule.account || null
    isLoginLoading: boolean = false

    async onLoginClick(): Promise<void> {
        this.isLoginLoading = true

        await AuthModule[ACTION_LOGIN]()

        this.isLoginLoading = false
    }

    mounted() {
        console.log(Moralis.isWeb3Enabled())
    }
}
</script>

<style lang="sass">

</style>
