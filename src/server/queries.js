import HttpError from '@wasp/core/HttpError.js'
import { DateTime } from 'luxon'

export const getRelays = async (args, context) => {
  if (!context.user) {
    throw new HttpError(403)
  }
  return context.entities.Relay.findMany({
    where: {
      user: { id: context.user.id },
    },
  })
}

export const getLogs = async (args, context) => {
  if (!context.user) {
    throw new HttpError(403)
  }
  return context.entities.Log.findMany({
    where: {
      user: { id: context.user.id },
    },
  })
}

export const getLatestOutcomesPerRelay = async (args, context) => {
  try {
    const relays = await context.entities.Relay.findMany({
      include: {
        Logs: {
          orderBy: {
            timeStamp: 'desc',
          },
          take: 1, // Take only the latest log entry per relay
        },
      },
    })

    // Extract the latest outcomes from the logs
    const latestOutcomes = relays.map((relay) => {
      if (relay.Logs.lenght > 0) {
        const latestLog = relay.Logs[0] 
        return {
          relayId: relay.id,
          outcome: latestLog.outcome ? latestLog.outcome : false,
          timeStamp: latestLog.timeStamp ? latestLog.timeStamp : "NA",
        };
    } else {
        return {
          relayId: relay.id,
          outcome: false,
          timeStamp: "NA",
        }
    }
      
    });

    return latestOutcomes;
  } catch (error) {
    throw new Error(`Error fetching latest outcomes: ${error.message}`);
  }
}

export const getTodaysPrices = async (args, context) => {
  try {
    const today = DateTime.now().setZone('EET')
    const startOfDayEET = today.startOf('day')
    const endOfDayEET = today.endOf('day')

    const pricesToday = await context.entities.PriceData.findMany({
      where: {
        timeStamp: {
          gte: startOfDayEET.toUTC().toJSDate(),
          lte: endOfDayEET.toUTC().toJSDate(),
        },
      },
    })
    return pricesToday.sort((a, b) => a.timeStamp - b.timeStamp)
  } catch (error) {
    throw error
  } 
}

