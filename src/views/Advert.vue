<template>
<v-container>
    <v-row>
        <v-col
            cols='12'
            md='8'>
            <v-skeleton-loader
                v-if='!advert'
                width='100%'
                height='300px'
                type='image'></v-skeleton-loader>
            <v-carousel
                v-else
                v-model='slideIndex'
                height='300'
                dark
                hide-delimiters>
                <v-carousel-item
                    v-for='img in ipfsPhotos'
                    :src='img'
                    :key='img'>
                </v-carousel-item>
            </v-carousel>

            <v-skeleton-loader
                v-if='!advert'
                width='100%'
                height='300px'
                type='card'></v-skeleton-loader>
            <v-card
                v-else
                class='mt-4 mx-auto'
                outlined>
                <v-list-item three-line>
                    <v-list-item-content>
                        <div class='text-overline mb-4'>
                            Deal
                        </div>
                        <v-list-item-title class='text-h5 mb-1'>
                            {{ advertTitle }}
                        </v-list-item-title>
                        <v-list-item-subtitle>{{ advertDescription }}</v-list-item-subtitle>
                    </v-list-item-content>

                    {{ createdAt }}
                </v-list-item>
            </v-card>
        </v-col>
        <v-col
            cols='12'
            md='4'>
            <v-skeleton-loader
                v-if='!advert'
                width='100%'
                height='300px'
                type='card'></v-skeleton-loader>
            <v-card
                v-else
                class='mx-auto'
                outlined>
                <v-list-item three-line>
                    <v-list-item-content>
                        <div class='text-overline mb-4'>
                            Seller
                        </div>
                        <v-list-item-title class='text-h5 mb-1'>
                            {{ sellerAddress }}
                        </v-list-item-title>
                        <v-list-item-subtitle>{{ region }}</v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-avatar
                        tile
                        size='80'
                        color='grey'></v-list-item-avatar>
                </v-list-item>

                <v-card-actions>
                    <v-btn
                        outlined
                        rounded
                        text>
                        Open Explorer
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
    </v-row>
</v-container>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { AdvertModule } from "@/store/modules/AdvertStore";
import { ACTION_GET_ADVERT } from "@/store-consts";
import { Advert } from "../../types/Advert";
import Moralis from "moralis/dist/moralis.min.js";
import { getIpfsUrl, getShortAddress } from "@/helpers/contract";

@Component
export default class AdvertPage extends Vue {
    advert: Advert | null = null
    slideIndex: number = 0
    unubscribe: any = null

    get ipfsPhotos(): Array<string> {
        return this.advert?.ipfs ? [getIpfsUrl(this.advert?.ipfs)] : []
    }

    get advertTitle(): string {
        return this.advert?.title || ``
    }

    get advertDescription(): string {
        return this.advert?.description || ``
    }

    get createdAt(): string {
        const date = this.advert?.createdAt ? new Date(this.advert.createdAt * 1000).toLocaleDateString() : ``
        return date || ``
    }

    get sellerAddress(): string {
        return this.advert?.seller ? getShortAddress(this.advert.seller) : ``
    }

    get region(): string {
        return this.advert?.region || ``
    }

    created() {
        if (this.$route.params.id) {
            this.unubscribe = Moralis.onWeb3Enabled(async() => {
                this.advert = await AdvertModule[ACTION_GET_ADVERT](this.$route.params.id)
                console.log(this.advert)
            })
        } else {
            this.$router.push({ name: `HomePage` })
        }
    }

    beforeDestroy() {
        this.unubscribe()
    }
}
</script>

<style lang="sass">

</style>
