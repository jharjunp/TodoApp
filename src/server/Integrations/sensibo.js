import axios from "axios";

const createRequest = (relay, state) => {
  const url = `https://home.sensibo.com/api/v2/pods/${relay.deviceID}/acStates`;
  const data = {
    acState: {
      on: true,
      mode: "heat",
      fanLevel: state ? "low" : "auto",
      targetTemperature: state ? relay.temp_2 : relay.temp_1,
    },
  };
  const params = { params: { apiKey: relay.apiKey } };
  return axios.post(url, data, params).catch((error) => error);
};

async function handleResponse(response, relay, args) {
  const relayId = relay.id;
  const userID = relay.userId;
  const logData = {
    timeStamp: new Date(),
    relay: { connect: { id: relayId } },
    user: { connect: { id: userID } },
  };

  if (response instanceof Error) {
    const parsedError = parseAxiosError(response);
    logData.outcome = false;
    logData.logEntry = parsedError;
  } else {
    const { status, statusText, data } = response;
    logData.outcome = true;
    logData.logEntry = {
      StatusCode: status,
      StatusText: statusText,
      ResponseData: data,
    };

    try {
      await args.relay.update({
        where: { id: relayId },
        data: { isOn: data.result.acState.targetTemperature == relay.temp_2 },
      });
    } catch (error) {
      console.error("Error updating relay:", error.message);
    }
  }

  try {
    await args.log.create({ data: logData });
  } catch (error) {
    console.error("Error logging response:", error.message);
  }
}

const sensiboPost = async (args, context) => {
  const relays = await args.relay.findMany({ where: { type: 2 } });

  const turnOn = relays.filter((relay) => relay.SetOn && !relay.isOn);
  const turnOff = relays.filter((relay) => !relay.SetOn && relay.isOn);

  const requests = [
    ...turnOn.map((relay) => createRequest(relay, true)),
    ...turnOff.map((relay) => createRequest(relay, false)),
  ];

  const responses = await Promise.allSettled(requests);

  for (let i = 0; i < responses.length; i++) {
    const response = responses[i];
    const isTurnOn = i < turnOn.length;
    const relay = isTurnOn ? turnOn[i] : turnOff[i - turnOn.length];
    await handleResponse(response.value, relay, args);
  }
};

function parseAxiosError(error) {
  if (error.response) {
    // The request was made, but the server responded with an error status
    const status = error.response.status;
    const statusText = error.response.statusText;
    const responseData = error.response.data;
    const url = error.config.url;
    const parts = url.split("/");
    const deviceID = parts[6];

    return {
      deviceID,
      status,
      statusText,
      responseData,
    };
  } else if (error.request) {
    // The request was made, but no response was received
    // This can happen if the server is unreachable
    return {
      status: "Request Failed",
      message: "No response received from the server.",
    };
  } else {
    // Something else went wrong while setting up the request
    return {
      status: "Request Error",
      message: error.message,
    };
  }
}

export default sensiboPost;
