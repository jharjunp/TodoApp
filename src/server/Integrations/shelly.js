import axios from 'axios'

const shellyPost = async (args, context) => {
    const relays = await args.relay.findMany({ where: { type: 2 }, })
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
      const postData = new URLSearchParams({
        channel: 0,
        turn: "on",
        id: relay.deviceID,
        auth_key: relay.apiKey
      }).toString();
      
      requests.push(
        axios.post(
          "https://shelly-77-eu.shelly.cloud/device/relay/control",
          postData,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        )
      )
    })
    turnOff.forEach (relay => {
      const postData = new URLSearchParams({
        channel: 0,
        turn: "off",
        id: relay.deviceID,
        auth_key: relay.apiKey
      }).toString();
      
      requests.push(
        axios.post(
          "https://shelly-77-eu.shelly.cloud/device/relay/control",
          postData,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          }
        )
      )
    })
  
    axios.all(requests.map(promise => promise.catch(error => error)))
    .then((responses) => {
      const successfulResponses = []
      const failedResponses = []
  
      responses.forEach((resp) => {
        if (resp instanceof Error) {
            failedResponses.push(resp)
        } else {
            successfulResponses.push(resp)
        }
      })

      handleSuccessfulResponses(successfulResponses)
      handleFailedResponses(failedResponses)
    })
  
    function handleSuccessfulResponses(responses) {
      console.log('Successful Responses:')
      responses.forEach(async (resp) => {
        const { status, statusText, config, data } = resp
        const parts = config.data.split('&')
        const id = parts[2]
        const deviceID = id.split('=')[1]
        const relayId = getRelayIdByDeviceID(deviceID)
        const userID = getUserIdByRelayID(relayId)
        let logEntry = {
          StatusCode:   status,
          StatusText:   statusText,
          ResponseData: data,
        }

        //Update the log -table.
        try {
            const logged = await args.log.create({
              data: {
                timeStamp:  new Date(),
                outcome:    true,
                logEntry:   logEntry,
                relay:      {
                    connect:    {id: relayId},
                },
                user:       {
                    connect:    {id: userID},
                }
              },
            })
        } catch (error) {
            throw error
        }
        // Update the isOn -information on the Relay -table. Rule is on if the temp_2 is set.
        try {
            const update = await args.relay.update({
              where: { id: relayId },
              data: { isOn: parts[1] == "turn=on" ? true : false }
            })
        } catch (error) {
            throw error
        }

      })
    }
      
    function handleFailedResponses(responses) {
      console.log('Failed Responses:')
      responses.forEach(async response => {
        console.log(response)
         const parsedError = parseAxiosError(response)
        // const relayId = getRelayIdByDeviceID(parsedError.deviceID)
        // const userID = getUserIdByRelayID(relayId)
        // // Update the log -table.
        // try {
        //     const logged = await args.log.create({
        //       data: {
        //         timeStamp:  new Date(),
        //         outcome:    false,
        //         logEntry:   parsedError,
        //         relay:      {
        //             connect:    {id: relayId},
        //         },
        //         user:       {
        //             connect:    {id: userID},
        //         }
        //       },
        //     })
        //   } catch (error) {
        //     throw error
        //   }
        //console.log(parsedError)
      })
    }

    function getRelayIdByDeviceID(deviceID) {
        const relay = relays.find((relay) => relay.deviceID === deviceID)
        if (relay) {
          return relay.id
        } else {
          return null
        }
    }

    function getUserIdByRelayID(relayID) {
        const relay = relays.find((relay) => relay.id === relayID)
        //console.log("UserId: " + relay.userId)
        if (relay) {
          return relay.userId
        } else {
          return null
        }
    }

    function parseAxiosError(error) {
      if (error.response) {
        // The request was made, but the server responded with an error status
        const status = error.response.status
        const statusText = error.response.statusText
        const responseData = error.response.data
        const url = error.config.url
        const parts = url.split('/')
        const deviceID = parts[6]
        
        return {
          deviceID,
          status,
          statusText,
          responseData,
        }
      } else if (error.request) {
        // The request was made, but no response was received
        // This can happen if the server is unreachable
        return {
          status: 'Request Failed',
          message: 'No response received from the server.',
        }
      } else {
        // Something else went wrong while setting up the request
        return {
          status: 'Request Error',
          message: error.message,
        }
      }
    }

  }

  export default shellyPost