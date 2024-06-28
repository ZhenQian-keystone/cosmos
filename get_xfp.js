const ecc = require('tiny-secp256k1')
const { BIP32Factory } = require('bip32')
const bip39 = require('bip39')
const { hash160 } = require('bitcoinjs-lib/src/crypto')
const bech32 = require('bech32-buffer')

// set path environment variable
const mnemonic = process.env.MNEMONIC
// console.log(mnemonic)
const seed = bip39.mnemonicToSeedSync(mnemonic)
const bip32 = BIP32Factory(ecc)
const root = bip32.fromSeed(seed)
const masterFingerprint = root.fingerprint.toString('hex')
console.log('Master Fingerprint:', masterFingerprint)
const child = root.derivePath("m/44'/118'/0'/0/0")

let publicKey = child.publicKey
console.log('Public Key:', publicKey.toString('hex'))
let hash160_buffer = hash160(publicKey)
console.log('Hash160:', hash160_buffer.toString('hex'))
let address = bech32.encode('cosmos', hash160_buffer)
console.log('Address:', address.toString('hex'))
