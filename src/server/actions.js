import axios from 'axios'
import HttpError from '@wasp/core/HttpError.js'
import { hourlyJob } from '@wasp/jobs/hourlyJob.js'


export const triggerHourly = async (args, context) => {
  return await hourlyJob.submit()
}

export const createRelay = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401)
  }

  const dataToSend = {...args}
  dataToSend.user = { connect: { id: context.user.id } }
  console.log(dataToSend)
  return context.entities.Relay.create({
    data: { ...dataToSend }
  })
}

export const updatePrices = async (args, context) => {
  console.log('Fetching new prices...')
    axios
      .get('https://api.porssisahko.net/v1/latest-prices.json')
      .then(async response => {
        console.log('Pricefetching promise fulfilled')
        try {
          storePriceData(response.data)            
        } catch (err) {
            console.log("Sattui virhe: " + err.message)
          }
      })
  const storePriceData = async (data) => {
    //console.log(data)
    data.prices.forEach( async price => {
      //console.log(price.startDate + ' ' + price.price)
      try {
          await context.entities.PriceData.upsert({
            where: {
              timeStamp: price.startDate,
            },
            update: {},
            create: {
              timeStamp: price.startDate,
              price: price.price
          }
        })
      } catch (err) {
        console.log("Sattui virhe: " + err.message)
      }
      
    })
  }
}
