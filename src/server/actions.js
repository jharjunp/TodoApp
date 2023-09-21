import axios from 'axios'
import HttpError from '@wasp/core/HttpError.js'
import getXCheapestHours from '@wasp/queries/getXCheapestHours.js'
import getRelays from '@wasp/queries/getRelays.js'
//import createHinnat from '@wasp/actions/createHinnat.js'
//import { isPrismaError, prismaErrorToHttpError } from "@wasp/utils.js";

export const createRelay = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401)
  }
  return context.entities.Relay.create({
    data: {
      logic: Number(args.logic),
      description: args.description,
      hours: Number(args.hours),
      temp_1: Number(args.temp_1),
      temp_2: Number(args.temp_2),
      price_1: Number(args.price_1),
      price_2: Number(args.price_2),
      isOn: false,
      SetOn: false,
      deviceID: args.deviceID,
      apiKey: args.apiKey,
//      userId: context.user.id, 
      user: { connect: { id: context.user.id } },
    },
  })
}

export const updateTask = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401)
  }
  return context.entities.Task.updateMany({
    where: { id: args.id, user: { id: context.user.id } },
    data: { isDone: args.isDone },
  })
}

export const updateRelaysLogic_1 = async (args, context) => {

  const relays = await getRelays({logic: 1})
  const vuorokaudenHinnat = await getXCheapestHours({hours: 24})
  const xHalvin = vuorokaudenHinnat.sort((a, b) => a.price - b.price).map(getHour).findIndex(checkHour) + 1
  console.log('Now is the ' + xHalvin + ' cheapest hour of the day.' )
  const turnOn = []
  const turnOff = []

  relays.forEach(relay => {
    if (relay.hours >= xHalvin && !relay.isOn) {  
      turnOn.push(relay.id)
    } else {
        turnOff.push(relay.id)
      }
    })
  
  const updateOn = await context.entities.Relay.updateMany({
    where: {id: { in: turnOn},},
    data: {SetOn: true}
  })

  const updateOff = await context.entities.Relay.updateMany({
    where: {id: { in: turnOff},},
    data: {SetOn: false}
  })

  function getHour(price) {
    return new Date(price.startDate).getHours()
  }

  function checkHour(hour) {
    const nowHour = new Date().getHours()
    return hour == nowHour
  }
}

export const updateRelaysLogic_2 = async (args, context) => {
  const relays = await getRelays({logic: 2})
  const hourlyPrices = await getXCheapestHours({hours: 24})
  const xCostliest = hourlyPrices.sort((a, b) => b.price - a.price).map(getHour).findIndex(checkHour) + 1
  console.log('Now is the ' + xCostliest + ' most expensive hour of the day.' )
  const turnOn = []
  const turnOff = []

  relays.forEach(relay => {
    if (relay.hours >= xCostliest && !relay.isOn) {  
      turnOn.push(relay.id)
    } else {
        turnOff.push(relay.id)
      }
  })
  
  const updateOn = await context.entities.Relay.updateMany({
    where: {id: { in: turnOn},},
    data: {SetOn: true}
  })

  const updateOff = await context.entities.Relay.updateMany({
    where: {id: { in: turnOff},},
    data: {SetOn: false}
  })

  function getHour(price) {
    return new Date(price.startDate).getHours()
  }

  function checkHour(hour) {
    const nowHour = new Date().getHours()
    return hour == nowHour
  }
}

export const sensiboPost = async (args, context) => {
  const relays = await getRelays({logic: 2})
  const turnOn = []
  const turnOff = []
  relays.forEach(relay => {
    if (relay.SetOn && !relay.isOn) {  
      turnOn.push(relay)
    } else if (!relay.SetOn && relay.isOn) {
        turnOff.push(relay)
    } 
  })
  const requests = []
  turnOn.forEach (relay => {
    requests.push(axios.post("https://home.sensibo.com/api/v2/pods/" + relay.deviceID + "/acStates", 
      {acState: 
        {on: true,
         mode: "heat",
         fanLevel: "auto",
         targetTemperature: relay.temp_2,
      }},
      {params: {"apiKey": relay.apiKey}}
    ))
  })
  turnOff.forEach (relay => {
    requests.push(axios.post("https://home.sensibo.com/api/v2/pods/" + relay.deviceID + "/acStates", 
      {acState: 
        {on: true,
         mode: "heat",
         fanLevel: "auto",
         targetTemperature: relay.temp_1,
      }},
      {params: {"apiKey": relay.apiKey}}
    ))
  })

  axios.all(requests.map(promise => promise.catch(error => error)))
  .then((responses) => {
    const successfulResponses = []
    const failedResponses = []

    responses.forEach((resp) => {
      if (resp instanceof Error) {
          failedResponses.push(resp)
      } else {
          successfulResponses.push(resp.data)
      }
    })

    handleSuccessfulResponses(successfulResponses)
    handleFailedResponses(failedResponses)
  })

  function handleSuccessfulResponses(responses) {
    console.log('Successful Responses:')
    responses.forEach((resp) => {
      let msg = {
        data:   resp,
        result: resp.result,
        fields: Object.keys(resp).toString(),
      }
      //console.info(resp.config.url)
      console.table(msg)
    })
  }
    
  function handleFailedResponses(responses) {
    console.log('Failed Responses:')
    responses.forEach(response => {
      console.error(response)
    })
  }
}

export const updatePrices = async (args, context) => {
  console.log('Fetching new prices...')
    axios
      .get('https://api.porssisahko.net/v1/latest-prices.json')
      .then(async response => {
        console.log('Pricefetching promise fulfilled')
        try {
              await context.entities.Hinnat.update({
                where: {
                  id: 1,
                },
                data: {
                  hinnat: response.data,
                },
              })  
          } catch (err) {
            console.log("Sattui virhe: " + err.message)
          }
      })
}

// export const createHinnat = async (args, context) => {
//   console.log('luodaan hintoja')
// //  console.log(args)

//    return context.entities.Hinnat.update({
//     where: {
//       id: 1,
//     },
//     data: {
//       hinnat: args.hinnat,
//     },
//   })
// }