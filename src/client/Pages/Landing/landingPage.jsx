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
import getTodaysPrices from '@wasp/queries/getTodaysPrices'
import getLatestOutcomesPerRelay from '@wasp/queries/getLatestOutcomesPerRelay'
import getRelays from '@wasp/queries/getRelays'
import './style.css'
import './home.css'

const Home = (args) => {

  const { data: user } = useAuth()
  const { data: todaysPrices, boolean: todaysPricesLoading, error: error3 } = useQuery(getTodaysPrices)
  const { data: logs, boolean: logsLoading, error: logsError } = useQuery(getLatestOutcomesPerRelay)
  const { data: relays, boolean: relaysLoading, error: error1 } = useQuery(getRelays)

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
        <Steps />
        {!user && <ShowImage />}
        {user && <RelayList relays={relays} logs={logs}  />}
      </div>
      <Footer />
    </div>
  )
}


export default Home


