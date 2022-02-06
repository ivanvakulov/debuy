<template>
<v-card
    class='mx-auto mb-4'
    outlined>
    <div class='pa-4'>
        <span class='text-overline'>Offer discount</span>
        <div>
            <v-slider
                v-if='isDiscountAvailable'
                v-model='discountValue'
                thumb-label
                :min='discountMinValue'
                max='100'
                ticks></v-slider>

            <v-btn
                color='primary'
                :loading='isDiscountLoading'
                :disabled='discountValue === discountMinValue || !isDiscountAvailable'
                large
                block
                @click='offerDiscount'>
                <span class='ml-2'>
                    Offer {{ discountValue }}% Discount
                </span>
            </v-btn>
        </div>
    </div>
</v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { AdvertModule } from "@/store/modules/AdvertStore";
import { ACTION_PROVIDE_DISCOUNT } from "@/store-consts";
import { Advert } from "../../../types/Advert";

const MAX_DISCOUNT = 100

@Component
export default class AdvertDiscountBlock extends Vue {
    @Prop({ type: Object, required: true })
    advert!: Advert | null

    @Prop({ type: [Number, String], required: true })
    advertId!: string | number

    get isDiscountAvailable(): boolean {
        return this.discountMinValue < MAX_DISCOUNT
    }

    get discountMinValue(): number {
        return this.advert?.discount || 0
    }

    discountValue: number = 0
    isDiscountLoading: boolean = false

    async offerDiscount() {
        this.isDiscountLoading = true

        await AdvertModule[ACTION_PROVIDE_DISCOUNT]({ id: this.advertId, discount: this.discountValue })

        this.isDiscountLoading = false
    }
}
</script>

<style lang="sass">

</style>
