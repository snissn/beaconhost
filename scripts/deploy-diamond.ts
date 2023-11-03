/* global ethers */
/* eslint prefer-const: "off" */

import hre, { ethers } from "hardhat";
import {deployContractWithDeployer, getTransactionFees} from './util';

const { getSelectors, FacetCutAction } = require('./diamond.js')

export async function addFacet(libs: { [key in string]: string }) {

}
export async function deploy(libs: { [key in string]: string }) {
    const [deployer] = await ethers.getSigners();

    const txArgs = await getTransactionFees();

    const facets = [
      { name: "DiamondLoupeFacet"},
      { name: "DiamondCutFacet"},
    ];

    for (const facet of facets) {
        const facetInstance = await deployContractWithDeployer(
            deployer,
            facet.name,
            {},
            txArgs
        );
        await facetInstance.deployed();

        facetCuts.push({
            facetAddress: facetInstance.address,
            action: FacetCutAction.Add,
            functionSelectors: getSelectors(facetInstance)
        });
    }

    const diamondConstructorParams = { }

    const diamondLibs: Libraries = { }

    // deploy Diamond
    const { address: diamondAddress } = await deployContractWithDeployer(
        deployer,
        "GatewayDiamond",
        diamondLibs,
        facetCuts, diamondConstructorParams,
        txArgs
    );

    // returning the address of the diamond
    return {
        "ChainID": chainId,
        "Gateway": diamondAddress
    }
}
