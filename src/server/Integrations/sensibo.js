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
        //console.error(response)
      })
    }
  }

  export default sensiboPost