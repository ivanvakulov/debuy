<template>
<div class='b-custom-image-picker'>
    <v-skeleton-loader
        v-if='isImageLoading && !imageUrl'
        maxwidth='100%'
        height='100%'
        type='image'></v-skeleton-loader>
    <template v-else-if='!imageUrl'>
        Drag & Drop your image here
    </template>
    <v-img
        v-else
        alt='Ad photo'
        class='shrink mt-1 hidden-sm-and-down'
        contain
        max-width='100%'
        max-height='100%'
        :src='imageUrl'></v-img>
    <input type='file'
           accept='image/*'
           @change='onFileUpload'>
</div>
</template>

<script lang="ts">
import { Vue, Component, Emit, Prop } from 'vue-property-decorator';
import { AdvertModule } from "@/store/modules/AdvertStore";
import { ACTION_UPLOAD_IMAGE } from "@/store-consts";
import { getIpfsUrl } from "@/helpers/contract";

@Component
export default class CustomImagePicker extends Vue {
    @Prop({ type: String, default: `` })
    predefinedHash!: string

    isImageLoading: boolean = false
    imageUrl: string | null = null

    async onFileUpload(e: Event): Promise<void> {
        // @ts-ignore
        if (e && e.target && (e.target as HTMLInputElement).files && (e.target as HTMLInputElement).files[0]) {
            this.isImageLoading = true

            // @ts-ignore
            const hash = await AdvertModule[ACTION_UPLOAD_IMAGE]((e.target as HTMLInputElement).files[0])

            if (hash) {
                this.imageUrl = getIpfsUrl(hash)
            }

            this.emitHash(hash)
            this.isImageLoading = false
        }
    }

    @Emit(`hash`)
    emitHash(hash: string | null) {
        return hash
    }

    created() {
        if (this.predefinedHash) {
            this.imageUrl = getIpfsUrl(this.predefinedHash)
        }
    }
}
</script>

<style lang="sass">
.b-custom-image-picker
    position: relative
    display: flex
    align-items: center
    justify-content: center
    border: 4px dashed #1976d2
    border-radius: 16px
    height: 100%
    max-height: 480px
    color: #1976d2
    font-weight: 700
    font-size: 24px
    cursor: pointer
    padding: 8px

    .v-skeleton-loader__bone
        height: 100%

    input
        position: absolute
        opacity: 0
        width: 100%
        height: 100%
        top: 0
        left: 0
        cursor: pointer

</style>
