import HttpError from '@wasp/core/HttpError.js'
import { Console } from 'console'
import { DateTime } from 'luxon'

export const getRelays = async (args, context) => {
  return context.entities.Relay.findMany({
    where: { logic: args.logic },
  })
}

export const getTodaysPrices = async (args, context) => {
  try {
    const today = DateTime.now().setZone('EET')
    const startOfDayEET = today.startOf('day')
    const endOfDayEET = today.endOf('day')
    //console.log("today: " + startOfDayEET + "endOfToday: " + endOfDayEET)

    const pricesToday = await context.entities.PriceData.findMany({
      where: {
        timeStamp: {
          gte: startOfDayEET.toUTC().toJSDate(),
          lte: endOfDayEET.toUTC().toJSDate(),
        },
      },
    })
    //console.log(pricesToday.sort((a, b) => a.timeStamp - b.timeStamp))
    return pricesToday.sort((a, b) => a.timeStamp - b.timeStamp)
  } catch (error) {
    throw error
  } 
}

