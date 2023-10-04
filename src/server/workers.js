import updateLogic_1 from './updateJobs/Logic_1.js'
import updateLogic_2 from './updateJobs/Logic_2.js'
import sensiboPost from './Integrations/sensibo.js'
import shellyPost from './Integrations/shelly.js'
import updatePrices from '@wasp/actions/updatePrices.js'

export const dailyWorker = async (args, context) => {
  try {
    await updatePrices ()
  } catch (err) {
    console.log("Sattui virhe: " + err.message)
  }
}

export const hourlyWorker = async (args, context) => {
  // try {
  //   await updateLogic_1 ({relay: context.entities.Relay})
  // } catch (err) {
  //   console.log("Sattui virhe: " + err.message)
  // }
  // try {
  //   await updateLogic_2 ({relay: context.entities.Relay})
  // } catch (err) {
  //   console.log("Sattui virhe: " + err.message)
  // }
  // try {
  //   await sensiboPost ({relay: context.entities.Relay, log: context.entities.Log})
  // } catch (err) {
  //   console.log("Sattui virhe: " + err.message)
  // }
  try {
    await shellyPost ({relay: context.entities.Relay, log: context.entities.Log})
  } catch (err) {
    console.log("Sattui virhe: " + err.message)
  }
}

