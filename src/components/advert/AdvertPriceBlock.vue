<template>
<v-card
    class='mx-auto mb-4'
    outlined>
    <div class='d-flex justify-space-between pa-4'>
        <span class='text-overline'>Price</span>
        <v-chip
            color='primary'
            label>
            <v-icon left>
                mdi-plus-circle-multiple
            </v-icon>
            {{ price }} {{ activeChainSymbol }}
        </v-chip>
    </div>
</v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Chain } from "../../../types/Global";
import { GlobalModule } from "@/store/modules/GlobalStore";
import { GETTER_ACTIVE_CHAIN } from "@/store-consts";
import { Advert } from "../../../types/Advert";
import Moralis from "moralis/dist/moralis.min.js";

@Component
export default class AdvertPriceBlock extends Vue {
    @Prop({ type: Object, required: true })
    advert!: Advert | null

    get activeChain(): Chain | null {
        return GlobalModule[GETTER_ACTIVE_CHAIN]
    }

    get activeChainSymbol(): string | null {
        return this.activeChain?.symbol || null
    }

    get price(): string {
        return this.advert?.price ? Moralis.Units.FromWei(`${this.advert?.price}`) : ``
    }
}
</script>

<style lang="sass">

</style>
