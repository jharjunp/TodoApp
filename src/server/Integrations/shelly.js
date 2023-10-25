import axios from "axios";

const shellyPost = async (args, context) => {
  const relays = await args.relay.findMany({ where: { type: 1 } });
  const turnOn = [];
  const turnOff = [];
  relays.forEach((relay) => {
    if (relay.SetOn && !relay.isOn) {
      turnOn.push(relay);
    } else if (!relay.SetOn && relay.isOn) {
      turnOff.push(relay);
    }
  });
  const requests = [];

  function createRequest(relay, action) {
    const postData = new URLSearchParams({
      channel: 0,
      turn: action,
      id: relay.deviceID,
      auth_key: relay.apiKey,
    }).toString();

    return axios.post(
      "https://shelly-77-eu.shelly.cloud/device/relay/control",
      postData,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
  }

  turnOn.forEach((relay) => requests.push(createRequest(relay, "on")));
  turnOff.forEach((relay) => requests.push(createRequest(relay, "off")));

  axios
    .all(requests.map((promise) => promise.catch((error) => error)))
    .then((responses) => {
      const successfulResponses = [];
      const failedResponses = [];

      responses.forEach((resp) => {
        if (resp instanceof Error) {
          failedResponses.push(resp);
        } else {
          successfulResponses.push(resp);
        }
      });
      try {
        handleSuccessfulResponses(successfulResponses);
        handleFailedResponses(failedResponses);
      } catch (error) {
        console.error(error);
      }
    });

  function handleSuccessfulResponses(responses) {
    console.log("Successful Responses:");
    responses.forEach(async (resp) => {
      const { status, statusText, config, data } = resp;
      const parts = config.data.split("&");
      const id = parts[2];
      const deviceID = id.split("=")[1];
      const relayId = getRelayIdByDeviceID(deviceID);
      const userID = getUserIdByRelayID(relayId);
      let logEntry = {
        StatusCode: status,
        StatusText: statusText,
        ResponseData: data,
      };

      //Update the log -table.
         const logged = await args.log.create({
          data: {
            timeStamp: new Date(),
            outcome: true,
            logEntry: logEntry,
            relay: {
              connect: { id: relayId },
            },
            user: {
              connect: { id: userID },
            },
          },
        });
      // Update the isOn -information on the Relay -table. Rule is on if the temp_2 is set.
        const update = await args.relay.update({
          where: { id: relayId },
          data: { isOn: parts[1] == "turn=on" ? true : false },
        });
    });
  }

  function handleFailedResponses(responses) {
    responses.forEach(async (response) => {
      const parsedError = parseAxiosError(response);
      const relayId = getRelayIdByDeviceID(parsedError.deviceID);
      const userID = getUserIdByRelayID(relayId);
        const logged = await args.log.create({
          data: {
            timeStamp: new Date(),
            outcome: false,
            logEntry: parsedError,
            relay: {
              connect: { id: relayId },
            },
            user: {
              connect: { id: userID },
            },
          },
        });
    });
  }

  function getRelayIdByDeviceID(deviceID) {
    const relay = relays.find((relay) => relay.deviceID === deviceID);
    if (relay) {
      return relay.id;
    } else {
      return null;
    }
  }

  function getUserIdByRelayID(relayID) {
    const relay = relays.find((relay) => relay.id === relayID);
    //console.log("UserId: " + relay.userId)
    if (relay) {
      return relay.userId;
    } else {
      return null;
    }
  }

  function parseAxiosError(error) {
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
};

export default shellyPost;
