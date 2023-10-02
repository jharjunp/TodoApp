import React, { useState } from 'react'
import { useQuery } from '@wasp/queries'
import useAuth from '@wasp/auth/useAuth'
//import { Helmet } from 'react-helmet'
import Header from './header.jsx'
import Footer from './footer.jsx'
import Steps from './steps.jsx'
import Mission from './mission.jsx'
import Chart from './chart.jsx'
import ShowImage from './showImage.jsx'
import RelayList from "./RelayList.jsx"
import LogViewer from "./LogViewer.jsx"
import getLogs from '@wasp/queries/getLogs'
import AddRelay from "./addRelay.jsx"
import getTodaysPrices from '@wasp/queries/getTodaysPrices'
import getLatestOutcomesPerRelay from '@wasp/queries/getLatestOutcomesPerRelay'
import getRelays from '@wasp/queries/getRelays'
import './style.css'
import './home.css'

const Home = (args) => {

  const { data: user } = useAuth()
  const { data: todaysPrices, boolean: todaysPricesLoading, error: error3 } = useQuery(getTodaysPrices)
  const { data: lastLogs, boolean: logsLoading, error: logsError } = useQuery(getLatestOutcomesPerRelay)
  const { data: relays, boolean: relaysLoading, error: error1 } = useQuery(getRelays)
  const { data: allLogs, boolean: allLogsLoading, error: allLogsError } = useQuery(getLogs)

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
        {todaysPrices && <Chart dataset={todaysPrices}  />}
        <Steps />
        {!user && <ShowImage />}
        {user && <RelayList relays={relays} logs={lastLogs}  />}
        {user && <LogViewer relays={relays} logs={allLogs}  />}
      </div>
      <Footer />
    </div>
  )
}


export default Home


