import axios from 'axios'
//import HttpError from '@wasp/core/HttpError.js'
import createHinnat from '@wasp/actions/createHinnat.js'
import updateRelaysLogic_1 from '@wasp/actions/updateRelaysLogic_1.js'
import updateRelaysLogic_2 from '@wasp/actions/updateRelaysLogic_2.js'

export const getPrices = async (args, context) => {
    console.log('Fetching new prices...')
    axios
      .get('https://api.porssisahko.net/v1/latest-prices.json')
      .then(async response => {
        console.log('Pricefetching promise fulfilled')
//        console.log(response.data)
        try {
            await createHinnat({
                "hinnat": response.data
            })
          } catch (err) {
            console.log("Sattui virhe: " + err.message)
          }
      })
}

export const uRelays = async (args, context) => {
  try {
    await updateRelaysLogic_1 ()
  } catch (err) {
    console.log("Sattui virhe: " + err.message)
  }
  try {
    await updateRelaysLogic_2 ()
  } catch (err) {
    console.log("Sattui virhe: " + err.message)
  }
}

