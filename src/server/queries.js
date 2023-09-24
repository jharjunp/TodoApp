import HttpError from '@wasp/core/HttpError.js'
import { Console } from 'console'

export const getRelays = async (args, context) => {
  return context.entities.Relay.findMany({
    where: { logic: args.logic },
  })
}

export const getTodaysPrices = async (args, context) => {
  function getEETDate() {
    const options = { timeZone: 'Europe/Bucharest', hour12: false };
    const eetDateStr = new Intl.DateTimeFormat('en-US', options).format(new Date());
    //const eetDate = new Date(eetDateStr);
    //const eetDateStr = new Date().toLocaleString("en-US", {timeZone: "Europe/Helsinki"})
    console.log("eetDateStr: " + eetDateStr)
    const eetDate = new Date(eetDateStr);
    console.log("EETDate: " + eetDate)
  
    return eetDate;
  }
  
  try {
    const today = new getEETDate()
    today.setHours(0, 0, 0, 0)
    const endOfDay = new getEETDate(today)
    endOfDay.setHours(23, 59, 59, 999)
    console.log("today: " + today + "endOfToday: " + endOfDay)

    const pricesToday = await context.entities.PriceData.findMany({
      where: {
        timeStamp: {
          gte: today,
          lte: endOfDay,
        },
      },
    })
    console.log(pricesToday.sort((a, b) => a.timeStamp - b.timeStamp))
    return pricesToday.sort((a, b) => a.timeStamp - b.timeStamp)
  } catch (error) {
    throw error
  } 
}

