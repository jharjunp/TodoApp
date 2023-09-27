import axios from 'axios'

const sensiboPost = async (args, context) => {
    const relays = await args.relay.findMany({ where: { logic: 2 }, })
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
            successfulResponses.push(resp) //.data)
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
        //console.table(msg)
        console.log(resp)
      })
    }
      
    function handleFailedResponses(responses) {
      console.log('Failed Responses:')
      responses.forEach(response => {
        const parsedError = parseAxiosError(response)
        console.log(parsedError)
      })
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

  export default sensiboPost