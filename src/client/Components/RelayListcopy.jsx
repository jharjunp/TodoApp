import React, { useState, useMemo, useEffect } from "react";
import { useQuery } from "@wasp/queries";
import editRelay from "@wasp/actions/editRelay";
import deleteRelay from "@wasp/actions/deleteRelay";
import getLatestOutcomesPerRelay from "@wasp/queries/getLatestOutcomesPerRelay";
import getRelays from "@wasp/queries/getRelays";
import AddRelay from "./addRelay.jsx";
import "tailwindcss/tailwind.css";
import "../CSS/RelayList.css";

const getRelayModel = (type) => {
  switch (type) {
    case 1:
      return "Shelly";
    case 2:
      return "Sensibo";
    default:
      return "Unknown"; // default case if the type is neither 1 nor 2
  }
};

const getRelayProgram = (logic) => {
  switch (logic) {
    case 1:
      return "On-Off";
    case 2:
      return "High-Low";
    default:
      return "Unknown"; // default case if the type is neither 1 nor 2
  }
};

const sortRelays = (relays = []) => {
  return [...relays].sort((a, b) => {
    if (a.type < b.type) return -1;
    if (a.type > b.type) return 1;
    if (a.logic < b.logic) return -1;
    if (a.logic > b.logic) return 1;
    return 0;
  });
};

