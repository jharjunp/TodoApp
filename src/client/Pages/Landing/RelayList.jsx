import React, { useState, useEffect } from 'react'

const RelayList = ({ relays, logs }) => {
    const [isEditing, setIsEditing] = useState({})
  
    const handleEdit = (id) => {
      setIsEditing({ ...isEditing, [id]: true });
    };
    
    const handleSave = (id) => {
      // Send updated data to your API for saving (implement this)
      setIsEditing({ ...isEditing, [id]: false });
    };
  
    if (!relays?.length) return <div>No relays</div>

    return (
      <div className="data-container">
          <table>
            <thead>
              <tr>
                <th>Logiikka</th>
                <th>Kuvaus</th>
                <th>Tuntia</th>
                <th>Normaali lämpö</th>
                <th>Alennettu lämpö</th>
                <th>Is On</th>
                <th>Set On</th>
                <th>Viimeisin päivitys</th>
                <th>Muuta</th>
              </tr>
            </thead>
            <tbody>
              {relays.map((relay) => (
                <tr key={relay.id}>
                  <td>{isEditing[relay.id] ? <input type="text" value={relay.logic} /> : relay.logic}</td>
                  <td>{isEditing[relay.id] ? <input type="text" value={relay.description} /> : relay.description}</td>
                  <td>{isEditing[relay.id] ? <input type="text" value={relay.hours} /> : relay.hours}</td>
                  <td>{isEditing[relay.id] ? <input type="text" value={relay.temp_1} /> : relay.temp_1}</td>
                  <td>{isEditing[relay.id] ? <input type="text" value={relay.temp_2} /> : relay.temp_2}</td>
                  <td>{isEditing[relay.id] ? <input type="text" value={relay.isOn} /> : relay.isOn ? "true" : "false"}</td>
                  <td>{isEditing[relay.id] ? <input type="text" value={relay.setOn} /> : relay.setOn ? "true" : "false"}</td>
                  <td>{logs.find((log) => relay.id === log.relayId).outcome ? "Ok" : "Nok"}</td>
                  <td>
                    {isEditing[relay.id] ? (
                      <button onClick={() => handleSave(relay.id)}>Save</button>
                    ) : (
                      <button onClick={() => handleEdit(relay.id)}>Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    )
  }

  export default RelayList