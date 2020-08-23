const config = require('../config')
const assert = require('chai').assert

const axios = require('axios').default

const LOCALHOST = `http://localhost:${config.port}`

describe('Orbit', () => {
  describe('POST /orbitdb/write', () => {
    it('should throw 422 if entry is undifined', async () => {
      try {
        const options = {
          method: 'POST',
          url: `${LOCALHOST}/orbitdb/write`
        }

        await axios(options)
        assert(false, 'Unexpected result')
      } catch (err) {
        assert(err.response.status === 422, 'Error code 422 expected.')
      }
    })

    it('should throw 422 if entry is not a string', async () => {
      try {
        const options = {
          method: 'post',
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

    it('should add the entry to the database and return the hash', async () => {
      try {
        const options = {
          method: 'post',
          url: `${LOCALHOST}/orbitdb/write`,
          data: {
            entry: 'test entry'
          }
        }

        const result = await axios(options)
        assert(result.status === 200, 'Status Code 200 expected.')
        assert.property(result.data, 'hash', 'hash of entry expected')
      } catch (err) {
        console.log(
          'Error adding entry to the database: ' + JSON.stringify(err, null, 2)
        )
        throw err
      }
    })
  })
})
