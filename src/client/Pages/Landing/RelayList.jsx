import React, { useState } from 'react';
import editRelay from '@wasp/actions/editRelay';
import deleteRelay from '@wasp/actions/deleteRelay';
import './RelayList.css';

const getRelayModel = (type) => {
  switch(type) {
    case 1:
      return "Shelly";
    case 2:
      return "Sensibo";
    default:
      return "Unknown";  // default case if the type is neither 1 nor 2
  }
};

const sortRelays = (relays) => {
  return [...relays].sort((a, b) => {
    if (a.type < b.type) return -1;
    if (a.type > b.type) return 1;
    if (a.logic < b.logic) return -1;
    if (a.logic > b.logic) return 1;
    return 0; 
  });
};

const RelayList = ({ relays, logs }) => {
    const [isEditing, setIsEditing] = useState({});
    const [relayValues, setRelayValues] = useState({});

    const handleEdit = (id) => {
      setIsEditing({ ...isEditing, [id]: true });
      setRelayValues({ ...relayValues, [id]: relays.find(relay => relay.id === id) });
    };

    const handleSave = async (id) => {
      try {
        await editRelay(relayValues[id]);
        setIsEditing({ ...isEditing, [id]: false });
      } catch (error) {
        console.error('Error saving relay:', error);
        // Optionally: Display an error message to the user
      }
    };

    const handleChange = (id, field, value) => {
      const numberFields = ['hours', 'temp_1', 'temp_2'];
      const updatedValue = numberFields.includes(field) ? Number(value) : value;
      setRelayValues({
          ...relayValues,
          [id]: { ...relayValues[id], [field]: updatedValue }
      });
  };

    const handleDelete = async (id) => {
      try {
        await deleteRelay(id);
        // Optionally: Update the UI to reflect the deletion
      } catch (error) {
        console.error('Error deleting relay:', error);
        // Optionally: Display an error message to the user
      }
    };

    const sortedRelays = sortRelays(relays);

    if (!relays?.length) return <div>No relays</div>;

    return (
        <div className="data-container">
            <table>
                <thead>
                    <tr>
                        <th>Releen malli</th>
                        <th>Ohjelma</th>
                        <th>Kuvaus</th>
                        <th>Tunnit</th>
                        <th>Normaalilämpö</th>
                        <th>Alennettu lämpö</th>
                        <th>Device ID</th>
                        <th>API Avain</th>
                        <th>Viimeisin päivitys</th>
                        <th>Muuta</th>
                        <th></th>  {/* Empty header for the Delete column */}
                    </tr>
                </thead>
                <tbody>
                    {sortedRelays.map((relay) => (
                        <tr key={relay.id}>
                            <td>{getRelayModel(relay.type)}</td>
                            <td>{relay.logic}
                            </td>
                            <td>
                                {isEditing[relay.id] ? (
                                    <input
                                        type="text"
                                        value={relayValues[relay.id]?.description || ''}
                                        onChange={(e) => handleChange(relay.id, 'description', e.target.value)}
                                    />
                                ) : (
                                    relay.description
                                )}
                            </td>
                            <td>
                                {isEditing[relay.id] ? (
                                    <input
                                        type="number"
                                        value={relayValues[relay.id]?.hours || ''}
                                        onChange={(e) => handleChange(relay.id, 'hours', e.target.value)}
                                    />
                                ) : (
                                    relay.hours
                                )}
                            </td>
                            <td className={relay.type === 2 ? '' : 'greyed-out'}>
                                {isEditing[relay.id] && relay.type === 2 ? (
                                    <input
                                        type="number"
                                        value={relayValues[relay.id]?.temp_1 || ''}
                                        onChange={(e) => handleChange(relay.id, 'temp_1', e.target.value)}
                                    />
                                ) : (
                                    relay.type === 2 ? relay.temp_1 : null
                                )}
                            </td>
                            <td className={relay.type === 2 ? '' : 'greyed-out'}>
                                {isEditing[relay.id] && relay.type === 2 ? (
                                    <input
                                        type="number"
                                        value={relayValues[relay.id]?.temp_2 || ''}
                                        onChange={(e) => handleChange(relay.id, 'temp_2', e.target.value)}
                                    />
                                ) : (
                                    relay.type === 2 ? relay.temp_2 : null
                                )}
                            </td>
                            <td>
                                {isEditing[relay.id] ? (
                                    <input
                                        type="text"
                                        value={relayValues[relay.id]?.deviceID || ''}
                                        onChange={(e) => handleChange(relay.id, 'deviceID', e.target.value)}
                                    />
                                ) : (
                                    relay.deviceID
                                )}
                            </td>
                            <td className='api-key-cell'>
                                {isEditing[relay.id] ? (
                                    <input
                                        type="text"
                                        value={relayValues[relay.id]?.apiKey || ''}
                                        onChange={(e) => handleChange(relay.id, 'apiKey', e.target.value)}
                                    />
                                ) : (
                                    relay.apiKey
                                )}
                            </td>
                            <td>{
                                  (() => {
                                    const log = logs.find((log) => relay.id === log.relayId);
                                    return log ? (log.outcome ? "Ok" : "Nok") : "N/A";
                                  })()
                                }
                            </td>
                            <td>
                                {isEditing[relay.id] ? (
                                    <button onClick={() => handleSave(relay.id)}>Save</button>
                                ) : (
                                    <button onClick={() => handleEdit(relay.id)}>Edit</button>
                                )}
                            </td>
                            <td>
                                {isEditing[relay.id] && (
                                    <button onClick={() => handleDelete(relay.id)}>Delete</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RelayList;
