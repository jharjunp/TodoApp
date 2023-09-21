import getTasks from '@wasp/queries/getTasks'
import getXCheapestHours from '@wasp/queries/getXCheapestHours'
//import createTask from '@wasp/actions/createTask'
//import updateTask from '@wasp/actions/updateTask'
import sensiboPost from '@wasp/actions/sensiboPost'
import { useQuery } from '@wasp/queries'
import logout from '@wasp/auth/logout'
import Chart from "./chart.jsx"
import updatePrices from '@wasp/actions/updatePrices'
import getRelays from '@wasp/queries/getRelays'
import React, { useState, useEffect } from 'react'
import './MainPage.css'
import AddRelay from "./AddRelay.jsx"

const MainPage = ({ user }) => {

  const { data: hinnat, boolean: hinnatLoading, error: error2 } = useQuery(getXCheapestHours, {
    hours: 24,
  })
  const { data: relays, boolean: relaysLoading, error: error1 } = useQuery(getRelays, {
    logic: 2
  })
  

  return (
    <div>
      <div className="App">
      <h1>Relay Entry Management</h1>
      <AddRelay />
    </div>


      <div>
        {relays && <RelayList relays={relays} />}
        {relaysLoading && 'Loading...'}
        {error1 && 'Error: ' + error1}
      </div>

      <button onClick={logout}>Logout</button>
      <button onClick={() => Jari( "sensiboPost" )}>sensiboPost</button>
      <button onClick={() => Jari2( "updatePrices" )}>updatePrices</button>
      <div className="App">
        {hinnat && <Chart dataset={hinnat} />}
      </div>
      <div>
        {hinnat && <HintaLista hinnat={hinnat} />}
        {hinnatLoading && 'Loading...'}
        {error2 && 'Error: ' + error2}
      </div>
    </div>
  )
}

const HintaLista = ({ hinnat }) => {
//  console.log(hinnat)
  if (!hinnat?.length) return <div>Ei hintoja</div>
  return (
    <div>
      <h2>Päivän hinnat</h2>
      {hinnat.map((hinta, idx) => <Hinta key={idx} {...hinta} /> )}
    </div>
  )
}

const Hinta = ({ idx, price, startDate, endDate }) => {
  const sDate = new Date(startDate)
  return (
    <ul>
      <li key={idx}>{sDate.getDate()}.{sDate.getMonth() + 1} klo {sDate.getHours()} hinta on {price}c</li>
    </ul>
  )
}


const Jari = async (teksti) => {
  console.log('nappi: ', teksti)
  try {
    await sensiboPost()
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


const Task = ({ task }) => {
  const handleIsDoneChange = async (event) => {
    //console.log('task: ', task)
    try {
      await updateTask({
        id: task.id,
        isDone: event.target.checked,
      })
    } catch (err) {
      window.alert("Error while updating task: " + err.message)
    }
  }

  return (
    <div>
      <input
        type="checkbox"
        id={String(task.id)}
        checked={task.isDone}
        onChange={handleIsDoneChange}
      />
      {task.description}
    </div>
  )
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



const NewTaskForm = () => {
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const target = event.target
      const description = target.description.value
      target.reset()
      await createTask({ description })
    } catch (err) {
      window.alert('Error: ' + err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="description" type="text" defaultValue="" />
      <input type="submit" value="Create task" />
    </form>
  )
}

export default MainPage
