<template>
<v-card
    class='mx-auto mb-4'
    outlined>
    <v-list-item three-line>
        <v-list-item-content>
            <div class='text-overline mb-4'>
                Seller {{ isSeller ? `(You)` : `` }}
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
import { AuthModule } from "@/store/modules/AuthStore";

@Component
export default class AdvertSellerBlock extends Vue {
    @Prop({ type: Object, required: true })
    advert!: Advert | null

    get isSeller(): boolean {
        return this.advert?.seller === AuthModule.account
    }

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
