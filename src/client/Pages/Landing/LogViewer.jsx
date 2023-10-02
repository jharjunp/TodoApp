import { useState, useEffect } from 'react'
import { Transition } from 'react-transition-group'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import 'bootstrap/dist/css/bootstrap.min.css'
import './logViewer.css'
import './LogEntry.css'

const LogViewer = ({ relays, logs }) => {

  // Assuming logs contain log entries for the past two weeks.
  const twoWeeksAgo = new Date()
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14)

  return (
    <div className="App">
      <h1>Releittesi lokit</h1>
      {relays && logs && <RenderTabs relays={relays} logs={logs} />}
    </div>
  )
}

const RenderTabs = ({ relays, logs }) => {
  const [openRelays, setOpenRelays] = useState({});
  const [key, setKey] = useState('tab1');

  const toggleRelay = (relayId) => {
    setOpenRelays((prev) => ({
      ...prev,
      [relayId]: !prev[relayId],
    }));
  };

  const duration = 1000;  // Duration of transition in milliseconds

  const defaultStyle = {
    transition: `max-height ${duration}ms ease-in-out`,
    maxHeight: 0,
    overflow: 'hidden',
  };

  const transitionStyles = {
    entering: { maxHeight: 2000 },
    entered:  { maxHeight: 'auto' },
    exiting:  { maxHeight: 0 },
    exited:   { maxHeight: 0 },
  };

  return (
    <div className="App">
      <Tabs id="controlled-tabs" activeKey={key} onSelect={(k) => setKey(k)}>
        {relays.map((relay) => {
          const relayLogs = logs.filter((log) => log.relayId === relay.id);
          relayLogs.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
          return (
            <Tab
              key={relay.id}
              eventKey={`tab${relay.id}`}
              title={
                <span onClick={() => toggleRelay(relay.id)}>
                  {openRelays[relay.id] ? '-' : '+'} {relay.description}
                </span>
              }
            >
              <Transition in={openRelays[relay.id]} timeout={duration}>
                {state => (
                  <div style={{
                    ...defaultStyle,
                    ...transitionStyles[state]
                  }} className="tab-content">
                    {relayLogs.map((log, index) => (
                      <div key={index} className="log-entry">
                        <h4>{log.timeStamp.toLocaleString()}</h4>
                        <LogTree data={log.logEntry} />
                      </div>
                    ))}
                  </div>
                )}
              </Transition>
            </Tab>
          );
        })}
      </Tabs>
    </div>
  );
};


const LogTree = ({ data, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const renderNode = (key, value) => {
    if (typeof value === 'object' && value !== null) {
      return (
        <div key={key} className={`tree-node level-${level}`}>
          <span onClick={toggleOpen} className="toggle-icon" style={{ color: 'DarkBlue' }}>
            {isOpen ? '-' : '+'}
          </span>
          <span className="node-key" style={{ color: 'DarkBlue' }}>{key}:</span>
          {isOpen && <LogTree data={value} level={level + 1} />}
        </div>
      );
    } else {
      let color;
      if (typeof value === 'string') color = 'DarkCyan';
      else if (typeof value === 'number') color = 'RoyalBlue';
      else if (typeof value === 'boolean' || value === null) color = 'DarkSlateBlue';
      else color = 'DarkTurquoise';

      return (
        <div key={key} className={`tree-leaf level-${level}`}>
          <span className="leaf-key" style={{ color: 'DarkBlue' }}>
            {key}:
          </span>
          <span style={{ color }}>
            {value}
          </span>
        </div>
      );
    }
  };

  return (
    <div className="log-tree">
      {data && typeof data === 'object' && Object.entries(data).map(([key, value]) => renderNode(key, value))}
    </div>
  );
};


export default LogViewer