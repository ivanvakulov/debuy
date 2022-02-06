<template>
<v-menu
    :close-on-content-click='false'
    :nudge-width='200'
    offset-x>
    <template v-slot:activator='{ on, attrs }'>
        <v-btn
            class='b-header-block mx-2'
            color='white'
            elevation='2'
            icon
            outlined
            x-large
            v-bind='attrs'
            v-on='on'>
            <v-img
                v-if='activeChain && activeChain.slug === "mumbai"'
                width='30px'
                src='@/assets/mumbai.svg'>
            </v-img>
            <v-img
                v-if='activeChain && activeChain.slug === "rinkeby"'
                width='30px'
                src='@/assets/rinkeby.svg'>
            </v-img>
        </v-btn>
    </template>

    <v-card>
        <v-list>
            <v-list-item>
                <v-btn
                    class='mr-4'
                    color='primary'
                    elevation='2'
                    icon
                    disabled
                    large>
                    <v-img
                        v-if='activeChain && activeChain.slug === "mumbai"'
                        width='30px'
                        src='@/assets/mumbai.svg'>
                    </v-img>
                    <v-img
                        v-if='activeChain && activeChain.slug === "rinkeby"'
                        width='30px'
                        src='@/assets/rinkeby.svg'>
                    </v-img>
                </v-btn>

                <v-list-item-content>
                    <v-list-item-title>{{ accountShort }}</v-list-item-title>
                    <v-list-item-subtitle>{{ activeChainSymbol }}</v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action>
                    <v-badge
                        color='success'
                        dot></v-badge>
                </v-list-item-action>
            </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list nav>
            <v-list-item-group>
                <v-tooltip left>
                    <template v-slot:activator='{ on, attrs }'>
                        <v-list-item v-bind='attrs'
                                     v-on='on'
                                     @click='updateActivity'>
                            <v-list-item-content>
                                <v-list-item-title>
                                    <v-progress-circular
                                        v-if='isUpdateActivityLoading'
                                        indeterminate
                                        size='25'
                                        color='primary'></v-progress-circular>
                                    <template v-else>
                                        Last Activity: {{ lastActiveText || `-` }}
                                    </template>
                                </v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </template>
                    <span>Click to update activity</span>
                </v-tooltip>

                <v-list-item @click='goToMyAdverts'>
                    <v-list-item-content>
                        <v-list-item-title>My Adverts</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-card>
</v-menu>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import { AuthModule } from "@/store/modules/AuthStore";
import { GETTER_SHORT_ADDRESS, GETTER_ACTIVE_CHAIN, ACTION_UPDATE_ACTIVITY } from "@/store-consts";
import { Chain } from "../../../types/Global";
import { GlobalModule } from "@/store/modules/GlobalStore";

@Component
export default class UserMenu extends Vue {
    @Prop({ type: String, default: `` })
    lastActiveText!: string

    isUpdateActivityLoading: boolean = false
    isUpdated: boolean = false

    get account(): string | null {
        return AuthModule.account || null
    }

    get accountShort(): string | null {
        return AuthModule[GETTER_SHORT_ADDRESS] || null
    }

    get activeChain(): Chain | null {
        return GlobalModule[GETTER_ACTIVE_CHAIN]
    }

    get activeChainSymbol(): string | null {
        return this.activeChain?.symbol || null
    }

    async updateActivity() {
        this.isUpdateActivityLoading = true

        await AuthModule[ACTION_UPDATE_ACTIVITY]()

        this.emitUpdatedActivity()

        this.isUpdateActivityLoading = false
    }

    goToMyAdverts() {
        this.$router.push({ name: `MyAdvertsPage` })
    }

    @Emit(`updatedActivity`)
    emitUpdatedActivity() {}
}
</script>

<style lang="sass">

</style>