const RelayList = ({ args }) => {
  const {
    data: relays,
    isLoading: relaysLoading,
    error: error1,
  } = useQuery(getRelays);
  const {
    data: logs,
    isLoading: logsLoading,
    error: logsError,
  } = useQuery(getLatestOutcomesPerRelay);

  const [isEditing, setIsEditing] = useState({});
  const [relayValues, setRelayValues] = useState({});
  const [overlayContent, setOverlayContent] = useState(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  useEffect(() => {
    // Close overlay when overlayContent is null
    if (!overlayContent) {
      setIsOverlayVisible(false);
    }
  }, [overlayContent]);

  const handleEdit = (id) => {
    setIsEditing({ ...isEditing, [id]: true });
    setRelayValues({
      ...relayValues,
      [id]: relays.find((relay) => relay.id === id),
    });
  };

  const handleSave = async (id) => {
    try {
      await editRelay(relayValues[id]);
      setIsEditing({ ...isEditing, [id]: false });
    } catch (error) {
      console.error("Error saving relay:", error);
      // Optionally: Display an error message to the user
    }
  };

  const handleChange = (id, field, value) => {
    const numberFields = ["hours", "temp_1", "temp_2"];
    const updatedValue = numberFields.includes(field) ? Number(value) : value;
    setRelayValues({
      ...relayValues,
      [id]: { ...relayValues[id], [field]: updatedValue },
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteRelay(id);
      // Optionally: Update the UI to reflect the deletion
    } catch (error) {
      console.error("Error deleting relay:", error);
      // Optionally: Display an error message to the user
    }
  };

  const sortedRelays = relays ? sortRelays(relays) : [];

  const groupedRelays = useMemo(() => {
    if (!sortedRelays.length) return {};
    const groups = {};
    sortedRelays.forEach((relay) => {
      const program = getRelayProgram(relay.logic);
      if (!groups[program]) groups[program] = [];
      groups[program].push(relay);
    });
    return groups;
  }, [sortedRelays]);

  if (!relays?.length)
    return (
      <div>
        <h2>lisää ensimmäinen releesi</h2>
        <AddRelay />
      </div>
    );

  return (
    <div className="flex flex-col">
      <div>
        {relaysLoading && "Loading relays..."}
        {error1 && "Error: " + error1}
        {logsLoading && "Loading logs..."}
        {logsError && "Error: " + logsError}
      </div>
      {relays && logs && (
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div></div>{" "}
            {/* This empty div helps in aligning the button to the right */}
            <button
              onClick={() => setIsOverlayVisible(true)}
              className="bg-blue-500 text-white px-6 py-2 rounded shadow"
            >
              Lisää uusi rele
            </button>
          </div>
          {Object.entries(groupedRelays).map(([program, relays], idx) => (
            <div key={idx} className="mb-4">
              <h3 className="text-lg font-bold mb-2">{program}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {relays.map((relay) => {
                  const log = logs.find((log) => relay.id === log.relayId);
                  const isNok = log ? log.outcome === false : false;
                  return (
                    <div
                      key={relay.id}
                      className={`border rounded-lg p-4 ${
                        isNok
                          ? "bg-blue-300 border-red-500"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className="text-sm font-medium">
                        {getRelayModel(relay.type)}
                      </div>
                      <div>Description: {relay.description}</div>
                      <div>Hours: {relay.hours}</div>
                      {program !== "On-Off" && relay.type === 2 && (
                        <>
                          <div>Temperature: {relay.temp_1}</div>
                          <div>Reduced Temperature: {relay.temp_2}</div>
                        </>
                      )}
                      <div>Device ID: {relay.deviceID}</div>
                      <div>API Key: {relay.apiKey}</div>

                      <div className="mt-2">
                        <div className="mt-2 flex justify-between items-center">
                          <button
                            onClick={() => handleEdit(relay.id)}
                            className="bg-blue-500 text-white px-6 py-2 rounded shadow"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(relay.id)}
                            className="bg-red-700 text-white px-6 py-2 rounded shadow"
                          >
                            Delete
                          </button>
                        </div>
                        {isEditing[relay.id] ? (
                          <div className="mt-2">
                            <input
                              type="text"
                              value={relayValues[relay.id]?.description || ""}
                              onChange={(e) =>
                                handleChange(
                                  relay.id,
                                  "description",
                                  e.target.value
                                )
                              }
                              className="px-3 py-2 border border-gray-300 rounded-md mb-2"
                              placeholder="Description"
                            />
                            <input
                              type="number"
                              value={relayValues[relay.id]?.hours || ""}
                              onChange={(e) =>
                                handleChange(relay.id, "hours", e.target.value)
                              }
                              className="px-3 py-2 border border-gray-300 rounded-md mb-2"
                              placeholder="Hours"
                            />
                            {program !== "On-Off" && relay.type === 2 && (
                              <>
                                <input
                                  type="number"
                                  value={relayValues[relay.id]?.temp_1 || ""}
                                  onChange={(e) =>
                                    handleChange(
                                      relay.id,
                                      "temp_1",
                                      e.target.value
                                    )
                                  }
                                  className="px-3 py-2 border border-gray-300 rounded-md mb-2"
                                  placeholder="Temperature"
                                />
                                <input
                                  type="number"
                                  value={relayValues[relay.id]?.temp_2 || ""}
                                  onChange={(e) =>
                                    handleChange(
                                      relay.id,
                                      "temp_2",
                                      e.target.value
                                    )
                                  }
                                  className="px-3 py-2 border border-gray-300 rounded-md mb-2"
                                  placeholder="Reduced Temperature"
                                />
                              </>
                            )}
                            <input
                              type="text"
                              value={relayValues[relay.id]?.deviceID || ""}
                              onChange={(e) =>
                                handleChange(
                                  relay.id,
                                  "deviceID",
                                  e.target.value
                                )
                              }
                              className="px-3 py-2 border border-gray-300 rounded-md mb-2"
                              placeholder="Device ID"
                            />
                            <input
                              type="text"
                              value={relayValues[relay.id]?.apiKey || ""}
                              onChange={(e) =>
                                handleChange(relay.id, "apiKey", e.target.value)
                              }
                              className="px-3 py-2 border border-gray-300 rounded-md mb-2"
                              placeholder="API Key"
                            />
                            <div className="flex justify-between items-center mt-2">
                              <button
                                onClick={() => handleSave(relay.id)}
                                className="bg-green-500 text-white px-4 py-2 rounded"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div></div>
                          // ... rest of your relay details and edit/delete buttons
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
          {isOverlayVisible && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-4 rounded shadow-lg">
                <AddRelay />
                <button
                  onClick={() => setIsOverlayVisible(false)}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RelayList;
