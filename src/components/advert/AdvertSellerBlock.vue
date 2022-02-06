<template>
<v-card
    class='mx-auto mb-4'
    outlined>
    <v-list-item three-line>
        <v-list-item-content>
            <div class='text-overline mb-4'>
                Seller
            </div>
            <v-btn
                :href='explorerLink'
                :disabled='!explorerLink'
                target='_blank'
                color='primary'
                rounded>
                <v-icon>
                    mdi-open-in-new
                </v-icon>
                <span class='ml-2'>{{ sellerAddress }}</span>
            </v-btn>
        </v-list-item-content>

        <v-list-item-avatar
            rounded
            size='80'
            color='primary'>
            <v-icon
                color='white'
                size='40'>
                mdi-account-check
            </v-icon>
        </v-list-item-avatar>
    </v-list-item>
</v-card>

</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Chain } from "../../../types/Global";
import { GlobalModule } from "@/store/modules/GlobalStore";
import { GETTER_ACTIVE_CHAIN } from "@/store-consts";
import { Advert } from "../../../types/Advert";
import { getShortAddress } from "@/helpers/contract";

@Component
export default class AdvertSellerBlock extends Vue {
    @Prop({ type: Object, required: true })
    advert!: Advert | null

    get activeChain(): Chain | null {
        return GlobalModule[GETTER_ACTIVE_CHAIN]
    }

    get explorerLink(): string {
        return this.activeChain?.explorer ? `${this.activeChain?.explorer}${this.advert?.seller || ``}` : ``
    }

    get sellerAddress(): string {
        return this.advert?.seller ? getShortAddress(this.advert.seller) : ``
    }
}
</script>

<style lang="sass">

</style>
