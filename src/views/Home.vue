<template>
<div class='home'>
<!--    <img alt='Vue logo' src='@/assets/logo.svg'>-->
<!--  <HelloWorld msg="Welcome to Your Vue.js App"/>-->
</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
// import HelloWorld from "@/components/HelloWorld.vue";
import Moralis from 'moralis/dist/moralis.min.js';

@Component({
    // components: { HelloWorld }
})
export default class Home extends Vue {
    async login() {
        // let user = Moralis.User.current();
        // if (!user) {

        // }
        // console.log(user.currentProvider.chainId)
        // console.log("logged in user:", user);
    }

    // async logOut() {
    //     // await Moralis.User.logOut();
    //     console.log(Moralis.isWeb3Enabled(), "test");
    //     await Moralis.deactivateWeb3()
    //     console.log(Moralis.isWeb3Enabled(), "logged out");
    // }

    async testCall() {
        const ABI =  [
            {
                "inputs": [
                    {
                        "internalType": `uint256`,
                        "name": `_id`,
                        "type": `uint256`
                    }
                ],
                "name": `adverts`,
                "outputs": [
                    {
                        "internalType": `uint256`,
                        "name": `createdAt`,
                        "type": `uint256`
                    },
                    {
                        "internalType": `enum IDebuy.Status`,
                        "name": `status`,
                        "type": `uint8`
                    },
                    {
                        "internalType": `uint256`,
                        "name": `price`,
                        "type": `uint256`
                    },
                    {
                        "internalType": `string`,
                        "name": `title`,
                        "type": `string`
                    },
                    {
                        "internalType": `string`,
                        "name": `description`,
                        "type": `string`
                    },
                    {
                        "internalType": `string`,
                        "name": `region`,
                        "type": `string`
                    },
                    {
                        "internalType": `string`,
                        "name": `ipfs`,
                        "type": `string`
                    },
                    {
                        "internalType": `address`,
                        "name": `seller`,
                        "type": `address`
                    },
                    {
                        "internalType": `address`,
                        "name": `buyer`,
                        "type": `address`
                    },
                    {
                        "internalType": `uint256`,
                        "name": `sellerRatio`,
                        "type": `uint256`
                    },
                    {
                        "internalType": `uint256`,
                        "name": `buyerRatio`,
                        "type": `uint256`
                    }
                ],
                "stateMutability": `view`,
                "type": `function`
            },
            {
                "inputs": [
                    {
                        "internalType": `uint256`,
                        "name": `_id`,
                        "type": `uint256`
                    }
                ],
                "name": `applyToAdvert`,
                "outputs": [],
                "stateMutability": `payable`,
                "type": `function`
            },
            {
                "inputs": [
                    {
                        "internalType": `uint256`,
                        "name": `_id`,
                        "type": `uint256`
                    }
                ],
                "name": `confirmClose`,
                "outputs": [],
                "stateMutability": `nonpayable`,
                "type": `function`
            },
            {
                "inputs": [
                    {
                        "internalType": `uint256`,
                        "name": `_price`,
                        "type": `uint256`
                    },
                    {
                        "internalType": `string`,
                        "name": `_title`,
                        "type": `string`
                    },
                    {
                        "internalType": `string`,
                        "name": `_description`,
                        "type": `string`
                    },
                    {
                        "internalType": `string`,
                        "name": `_region`,
                        "type": `string`
                    },
                    {
                        "internalType": `string`,
                        "name": `_ipfs`,
                        "type": `string`
                    },
                    {
                        "internalType": `address`,
                        "name": `_buyer`,
                        "type": `address`
                    }
                ],
                "name": `createAdvert`,
                "outputs": [
                    {
                        "internalType": `uint256`,
                        "name": `index`,
                        "type": `uint256`
                    }
                ],
                "stateMutability": `payable`,
                "type": `function`
            },
            {
                "inputs": [
                    {
                        "internalType": `uint256`,
                        "name": `_id`,
                        "type": `uint256`
                    },
                    {
                        "internalType": `uint256`,
                        "name": `_newRatio`,
                        "type": `uint256`
                    }
                ],
                "name": `decreaseSellerRatio`,
                "outputs": [],
                "stateMutability": `nonpayable`,
                "type": `function`
            },
            {
                "inputs": [
                    {
                        "internalType": `uint256`,
                        "name": `_id`,
                        "type": `uint256`
                    }
                ],
                "name": `forceClose`,
                "outputs": [],
                "stateMutability": `nonpayable`,
                "type": `function`
            },
            {
                "inputs": [],
                "name": `indexCounter`,
                "outputs": [
                    {
                        "internalType": `uint256`,
                        "name": ``,
                        "type": `uint256`
                    }
                ],
                "stateMutability": `view`,
                "type": `function`
            },
            {
                "inputs": [
                    {
                        "internalType": `address`,
                        "name": ``,
                        "type": `address`
                    }
                ],
                "name": `lastActivity`,
                "outputs": [
                    {
                        "internalType": `uint256`,
                        "name": ``,
                        "type": `uint256`
                    }
                ],
                "stateMutability": `view`,
                "type": `function`
            },
            {
                "inputs": [],
                "name": `updateActivity`,
                "outputs": [],
                "stateMutability": `nonpayable`,
                "type": `function`
            },
            {
                "inputs": [
                    {
                        "internalType": `uint256`,
                        "name": `_id`,
                        "type": `uint256`
                    },
                    {
                        "internalType": `address`,
                        "name": `_newBuyer`,
                        "type": `address`
                    }
                ],
                "name": `updateBuyer`,
                "outputs": [],
                "stateMutability": `nonpayable`,
                "type": `function`
            },
            {
                "inputs": [
                    {
                        "internalType": `uint256`,
                        "name": `_id`,
                        "type": `uint256`
                    },
                    {
                        "internalType": `string`,
                        "name": `_newDescription`,
                        "type": `string`
                    }
                ],
                "name": `updateDescription`,
                "outputs": [],
                "stateMutability": `nonpayable`,
                "type": `function`
            },
            {
                "inputs": [
                    {
                        "internalType": `uint256`,
                        "name": `_id`,
                        "type": `uint256`
                    },
                    {
                        "internalType": `string`,
                        "name": `_newIpfs`,
                        "type": `string`
                    }
                ],
                "name": `updateIpfs`,
                "outputs": [],
                "stateMutability": `nonpayable`,
                "type": `function`
            },
            {
                "inputs": [
                    {
                        "internalType": `uint256`,
                        "name": `_id`,
                        "type": `uint256`
                    },
                    {
                        "internalType": `uint256`,
                        "name": `_newPrice`,
                        "type": `uint256`
                    }
                ],
                "name": `updatePrice`,
                "outputs": [],
                "stateMutability": `nonpayable`,
                "type": `function`
            },
            {
                "inputs": [
                    {
                        "internalType": `uint256`,
                        "name": `_id`,
                        "type": `uint256`
                    },
                    {
                        "internalType": `string`,
                        "name": `_newRegion`,
                        "type": `string`
                    }
                ],
                "name": `updateRegion`,
                "outputs": [],
                "stateMutability": `nonpayable`,
                "type": `function`
            },
            {
                "inputs": [
                    {
                        "internalType": `uint256`,
                        "name": `_id`,
                        "type": `uint256`
                    },
                    {
                        "internalType": `string`,
                        "name": `_newTitle`,
                        "type": `string`
                    }
                ],
                "name": `updateTitle`,
                "outputs": [],
                "stateMutability": `nonpayable`,
                "type": `function`
            },
            {
                "inputs": [
                    {
                        "internalType": `uint256`,
                        "name": `_id`,
                        "type": `uint256`
                    }
                ],
                "name": `withdraw`,
                "outputs": [],
                "stateMutability": `nonpayable`,
                "type": `function`
            }
        ]
        const readOptions = {
            contractAddress: `0xf75097ddF95E8FEAa31Bc2FfA83641db954D8D52`,
            functionName: `adverts`,
            abi: ABI,
            params: {
                _id: 0,
            }
        };
        const test = await Moralis.executeFunction(readOptions)
        console.log(`test call`, test);
    }

    async mounted(): Promise<void> {

        // await this.login()
        // this.testCall()
        // await this.logOut()
    }
}
</script>

<style lang="sass">

</style>
