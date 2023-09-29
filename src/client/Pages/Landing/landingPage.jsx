import React, { useState } from 'react'
import { useQuery } from '@wasp/queries'
import useAuth from '@wasp/auth/useAuth'
//import { Helmet } from 'react-helmet'
import Header from './header.jsx'
import Footer from './footer.jsx'
import Steps from './steps.jsx'
import Mission from './mission.jsx'
import Chart from './chart.jsx'
import getTodaysPrices from '@wasp/queries/getTodaysPrices'
import './style.css'
import './home.css'

const Home = (args) => {

  const { data: user } = useAuth()
  const { data: todaysPrices, boolean: todaysPricesLoading, error: error3 } = useQuery(getTodaysPrices)
  //console.log(todaysPrices)

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
        <div className="home-gallery-card">
          <div className="App">
            {todaysPrices && <Chart dataset={todaysPrices} />}
          </div>
          {!todaysPrices && <img
            alt="image"
            src="https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?ixid=Mnw5MTMyMXwwfDF8c2VhcmNofDEyfHxmb3Jlc3R8ZW58MHx8fHwxNjI2MjUxMjg4&amp;ixlib=rb-1.2.1&amp;h=1200"
            className="home-image1"
          />}
          <h2 className="home-text54">Project Title</h2>
          <span className="home-text55">Lorem ipsum dolor sit amet</span>
        </div>
      </div>
      <Footer />
    </div>
  )
}


export default Home
