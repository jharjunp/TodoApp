import HttpError from '@wasp/core/HttpError.js'

export const getTasks = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401)
  }
  return context.entities.Task.findMany({
    where: { user: { id: context.user.id } },
  })
}

export const getXCheapestHours = async (args, context) => {
  const viimeisimmatHinnat = await context.entities.Hinnat.findUnique({
    where: { 
      id: 1,
    },
  })
  const vuorokaudenHinnat = viimeisimmatHinnat.hinnat.prices.filter(
    (price) => new Date(price.startDate).getDate() == new Date().getDate() 
  );
  vuorokaudenHinnat.sort((a, b) => a.price - b.price)
  const xHalvinta = vuorokaudenHinnat.slice(0, args.hours)
  xHalvinta.sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate))
  return xHalvinta
}

export const getRelays = async (args, context) => {
  return context.entities.Relay.findMany({
    where: { logic: args.logic },
  })
}


