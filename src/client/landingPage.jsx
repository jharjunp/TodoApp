import React from 'react'
import { useQuery } from '@wasp/queries'
import useAuth from '@wasp/auth/useAuth'
//import { Helmet } from 'react-helmet'
import Header from './Components/header.jsx'
import Footer from './Components/footer.jsx'
import Steps from './Components/steps.jsx'
import Mission from './Components/mission.jsx'
import Chart from './Components/chart.jsx'
import ShowImage from './Components/showImage.jsx'
import RelayList from "./Components/RelayList.jsx"
import LogViewer from "./Components/LogViewer.jsx"
import AddRelay from './Components/addRelay.jsx'
import getLogs from '@wasp/queries/getLogs'
import getTodaysPrices from '@wasp/queries/getTodaysPrices'
import getLatestOutcomesPerRelay from '@wasp/queries/getLatestOutcomesPerRelay'
import getRelays from '@wasp/queries/getRelays'
import './Main.css'
import './CSS/style.css'
import './CSS/home.css'

const Home = (args) => {

  const { data: user } = useAuth()
  const { data: todaysPrices, boolean: todaysPricesLoading, error: error3 } = useQuery(getTodaysPrices, ({ offset: 0}))
  const { data: tomorrowsPrices, boolean: tomorrowsPricesLoading, error: error4 } = useQuery(getTodaysPrices, ({ offset: 1}))

  const { data: lastLogs, boolean: logsLoading, error: logsError } = useQuery(getLatestOutcomesPerRelay, { enabled: !!user })
  const { data: relays, boolean: relaysLoading, error: error1 } = useQuery(getRelays, { enabled: !!user })
  const { data: allLogs, boolean: allLogsLoading, error: allLogsError } = useQuery(getLogs, { enabled: !!user })

  const isSufficientDataForTomorrow = React.useMemo(() => {
    if (!tomorrowsPrices) return false;

    const dateSet = new Set();
    tomorrowsPrices.forEach(item => {
      const date = new Date(item.timeStamp);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
      dateSet.add(key);
    });

    return dateSet.size >= 12;
  }, [tomorrowsPrices]);

  return (
    <div className="home-container">
      {/* <Helmet>
        <title>kWh</title>
        <meta property="og:title" content="Crafty Heavy Echidna" />
      </Helmet> */}
      <div className="home-container1">
        <Header />
      </div>
      <div className="home-banner">
        <Mission />
        <h2>Hinnat tänään</h2>
        {todaysPrices && <Chart dataset={todaysPrices} />}
        {isSufficientDataForTomorrow && <h2>Hinnat huomenna</h2>}
        {isSufficientDataForTomorrow && <Chart dataset={tomorrowsPrices}/>}
        <Steps />
        {!user && <ShowImage />}
        {user && relays && <RelayList relays={relays} logs={lastLogs}/>}
        {user && <LogViewer relays={relays} logs={allLogs}/>}
      </div>
      <Footer />
    </div>
  )
}


export default Home


