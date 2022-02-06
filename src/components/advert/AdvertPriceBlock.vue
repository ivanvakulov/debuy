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
import { Advert } from "../../../types/Advert";
import Moralis from "moralis/dist/moralis.min.js";
import { SUPPORTED_CHAINS } from "@/helpers/consts";

@Component
export default class AdvertPriceBlock extends Vue {
    @Prop({ type: Object, required: true })
    advert!: Advert | null

    get activeChain(): Chain | null {
        const chain = SUPPORTED_CHAINS.find(e => e.id === this.advert?.chain || e.slug === this.advert?.chain)

        return chain || null
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
