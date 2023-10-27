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
        <div>
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <div></div>{" "}
                  {/* This empty div helps in aligning the button to the right */}
                  <button
                    onClick={() => setIsOverlayVisible(true)}
                    className="bg-blue-500 text-white px-6 py-2 rounded shadow"
                  >
                    Lisää uusi rele
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    {Object.entries(groupedRelays).map(
                      ([program, relays], idx) => (
                        <div key={idx}>
                          <table className="min-w-full divide-y divide-gray-200 mb-4">
                            <thead className="bg-gray-50">
                              <tr>
                                <th
                                  colSpan={program === "On-Off" ? "7" : "9"}
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  {program}
                                </th>
                              </tr>
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Malli
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Kuvaus
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Tunnit
                                </th>
                                {program !== "On-Off" && (
                                  <>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Lämpötila
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                      Alennettu lämpö
                                    </th>
                                  </>
                                )}
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Device ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  API Avain
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Muuta
                                </th>
                                <th className="px-6 py-3"></th>
                                {""}
                                {/* Empty header for the Delete column */}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {relays.map((relay) => {
                                const log = logs.find(
                                  (log) => relay.id === log.relayId
                                );
                                const isNok = log
                                  ? log.outcome === false
                                  : false;
                                return (
                                  <tr
                                    key={relay.id}
                                    className={
                                      isNok
                                        ? "text-red-500 bg-white"
                                        : "bg-white"
                                    }
                                  >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      {getRelayModel(relay.type)}
                                    </td>
                                    <td className="px-6 py-4 text-left whitespace-nowrap">
                                      {isEditing[relay.id] ? (
                                        <input
                                          type="text"
                                          value={
                                            relayValues[relay.id]
                                              ?.description || ""
                                          }
                                          onChange={(e) =>
                                            handleChange(
                                              relay.id,
                                              "description",
                                              e.target.value
                                            )
                                          }
                                          className="px-3 py-2 border border-gray-300 rounded-md"
                                        />
                                      ) : (
                                        relay.description
                                      )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      {isEditing[relay.id] ? (
                                        <input
                                          type="number"
                                          value={
                                            relayValues[relay.id]?.hours || ""
                                          }
                                          onChange={(e) =>
                                            handleChange(
                                              relay.id,
                                              "hours",
                                              e.target.value
                                            )
                                          }
                                          className="px-3 py-2 border border-gray-300 rounded-md w-20"
                                        />
                                      ) : (
                                        relay.hours
                                      )}
                                    </td>
                                    {program !== "On-Off" && (
                                      <>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          {isEditing[relay.id] &&
                                          relay.type === 2 ? (
                                            <input
                                              type="number"
                                              value={
                                                relayValues[relay.id]?.temp_1 ||
                                                ""
                                              }
                                              onChange={(e) =>
                                                handleChange(
                                                  relay.id,
                                                  "temp_1",
                                                  e.target.value
                                                )
                                              }
                                              className="px-3 py-2 border border-gray-300 rounded-md w-20"
                                            />
                                          ) : relay.type === 2 ? (
                                            relay.temp_1
                                          ) : null}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                          {isEditing[relay.id] &&
                                          relay.type === 2 ? (
                                            <input
                                              type="number"
                                              value={
                                                relayValues[relay.id]?.temp_2 ||
                                                ""
                                              }
                                              onChange={(e) =>
                                                handleChange(
                                                  relay.id,
                                                  "temp_2",
                                                  e.target.value
                                                )
                                              }
                                              className="px-3 py-2 border border-gray-300 rounded-md w-20"
                                            />
                                          ) : relay.type === 2 ? (
                                            relay.temp_2
                                          ) : null}
                                        </td>
                                      </>
                                    )}
                                    <td className="px-6 py-4 text-left whitespace-nowrap">
                                      {isEditing[relay.id] ? (
                                        <input
                                          type="text"
                                          value={
                                            relayValues[relay.id]?.deviceID ||
                                            ""
                                          }
                                          onChange={(e) =>
                                            handleChange(
                                              relay.id,
                                              "deviceID",
                                              e.target.value
                                            )
                                          }
                                          className="px-3 py-2 border border-gray-300 rounded-md hide-scrollbar"
                                          style={{ maxWidth: "20ch" }}
                                        />
                                      ) : (
                                        <div
                                          className="overflow-x-auto hide-scrollbar"
                                          style={{
                                            overflowX: "auto",
                                            maxWidth: "20ch",
                                          }}
                                        >
                                          {relay.deviceID}
                                        </div>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 text-left whitespace-nowrap">
                                      {isEditing[relay.id] ? (
                                        <input
                                          type="text"
                                          value={
                                            relayValues[relay.id]?.apiKey || ""
                                          }
                                          onChange={(e) =>
                                            handleChange(
                                              relay.id,
                                              "apiKey",
                                              e.target.value
                                            )
                                          }
                                          className="px-3 py-2 border border-gray-300 rounded-md hide-scrollbar"
                                          style={{ maxWidth: "20ch" }}
                                        />
                                      ) : (
                                        <div
                                          className="overflow-x-auto hide-scrollbar"
                                          style={{
                                            overflowX: "auto",
                                            maxWidth: "20ch",
                                          }}
                                        >
                                          {relay.apiKey}
                                        </div>
                                      )}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm">
                                      {isEditing[relay.id] ? (
                                        <button
                                          onClick={() => handleSave(relay.id)}
                                          className="text-indigo-600 hover:text-indigo-900"
                                        >
                                          Save
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => handleEdit(relay.id)}
                                          className="flex items-center p-2 bg-blue-500 border border-blue-500 rounded hover:bg-blue-700 transition duration-300"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                          >
                                            <path d="M12.7071 4.70711C12.3166 4.31658 11.6834 4.31658 11.2929 4.70711L4 12V16H8L15.2929 8.70711C15.6834 8.31658 15.6834 7.68342 15.2929 7.29289L12.7071 4.70711ZM10 5.41421L12.5858 8L14 6.58579L11.4142 4L10 5.41421Z" />
                                          </svg>
                                        </button>
                                      )}
                                      {isEditing[relay.id] && (
                                        <button
                                          onClick={() => handleDelete(relay.id)}
                                          className="ml-4 text-red-600 hover:text-red-900"
                                        >
                                          Delete
                                        </button>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
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
