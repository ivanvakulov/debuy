<template>
<v-card
    class='mx-auto mb-4'
    outlined>
    <div class='pa-4'>
        <v-tooltip bottom>
            <template v-slot:activator='{ on, attrs }'>
                <v-btn
                    color='error'
                    :loading='isForceCloseLoading'
                    large
                    block
                    v-bind='attrs'
                    v-on='on'
                    @click='forceClose'>
                    <v-icon>
                        mdi-close-circle-outline
                    </v-icon>
                    <span class='ml-2'>
                        Force Close
                    </span>
                </v-btn>
            </template>
            <span>This deal can be fairly closed due to the second side inactivity</span>
        </v-tooltip>
    </div>
</v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { ACTION_FORCE_CLOSE_ADVERT } from "@/store-consts";
import { AdvertModule } from "@/store/modules/AdvertStore";

@Component
export default class AdvertForceCloseBlock extends Vue {
    @Prop({ type: [Number, String], required: true })
    advertId!: string | number

    isForceCloseLoading: boolean = false

    async forceClose() {
        this.isForceCloseLoading = true

        await AdvertModule[ACTION_FORCE_CLOSE_ADVERT](this.advertId)

        this.isForceCloseLoading = false
    }
}
</script>

<style lang="sass">

</style>
