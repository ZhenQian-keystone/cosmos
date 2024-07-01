const { encodeSecp256k1Pubkey, makeSignDoc, StdFee } = require('@cosmjs/amino')
const { SignMode } = require('cosmjs-types/cosmos/tx/signing/v1beta1/signing')
const {
	defaultRegistryTypes: defaultStargateTypes,
	SigningStargateClient,
	createDefaultAminoConverters,
} = require('@cosmjs/stargate')

const {
	createAuthzAminoConverters,
	createBankAminoConverters,
	createDistributionAminoConverters,
	createFeegrantAminoConverters,
	createGovAminoConverters,
	createIbcAminoConverters,
	createStakingAminoConverters,
	createVestingAminoConverters,
} = require('@cosmjs/stargate/build/modules')

const { AminoConverters, AminoTypes } = require('@cosmjs/stargate/build')

function createDefaultTypes() {
	return {
		...createAuthzAminoConverters(),
		...createBankAminoConverters(),
		...createDistributionAminoConverters(),
		...createGovAminoConverters(),
		...createStakingAminoConverters(),
		...createIbcAminoConverters(),
		...createFeegrantAminoConverters(),
		...createVestingAminoConverters(),
	}
}

// const AminoTypes = require('@cosmjs/amino')
const signMode = SignMode.SIGN_MODE_LEGACY_AMINO_JSON
let aminoTypes = new AminoTypes(createDefaultTypes())
const msgs = messages.map((msg) => aminoTypes.toAmino(msg))
const signDoc = makeSignDoc(msgs, fee, chainId, memo, accountNumber, sequence)
