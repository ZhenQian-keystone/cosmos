const { DirectSecp256k1HdWallet, Registry } = require('@cosmjs/proto-signing')
const {
	defaultRegistryTypes: defaultStargateTypes,
	SigningStargateClient,
} = require('@cosmjs/stargate')
const { stringToPath } = require('@cosmjs/crypto')
const bech32 = require('bech32-buffer')

const { MsgDeposit } = require('./types/MsgCompiled').types

const { encodeSecp256k1Pubkey, makeSignDoc, StdFee } = require('@cosmjs/amino')
const { SignMode } = require('cosmjs-types/cosmos/tx/signing/v1beta1/signing')

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

async function main() {
	const myRegistry = new Registry(defaultStargateTypes)
	myRegistry.register('/types.MsgDeposit', MsgDeposit)

	// set mnemonic environment variable
	const signerMnemonic = process.env.MNEMONIC
	console.log(signerMnemonic)

	const signerAddr = 'thor1d3ryd2wkdpn4carpyrrnf3ha7f0n70503f605f'

	const signer = await DirectSecp256k1HdWallet.fromMnemonic(signerMnemonic, {
		prefix: 'thor', // THORChain prefix
		hdPaths: [stringToPath("m/44'/931'/0'/0/0")], // THORChain HD Path
	})

	const client = await SigningStargateClient.connectWithSigner(
		'https://rpc.ninerealms.com/',
		signer,
		{ registry: myRegistry }
	)

	const memo = `=:BNB/BNB:${signerAddr}` // THORChain memo

	const msg = {
		coins: [
			{
				asset: {
					chain: 'THOR',
					symbol: 'RUNE',
					ticker: 'RUNE',
				},
				amount: '100000000', // Value in 1e8 (100000000 = 1 RUNE)
			},
		],
		memo: memo,
		signer: bech32.decode(signerAddr).data,
	}

	const depositMsg = {
		typeUrl: '/types.MsgDeposit',
		value: MsgDeposit.fromObject(msg),
	}

	const fee = {
		amount: [],
		gas: '50000000', // Set arbitrarily high gas limit; this is not actually deducted from user account.
	}

	console.log('depositMsg: ', depositMsg)

	// create sign data
	function createDepositAminoConverters() {
		// todo define own  AminoConverters for /types.MsgDeposit
	}
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
			...createDepositAminoConverters(),
		}
	}

	console.log('my registory', createDefaultTypes())

	// const AminoTypes = require('@cosmjs/amino')
	console.log('get signdata ......')
	let messages = [depositMsg]
	let aminoTypes = new AminoTypes(createDefaultTypes())
	const msgs = messages.map((msg) => aminoTypes.toAmino(msg))
	const signDoc = makeSignDoc(
		msgs,
		fee,
		chainId,
		memo,
		accountNumber,
		sequence
	)

	const response = await client.sign(signerAddr, [depositMsg], fee, memo)
	console.log(
		'response_body_hex_string: ',
		Buffer.from(response.bodyBytes).toString('hex')
	)

	console.log(
		'response_auth_info_hex_string: ',
		Buffer.from(response.authInfoBytes).toString('hex')
	)

	console.log(
		'response_signatures_hex_string: ',
		Buffer.from(response.signatures[0]).toString('hex')
	)

	// const response = await client.signAndBroadcast(
	// 	signerAddr,
	// 	[depositMsg],
	// 	fee,
	// 	memo
	// )

	if (response.code !== 0) {
		console.log('Error: ', response.rawLog)
	} else {
		console.log('Success!')
	}
}

main()
