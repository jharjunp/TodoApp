import { useState, useEffect } from 'react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import 'bootstrap/dist/css/bootstrap.min.css'

const relayManagement = ({ user }) => {

  const [key, setKey] = useState('tab1')
  

  return (
    <div className="App">
          <h1>Tabbed Content</h1>
          <Tabs
            id="controlled-tabs"
            activeKey={key}
            onSelect={(k) => setKey(k)}
          >
            <Tab eventKey="tab1" title="Tab 1">
              <div className="tab-content">
                <p>Content for Tab 1 goes here.</p>
              </div>
            </Tab>
            <Tab eventKey="tab2" title="Tab 2">
              <div className="tab-content">
                <p>Content for Tab 2 goes here.</p>
              </div>
            </Tab>
          </Tabs>
        </div>
      
  )
}

export default relayManagement