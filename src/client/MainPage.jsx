import getTodaysPrices from '@wasp/queries/getTodaysPrices'
import triggerHourly from '@wasp/actions/triggerHourly'
import { useQuery } from '@wasp/queries'
import logout from '@wasp/auth/logout'
import Chart from "./chart.jsx"
import updatePrices from '@wasp/actions/updatePrices'
import getRelays from '@wasp/queries/getRelays'
import React, { useState, useEffect } from 'react'
import './MainPage.css'
import AddRelay from "./AddRelay.jsx"

const MainPage = ({ user }) => {

  const { data: relays, boolean: relaysLoading, error: error1 } = useQuery(getRelays, {
    logic: 2
  })
  const { data: todaysPrices, boolean: todaysPricesLoading, error: error3 } = useQuery(getTodaysPrices)
  

  return (
      <div>
        <div className="App">
        <a href="./relayManagement">relay management</a>
        <h1>Lisää rele</h1>
        <AddRelay />
      </div>

      <div>
        {relays && <RelayList relays={relays} />}
        {relaysLoading && 'Loading...'}
        {error1 && 'Error: ' + error1}
      </div>

      <button onClick={logout}>Logout</button>
      <button onClick={() => Jari( "triggerHourly" )}>triggerHourly</button>
      <button onClick={() => Jari2( "updatePrices" )}>updatePrices</button>
      <div className="App">
        {todaysPrices && <Chart dataset={todaysPrices} />}
      </div>
      <div>
        {todaysPrices && <HintaLista hinnat={todaysPrices} />}
        {todaysPricesLoading && 'Loading...'}
        {error3 && 'Error: ' + error3}
      </div>
    </div>
  )
}

const HintaLista = ({ hinnat }) => {
  console.log(hinnat)
  if (!hinnat?.length) return <div>Ei hintoja</div>
  return (
    <div className='priceList'> 
      <h2>Päivän hinnat</h2>
      {hinnat.map((hinta) => <Hinta key={hinta.id} data={hinta} /> )}
    </div>
  )
}

const Hinta = ({ data }) => {
  const sDate = new Date(data.timeStamp)
  return (
    <ul>
      <li key={data.id}>{sDate.getDate()}.{sDate.getMonth() + 1} klo {sDate.getHours()} hinta on {data.price}c</li>
    </ul>
  )
}


const Jari = async (teksti) => {
  console.log('nappi: ', teksti)
  try {
    await triggerHourly()
  } catch (err) {
    window.alert("Sattui virhe: " + err.message)
  }
}

const Jari2 = async (teksti) => {
  console.log('nappi: ', teksti)
  try {
    await updatePrices()
  } catch (err) {
    window.alert("Sattui virhe: " + err.message)
  }
}

const RelayList = ({ relays }) => {
  const [isEditing, setIsEditing] = useState({});

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

export default MainPage
