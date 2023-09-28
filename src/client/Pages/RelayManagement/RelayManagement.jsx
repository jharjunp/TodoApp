import { useState, useEffect } from 'react'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import 'bootstrap/dist/css/bootstrap.min.css'
import './RelayManagement.css'
import './LogEntry.css'
import { useQuery } from '@wasp/queries'
import getRelays from '@wasp/queries/getRelays'
import getLogs from '@wasp/queries/getLogs'

const RelayManagement = ({ user }) => {

  
  const { data: relays, boolean: relaysLoading, error: error1 } = useQuery(getRelays)
  const { data: logs, boolean: logsLoading, error: logsError } = useQuery(getLogs)

  // Assuming logs contain log entries for the past two weeks.
  const twoWeeksAgo = new Date()
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

  return (
    <div className="App">
      <h1>Your Relays</h1>
      {relays && logs && <RenderTabs relays={relays} logs={logs} />}
      {relaysLoading && 'Loading...'}
      {logsError && 'Error: ' + logsError}
    </div>
  )
}

const RenderTabs = ({ relays, logs }) => {
  const [key, setKey] = useState('tab1');

  return (
    <div className="App">
      <Tabs id="controlled-tabs" activeKey={key} onSelect={(k) => setKey(k)}>
        {relays.map((relay) => {
          // Filter logs for the current relay
          const relayLogs = logs.filter((log) => log.relayId === relay.id);

          return (
            <Tab key={relay.id} eventKey={`tab${relay.id}`} title={relay.description}>
              <div className="tab-content">
                {relayLogs.map((log, index) => (
                  <div key={index} className="log-entry">
                    <h4>{log.timeStamp.toLocaleString()}</h4>
                    <LogTree data={log.logEntry} />
                  </div>
                ))}
              </div>
            </Tab>
          );
        })}
      </Tabs>
    </div>
  );
}

const LogTree = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const renderNode = (key, value) => {
    if (typeof value === 'object') {
      return (
        <div key={key}>
          <span onClick={toggleOpen} className="tree-node">
            {isOpen ? '-' : '+'}
          </span>
          <span>{key}:</span>
          {isOpen && <LogTree data={value} />}
        </div>
      );
    } else {
      return (
        <div key={key}>
          <span className="tree-leaf">
            {key}: {value}
          </span>
        </div>
      );
    }
  };

  return (
    <div className="log-tree">
      {Object.entries(data).map(([key, value]) => renderNode(key, value))}
    </div>
  );
}

export default RelayManagement