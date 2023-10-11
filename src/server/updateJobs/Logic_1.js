import getTodaysPrices from '@wasp/queries/getTodaysPrices.js'

const updateLogic_1 = async (args, context) => {

    const relays = await args.relay.findMany({ where: { logic: 1 }, })
    const vuorokaudenHinnat = await getTodaysPrices({ offset: 0})
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
    
    const updateOn = await args.relay.updateMany({
      where: {id: { in: turnOn},},
      data: {SetOn: true}
    })
  
    const updateOff = await args.relay.updateMany({
      where: {id: { in: turnOff},},
      data: {SetOn: false}
    })
  
    function getHour(price) {
      return new Date(price.timeStamp).getHours()
    }
  
    function checkHour(hour) {
      const nowHour = new Date().getHours()
      return hour == nowHour
    }
}

export default updateLogic_1