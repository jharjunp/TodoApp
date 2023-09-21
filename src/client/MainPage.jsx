import getTasks from '@wasp/queries/getTasks'
import getXCheapestHours from '@wasp/queries/getXCheapestHours'
import createTask from '@wasp/actions/createTask'
import updateTask from '@wasp/actions/updateTask'
import sensiboPost from '@wasp/actions/sensiboPost'
import { useQuery } from '@wasp/queries'
import logout from '@wasp/auth/logout'
import Chart from "./chart.jsx";

const MainPage = ({ user }) => {

  const { data: hinnat, boolean: hinnatLoading, error: error2 } = useQuery(getXCheapestHours, {
    hours: 24,
  })
  const { data: tasks, boolean: tasksLoading, error: error1 } = useQuery(getTasks)

  return (
    <div>
      
        <NewTaskForm />

      <div>
        {tasks && <TasksList tasks={tasks} />}
        {tasksLoading && 'Loading...'}
        {error1 && 'Error: ' + error1}
      </div>

      <button onClick={logout}>Logout</button>
      <button onClick={() => Jari( "sensiboPost" )}>sensiboPost</button>
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

const TasksList = ({ tasks }) => {
  if (!tasks?.length) return <div>No tasks</div>

  return (
    <div>
      {tasks.map((task, idx) => (
        <Task task={task} key={idx} />
      ))}
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
