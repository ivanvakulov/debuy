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
                    :disabled='!isCreated || isDeleteButtonLoading'
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

        <v-btn
            class='mb-4'
            color='warning'
            :disabled='!isCreated || isDeleteButtonLoading'
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
import { ACTION_DELETE_ADVERT, MUTATION_ADVERT_TO_EDIT } from "@/store-consts";
import { AdvertModule } from "@/store/modules/AdvertStore";

@Component
export default class AdvertSellerActionsBlock extends Vue {
    @Prop({ type: Object, required: true })
    advert!: Advert | null

    @Prop({ type: [Number, String], required: true })
    advertId!: string | number

    isDeleteButtonLoading: boolean = false

    get isCreated(): boolean {
        return this.advert?.status === AdvertStatus.Created
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

    lockFunds() {

    }
}
</script>

<style lang="sass">

</style>
