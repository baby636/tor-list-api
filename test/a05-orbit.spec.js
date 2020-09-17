const config = require('../config')
const assert = require('chai').assert

const axios = require('axios').default

const LOCALHOST = `http://localhost:${config.port}`

describe('Orbit', () => {
  describe('POST /orbitdb/write', () => {
    it('should throw 422 if data is incomplete', async () => {
      try {
        const options = {
          method: 'POST',
          url: `${LOCALHOST}/orbitdb/write`,
          data: {
            entry: 1234
          }
        }

        await axios(options)
        assert(false, 'Unexpected result')
      } catch (err) {
        assert(err.response.status === 422, 'Error code 422 expected.')
      }
    })

    it('should throw 422 if slpAddress is missing or is not a string', async () => {
      try {
        const options = {
          method: 'POST',
          url: `${LOCALHOST}/orbitdb/write`,
          data: {
            entry: 'sample.com ',
            slpAddress: '',
            description: 'this short description',
            signature: 'sample.com ',
            category: 'eth'
          }
        }

        await axios(options)
        assert(false, 'Unexpected result')
      } catch (err) {
        assert(err.response.status === 422, 'Error code 422 expected.')
      }
    })

    it('should throw 422 if description is missing or is not a string', async () => {
      try {
        const options = {
          method: 'post',
          url: `${LOCALHOST}/orbitdb/write`,
          data: {
            entry: 'sample.com ',
            slpAddress:
              'simpleledger:qzl6k0wvdd5ky99hewghqdgfj2jhcpqnfqtaqr70rp',
            description: 1234,
            signature: 'sample.com ',
            category: 'eth'
          }
        }

        await axios(options)
        assert(false, 'Unexpected result')
      } catch (err) {
        assert(err.response.status === 422, 'Error code 422 expected.')
      }
    })

    it('should throw 422 if signature is missing or is not a string', async () => {
      try {
        const options = {
          method: 'post',
          url: `${LOCALHOST}/orbitdb/write`,
          data: {
            entry: 'sample.com ',
            slpAddress:
              'simpleledger:qzl6k0wvdd5ky99hewghqdgfj2jhcpqnfqtaqr70rp',
            description: 'this is a sample page',
            signature: true,
            category: 'bch'
          }
        }

        await axios(options)
        assert(false, 'Unexpected result')
      } catch (err) {
        assert(err.response.status === 422, 'Error code 422 expected.')
      }
    })

    it('should throw 422 if a caregoty is missing or is not a string', async () => {
      try {
        const options = {
          method: 'post',
          url: `${LOCALHOST}/orbitdb/write`,
          data: {
            entry: 'sample.com ',
            slpAddress:
              'simpleledger:qzl6k0wvdd5ky99hewghqdgfj2jhcpqnfqtaqr70rp',
            description: 'this is a sample page',
            signature: 'sample.com '
          }
        }

        await axios(options)
        assert(false, 'Unexpected result')
      } catch (err) {
        assert(err.response.status === 422, 'Error code 422 expected.')
      }
    })

    it('should throw 422 if a caregoty is not in the accepted categories', async () => {
      try {
        const options = {
          method: 'post',
          url: `${LOCALHOST}/orbitdb/write`,
          data: {
            entry: 'sample.com ',
            slpAddress:
              'simpleledger:qzl6k0wvdd5ky99hewghqdgfj2jhcpqnfqtaqr70rp',
            description: 'this is a sample page',
            signature: 'sample.com ',
            category: 'sampleMUSTgiveERROR'
          }
        }

        await axios(options)
        assert(false, 'Unexpected result')
      } catch (err) {
        assert(err.response.status === 422, 'Error code 422 expected.')
      }
    })

    it('should add the entry to the database and return the hash', async () => {
      try {
        const options = {
          method: 'post',
          url: `${LOCALHOST}/orbitdb/write`,
          data: {
            entry: 'sample.com ',
            slpAddress:
              'simpleledger:qzl6k0wvdd5ky99hewghqdgfj2jhcpqnfqtaqr70rp',
            description: 'this is a sample page',
            signature: 'sample.com ',
            category: 'bch'
          }
        }

        const result = await axios(options)
        assert(result.status === 200, 'Status Code 200 expected.')
        assert.property(result.data, 'hash', 'hash of entry expected')
      } catch (err) {
        console.log('Error adding entry to the database: ' + err.message)
        throw err
      }
    })
  })

  describe('GET /orbitdb', () => {
    it('should fetch all the data in the OrbitDB', async () => {
      const options = {
        method: 'GET',
        url: `${LOCALHOST}/orbitdb/entries`,
        headers: {
          Accept: 'application/json'
        }
      }
      const result = await axios(options)

      assert.property(result.data, 'entries', 'entry property expected')
      const entries = result.data.entries
      // console.log(`entries: ${JSON.stringify(entries, null, 2)}`)

      assert.property(entries[0], 'entry')
      assert.property(entries[0], 'category')
      assert.property(entries[0], 'signature')
      assert.property(entries[0], 'slpAddress')
      assert.property(entries[0], 'description')

      assert.isNumber(entries.length)
    })
  })
})
