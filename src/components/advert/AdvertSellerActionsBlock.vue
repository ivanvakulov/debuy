<template>
<v-card
    class='mx-auto mb-4'
    outlined>
    <div class='pa-4'>
        <v-tooltip
            v-if='isCreated'
            bottom>
            <template v-slot:activator='{ on, attrs }'>
                <v-btn
                    class='mb-4'
                    color='primary'
                    :disabled='!isCreated || isDeleteButtonLoading'
                    :loading='isLockFundsButtonLoading'
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
        <v-tooltip
            v-else
            bottom>
            <template v-slot:activator='{ on, attrs }'>
                <v-btn
                    class='mb-4'
                    color='success'
                    :disabled='!isSellerBacked || isDeleteButtonLoading'
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
            <span>You can withdraw while buyer has not staked funds</span>
        </v-tooltip>

        <v-btn
            class='mb-4'
            color='warning'
            :disabled='!isCreated || isDeleteButtonLoading || isLockFundsButtonLoading'
            large
            block
            @click='onEditClick'>
            <v-icon>
                mdi-pencil
            </v-icon>
            <span class='ml-2'>
                Edit
            </span>
        </v-btn>

        <v-btn
            color='error'
            :loading='isDeleteButtonLoading'
            :disabled='isDeleteDisabled || isLockFundsButtonLoading'
            large
            block
            @click='onDeleteClick'>
            <v-icon>
                mdi-delete
            </v-icon>
            <span class='ml-2'>
                Delete
            </span>
        </v-btn>
    </div>
</v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Advert, AdvertStatus } from "../../../types/Advert";
import {
    ACTION_APPLY_ADVERT,
    ACTION_DELETE_ADVERT,
    ACTION_WITHDRAW_ADVERT,
    MUTATION_ADVERT_TO_EDIT
} from "@/store-consts";
import { AdvertModule } from "@/store/modules/AdvertStore";
import { DEPOSIT_DENOMINATOR } from "@/helpers/consts";

@Component
export default class AdvertSellerActionsBlock extends Vue {
    @Prop({ type: Object, required: true })
    advert!: Advert | null

    @Prop({ type: [Number, String], required: true })
    advertId!: string | number

    isLockFundsButtonLoading: boolean = false
    isWithdrawButtonLoading: boolean = false
    isDeleteButtonLoading: boolean = false

    get isCreated(): boolean {
        return this.advert?.status === AdvertStatus.Created
    }

    get isSellerBacked(): boolean {
        return this.advert?.status === AdvertStatus.SellerBacked
    }

    get isBuyerBacked(): boolean {
        return this.advert?.status === AdvertStatus.BuyerBacked
    }

    get isDeleteDisabled(): boolean {
        return !this.isCreated && !this.isSellerBacked && !this.isBuyerBacked
    }

    onEditClick() {
        AdvertModule[MUTATION_ADVERT_TO_EDIT]({
            id: this.advertId,
            ...this.advert
        } as Advert)
    }

    async onDeleteClick() {
        this.isDeleteButtonLoading = true

        await AdvertModule[ACTION_DELETE_ADVERT](this.advertId)

        this.isDeleteButtonLoading = false
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
}
</script>

<style lang="sass">

</style>
