<template>
<v-card
    class='mx-auto mb-4'
    outlined>
    <div class='pa-4'>
        <v-tooltip
            v-if='isCreated || isSellerBacked'
            bottom>
            <template v-slot:activator='{ on, attrs }'>
                <v-btn
                    class='mb-4'
                    color='primary'
                    :loading='isLockFundsButtonLoading'
                    large
                    block
                    v-bind='attrs'
                    v-on='on'
                    @click='lockFunds'>
                    <v-icon>
                        mdi-gold
                    </v-icon>
                    <span class='ml-2'>
                        Apply and stake
                    </span>
                </v-btn>
            </template>
            <span>To confirm this purchase you should lock 2x of its price</span>
        </v-tooltip>
        <v-tooltip
            v-else
            bottom>
            <template v-slot:activator='{ on, attrs }'>
                <v-btn
                    class='mb-4'
                    color='success'
                    :disabled='!isBuyerBacked'
                    :loading='isWithdrawButtonLoading'
                    large
                    block
                    v-bind='attrs'
                    v-on='on'
                    @click='withdrawFunds'>
                    <v-icon>
                        mdi-currency-usd
                    </v-icon>
                    <span class='ml-2'>
                        Withdraw
                    </span>
                </v-btn>
            </template>
            <span>You can withdraw while seller has not staked funds</span>
        </v-tooltip>

        <v-tooltip bottom>
            <template v-slot:activator='{ on, attrs }'>
                <v-btn
                    color='success'
                    :disabled='!isMyActivePurchase'
                    :loading='isConfirmButtonLoading'
                    large
                    block
                    v-bind='attrs'
                    v-on='on'
                    @click='confirmClose'>
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
import { DEPOSIT_DENOMINATOR } from "@/helpers/consts";
import { AdvertModule } from "@/store/modules/AdvertStore";
import { ACTION_APPLY_ADVERT, ACTION_CONFIRM_ADVERT, ACTION_WITHDRAW_ADVERT } from "@/store-consts";

@Component
export default class AdvertBuyerActionsBlock extends Vue {
    @Prop({ type: Object, required: true })
    advert!: Advert | null

    @Prop({ type: [Number, String], required: true })
    advertId!: string | number

    isLockFundsButtonLoading: boolean = false
    isWithdrawButtonLoading: boolean = false
    isConfirmButtonLoading: boolean = false

    get isCreated(): boolean {
        return this.advert?.status === AdvertStatus.Created
    }

    get isMyActivePurchase(): boolean {
        return this.advert?.buyer === AuthModule.account && this.isActive
    }

    get isSellerBacked(): boolean {
        return this.advert?.status === AdvertStatus.SellerBacked
    }

    get isBuyerBacked(): boolean {
        return this.advert?.status === AdvertStatus.BuyerBacked
    }

    get isActive(): boolean {
        return this.advert?.status === AdvertStatus.Active
    }

    async lockFunds() {
        this.isLockFundsButtonLoading = true

        if (this.advert) {
            const value = this.advert.price * this.advert.sellerRatio / DEPOSIT_DENOMINATOR

            await AdvertModule[ACTION_APPLY_ADVERT]({
                id: this.advertId,
                value: value
            })
        }

        this.isLockFundsButtonLoading = false
    }

    async withdrawFunds() {
        this.isWithdrawButtonLoading = true

        await AdvertModule[ACTION_WITHDRAW_ADVERT](this.advertId)

        this.isLockFundsButtonLoading = false
    }

    async confirmClose() {
        this.isConfirmButtonLoading = true

        await AdvertModule[ACTION_CONFIRM_ADVERT](this.advertId)

        this.isConfirmButtonLoading = false
    }
}
</script>

<style lang="sass">

</style>
