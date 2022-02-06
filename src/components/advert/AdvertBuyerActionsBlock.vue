<template>
<v-card
    class='mx-auto mb-4'
    outlined>
    <div class='pa-4'>
        <v-tooltip bottom>
            <template v-slot:activator='{ on, attrs }'>
                <v-btn
                    class='mb-4'
                    color='primary'
                    :disabled='!isCreated'
                    :loading='false'
                    large
                    block
                    v-bind='attrs'
                    v-on='on'
                    @click='lockFunds'>
                    <v-icon>
                        mdi-gavel
                    </v-icon>
                    <span class='ml-2'>
                        Confirm and Lock
                    </span>
                </v-btn>
            </template>
            <span>To confirm this purchase you should lock 2x of its price</span>
        </v-tooltip>

        <v-tooltip bottom>
            <template v-slot:activator='{ on, attrs }'>
                <v-btn
                    color='success'
                    :disabled='!isMyPurchase'
                    :loading='false'
                    large
                    block
                    v-bind='attrs'
                    v-on='on'
                    @click='lockFunds'>
                    <v-icon>
                        mdi-archive-arrow-down-outline
                    </v-icon>
                    <span class='ml-2'>
                        Confirm Receiving
                    </span>
                </v-btn>
            </template>
            <span>After receiving confirm it to reveal guarantee</span>
        </v-tooltip>
    </div>
</v-card>

</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Advert, AdvertStatus } from "../../../types/Advert";
import { AuthModule } from "@/store/modules/AuthStore";

@Component
export default class AdvertBuyerActionsBlock extends Vue {
    @Prop({ type: Object, required: true })
    advert!: Advert | null

    get isCreated(): boolean {
        return this.advert?.status === AdvertStatus.Created
    }

    get isMyPurchase(): boolean {
        return this.advert?.buyer === AuthModule.account && this.isBuyerBacked
    }

    get isBuyerBacked(): boolean {
        return this.advert?.status === AdvertStatus.BuyerBacked
    }

    lockFunds() {

    }
}
</script>

<style lang="sass">

</style>
