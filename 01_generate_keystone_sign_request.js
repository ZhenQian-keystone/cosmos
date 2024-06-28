const { KeystoneSDK, KeystoneCosmosSDK } = require('@keystonehq/keystone-sdk')
const AnimatedQRCode = require('./02_generate_animate_qr_in_terminal')
var QRCode = require('qrcode')
const assert = require('assert')

function main() {
	try {
		const keystoneSDK = new KeystoneSDK({})

		let cosmosSignRequest = {
			requestId: '7AFD5E09-9267-43FB-A02E-08C4A09417EC',
			signData:
				'7B226163636F756E745F6E756D626572223A22323930353536222C22636861696E5F6964223A226F736D6F2D746573742D34222C22666565223A7B22616D6F756E74223A5B7B22616D6F756E74223A2231303032222C2264656E6F6D223A22756F736D6F227D5D2C22676173223A22313030313936227D2C226D656D6F223A22222C226D736773223A5B7B2274797065223A22636F736D6F732D73646B2F4D736753656E64222C2276616C7565223A7B22616D6F756E74223A5B7B22616D6F756E74223A223132303030303030222C2264656E6F6D223A22756F736D6F227D5D2C2266726F6D5F61646472657373223A226F736D6F31667334396A7867797A30306C78363436336534767A767838353667756C64756C6A7A6174366D222C22746F5F61646472657373223A226F736D6F31667334396A7867797A30306C78363436336534767A767838353667756C64756C6A7A6174366D227D7D5D2C2273657175656E6365223A2230227D',
			dataType: KeystoneCosmosSDK.DataType.amino,
			accounts: [
				{
					path: "m/44'/118'/0'/0/0",
					xfp: '52744703',
					address: 'cosmos17u02f80vkafne9la4wypdx3kxxxxwm6f2qtcj2', // here can put public key or address, it doesn't matter
				},
			],
		}

		// generate cosmos sign request
		let sign_request_ur =
			keystoneSDK.cosmos.generateSignRequest(cosmosSignRequest)

		// generate animated qr code in the terminal
		let type = 'cosmos-sign-request'
		const animatedQRCode = new AnimatedQRCode({
			cbor: sign_request_ur.cbor.toString('hex'),
			type: type,
			capacity: 200,
			interval: 300,
		})
		animatedQRCode.on('update', (currentQRCode) => {
			// need clear terminal before render new qr code
			console.clear()
			QRCode.toString(
				currentQRCode,
				{ type: 'terminal', small: true },
				function (err, qrcode_content) {
					console.log(qrcode_content)
				}
			)
			console.log(currentQRCode)
		})

		animatedQRCode.start()
	} catch (e) {
		console.log(e)
	}
}

main()
