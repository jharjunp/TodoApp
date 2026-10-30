import axios from "axios";

const createRequest = (relay, action) => {
  const postData = new URLSearchParams({
    channel: 0,
    turn: action,
    id: relay.deviceID,
    auth_key: relay.apiKey,
  }).toString();

  return axios
    .post("https://shelly-184-eu.shelly.cloud/device/relay/control", postData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .catch((error) => error);
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

    const action = new URLSearchParams(response.config.data).get("turn");
    const isOn = action === "on";

    try {
      await args.relay.update({
        where: { id: relayId },
        data: { isOn },
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

const shellyPost = async (args, context) => {
  const relays = await args.relay.findMany({ where: { type: 1 } });

  const turnOn = relays.filter((relay) => relay.SetOn && !relay.isOn);
  const turnOff = relays.filter((relay) => !relay.SetOn && relay.isOn);

  const requests = [
    ...turnOn.map((relay) => createRequest(relay, "on")),
    ...turnOff.map((relay) => createRequest(relay, "off")),
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
  console.log("Shelly: " + error.config.data);
  if (error.response) {
    // The request was made, but the server responded with an error status
    const status = error.response.status;
    const statusText = error.response.statusText;
    const responseData = error.response.data;
    const parts = error.config.data.split("&");
    const id = parts[2];
    const deviceID = id.split("=")[1];

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

export default shellyPost;
