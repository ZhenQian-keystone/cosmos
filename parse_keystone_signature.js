const { KeystoneSDK, utils, UR } = require('@keystonehq/keystone-sdk')
const assert = require('assert')
async function main() {
	try {
		const keystoneSDK = new KeystoneSDK()

		/// you will get type and cborhex content like this  when you sign a cosmos transaction on the cold wallet
		const type = 'cosmos-signature'
		const cborHex =
			'a301d825507afd5e09926743fba02e08c4a09417ec02584078325c2ea8d1841dbcd962e894ca6ecd5890aa4c1aa9e1eb789cd2d0e9c22ec737c2b4fb9c2defd863cadf914f538330ec42d6c30c04857ee1f06e7f2589d7d903582103f3ded94f2969d76200c6ed5db836041cc815fa62aa791e047905186c07e00275'

		// you need parse thes signature(rs) from the cborhex
		let keystone_signature = keystoneSDK.cosmos.parseSignature(
			new UR(utils.toBuffer(cborHex), type)
		)

		const expectResult = {
			signature:
				'78325c2ea8d1841dbcd962e894ca6ecd5890aa4c1aa9e1eb789cd2d0e9c22ec737c2b4fb9c2defd863cadf914f538330ec42d6c30c04857ee1f06e7f2589d7d9',
			requestId: '7afd5e09-9267-43fb-a02e-08c4a09417ec',
			publicKey:
				'03f3ded94f2969d76200c6ed5db836041cc815fa62aa791e047905186c07e00275',
		}
		assert.deepStrictEqual(keystone_signature, expectResult)

		console.log('done')
	} catch (e) {
		console.log(e)
	}
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
