var QRCode = require('qrcode')
const { UR, UREncoder } = require('@ngraveio/bc-ur')
const EventEmitter = require('events')

const MAX_FRAGMENT_LENGTH = 400
const DEFAULT_INTERVAL = 100

class AnimatedQRCode extends EventEmitter {
	constructor({
		cbor,
		type,
		capacity = MAX_FRAGMENT_LENGTH,
		interval = DEFAULT_INTERVAL,
	}) {
		super()
		this.urEncoder = new UREncoder(
			new UR(Buffer.from(cbor, 'hex'), type),
			capacity
		)
		this.interval = interval
		this.timer = null
	}

	start() {
		this.emit('update', this.urEncoder.nextPart().toUpperCase())
		this.timer = setInterval(() => {
			this.emit('update', this.urEncoder.nextPart().toUpperCase())
		}, this.interval)
	}

	stop() {
		if (this.timer) {
			clearInterval(this.timer)
			this.timer = null
		}
	}
}

module.exports = AnimatedQRCode

function example() {
	// generate animated qr code example
	try {
		let type = 'cosmos-sign-request'
		let cbor =
			'a601d825507afd5e09926743fba02e08c4a09417ec0259016b7b226163636f756e745f6e756d626572223a22323930353536222c22636861696e5f6964223a226f736d6f2d746573742d34222c22666565223a7b22616d6f756e74223a5b7b22616d6f756e74223a2231303032222c2264656e6f6d223a22756f736d6f227d5d2c22676173223a22313030313936227d2c226d656d6f223a22222c226d736773223a5b7b2274797065223a22636f736d6f732d73646b2f4d736753656e64222c2276616c7565223a7b22616d6f756e74223a5b7b22616d6f756e74223a223132303030303030222c2264656e6f6d223a22756f736d6f227d5d2c2266726f6d5f61646472657373223a226f736d6f31667334396a7867797a30306c78363436336534767a767838353667756c64756c6a7a6174366d222c22746f5f61646472657373223a226f736d6f31667334396a7867797a30306c78363436336534767a767838353667756c64756c6a7a6174366d227d7d5d2c2273657175656e6365223a2230227d03010481d90130a2018a182cf51876f500f500f400f4021af23f9fd2058178283463326135393139303431336466663336616261386536616331333063376136393163666237396606654b65706c72'

		const animatedQRCode = new AnimatedQRCode({
			cbor: cbor,
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
				function (err, url) {
					console.log(url)
				}
			)
			console.log(currentQRCode)
		})

		animatedQRCode.start()

		// when you want to stop the animation qrcode
		// animatedQRCode.stop();
	} catch (e) {
		console.log(e)
	}
}
// main()
