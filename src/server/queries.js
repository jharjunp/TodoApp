import HttpError from '@wasp/core/HttpError.js'

export const getRelays = async (args, context) => {
  return context.entities.Relay.findMany({
    where: { logic: args.logic },
  })
}

export const getTodaysPrices = async (args, context) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const endOfDay = new Date(today)
    endOfDay.setHours(23, 59, 59, 999)

    const pricesToday = await context.entities.PriceData.findMany({
      where: {
        timeStamp: {
          gte: today,
          lte: endOfDay,
        },
      },
    })

    return pricesToday.sort((a, b) => a.timeStamp - b.timeStamp)
  } catch (error) {
    throw error
  } 
}

