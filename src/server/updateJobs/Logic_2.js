import getTodaysPrices from "@wasp/queries/getTodaysPrices.js";

const updateLogic_2 = async (args, context) => {
  const relays = await args.relay.findMany({ where: { logic: 2 } });
  const hourlyPrices = await getTodaysPrices({ offset: 0 });
  const xCostliest =
    hourlyPrices
      .sort((a, b) => b.price - a.price)
      .map(getHour)
      .findIndex(checkHour) + 1;
  console.log("Now is the " + xCostliest + " most expensive hour of the day.");
  const turnOn = [];
  const turnOff = [];

  relays.forEach((relay) => {
    if (relay.hours >= xCostliest) {
      console.log("Updating SetOn to TRUE for: " + relay.id)
      turnOn.push(relay.id);
    } else {
      console.log("Updating SetOn to FALSE for: " + relay.id)
      turnOff.push(relay.id);
    }
  });

  const updateOn = await args.relay.updateMany({
    where: { id: { in: turnOn } },
    data: { SetOn: true },
  });

  const updateOff = await args.relay.updateMany({
    where: { id: { in: turnOff } },
    data: { SetOn: false },
  });

  function getHour(price) {
    return new Date(price.timeStamp).getHours();
  }

  function checkHour(hour) {
    const nowHour = new Date().getHours();
    return hour == nowHour;
  }
};

export default updateLogic_2;
