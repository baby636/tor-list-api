/*
  This library contains methods for working with the BCHN and BCHA blockchains.
*/

// Public npm libraries
const BCHJS = require('@psf/bch-js')

class Bch {
  constructor () {
    // Encapsulate dependencies
    this.bchjs = new BCHJS()
    this.PSF_TOKEN_ID = '38e97c5d7d3585a2cbf3f9580c82ca33985f9cb0845d4dcce220cb709f9538b0'
  }

  // Verify that the entry was signed by a specific BCH address.
  _verifySignature (verifyObj) {
    try {
      // Expand the input object.
      const { slpAddress, signature, entry } = verifyObj

      // Convert to BCH address.
      const scrubbedAddr = this.bchjs.SLP.Address.toCashAddress(slpAddress)

      const isValid = this.bchjs.BitcoinCash.verifyMessage(
        scrubbedAddr,
        signature,
        entry
      )

      return isValid
    } catch (err) {
      console.error('Error in bch.js/_verifySignature()')
      throw err
    }
  }

  // Gets the total psf token balance
  async getPSFTokenBalance (slpAddress) {
    try {
      if (!slpAddress || typeof slpAddress !== 'string') {
        throw new Error('slpAddress must be a string')
      }
      let psfBalance = 0
      const balances = await this.bchjs.SLP.Utils.balancesForAddress(slpAddress)

      // Sums all the balances of all tokens
      // that match the psf token ID
      for (let i = 0; i < balances.length; i++) {
        if (balances[i].tokenId === this.PSF_TOKEN_ID) {
          psfBalance += balances[i].balance
        }
      }

      return psfBalance
    } catch (err) {
      console.error('Error in bch.js/getPSFTokenBalance()')
      throw err
    }
  }
}

module.exports = Bch
