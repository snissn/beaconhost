import { HardhatUserConfig, task } from 'hardhat/config'
import '@typechain/hardhat'
import 'hardhat-storage-layout-changes'

import '@nomicfoundation/hardhat-foundry'
import '@nomiclabs/hardhat-ethers'
import 'hardhat-deploy'
import 'hardhat-contract-sizer'

//import fs from 'fs'

import { HardhatRuntimeEnvironment } from 'hardhat/types'

const { fs } = require('fs')

const lazyImport = async (module: any) => {
    return await import(module)
}

task(
    'deploy-diamond',
    'Builds and deploys the Gateway contract on the selected network',
    async (args, hre: HardhatRuntimeEnvironment) => {
        const network = hre.network.name

        const { deploy } = await lazyImport('./scripts/deploy-diamond')
        const diamondDeployment = await deploy({})

        console.log(JSON.stringify(diamondDeployment, null, 2))

    },
)

task(
    'deploy',
    'Builds and deploys all contracts on the selected network',
    async (args, hre: HardhatRuntimeEnvironment) => {
        await hre.run('compile')
        await hre.run('deploy-diamond')
    },
)

/** @type import('hardhat/config').HardhatUserConfig */
const config: HardhatUserConfig = {
    defaultNetwork: 'auto',
    networks: {
        auto: {
            url: process.env.RPC_URL!,
            accounts: [process.env.PRIVATE_KEY!],
            // timeout to support also slow networks (like calibration/mainnet)
            timeout: 1000000,
        },
    },
    solidity: {
        compilers: [
            {
              //todo make highest
                version: '0.8.17',
                settings: {
                    viaIR: true,
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    typechain: {
        outDir: 'typechain',
        target: 'ethers-v5',
    },
}

export default config
