<template>
<v-app>
    <Header></Header>

    <v-main>
        <router-view></router-view>
    </v-main>

    <v-bottom-sheet
        v-model='sheet'
        persistent>
        <template v-slot:activator='{ on, attrs }'>
            <v-btn
                class='mx-5 my-5'
                color='primary'
                elevation='10'
                x-large
                fab
                dark
                fixed
                right
                bottom
                v-bind='attrs'
                @click='openSheet'>
                <v-icon>
                    mdi-plus
                </v-icon>
            </v-btn>
        </template>
        <v-sheet
            class='text-center'
            height='700px'>
            <PostAdForm
                v-if='sheet'
                @close='closeSheet'></PostAdForm>
        </v-sheet>
    </v-bottom-sheet>
</v-app>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import Moralis from "moralis/dist/moralis.min.js";
import Header from "@/components/base/Header.vue";
import PostAdForm from "@/components/PostAdForm.vue";
import { ACTION_LOGIN,  ACTION_SET_MAIN_SUBSCRIBERS } from "@/store-consts";
import { Advert } from "../types/Advert";
import { AdvertModule } from "@/store/modules/AdvertStore";
import { AuthModule } from "@/store/modules/AuthStore";

@Component({
    components: { Header, PostAdForm }
})
export default class App extends Vue {
    sheet: boolean = false

    get advertToEdit(): Advert | null {
        return AdvertModule.advertToEdit
    }

    @Watch(`advertToEdit`)
    onAdvertEditChange(value: Advert | null) {
        if (value) {
            this.sheet = true
        }
    }

    async openSheet() {
        try {
            const user = Moralis.User.current();
            if (!user) {
                const state = await AuthModule[ACTION_LOGIN]()
                if (state) {
                    this.sheet = true
                }
            } else {
                this.sheet = true
            }
        } catch (e) {
            console.log(e)
        }
    }

    closeSheet() {
        this.sheet = false
    }

    async created() {
        await AuthModule[ACTION_SET_MAIN_SUBSCRIBERS]()
    }
}
</script>

<style lang="scss">

</style>
