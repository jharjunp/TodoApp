import axios from 'axios'
//import HttpError from '@wasp/core/HttpError.js'
import updateRelaysLogic_1 from '@wasp/actions/updateRelaysLogic_1.js'
import updateRelaysLogic_2 from '@wasp/actions/updateRelaysLogic_2.js'
import updatePrices from '@wasp/actions/updatePrices.js'

export const dailyWorker = async (args, context) => {
  try {
    await updatePrices ()
  } catch (err) {
    console.log("Sattui virhe: " + err.message)
  }
}

export const hourlyWorker = async (args, context) => {
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

