import { useState, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import "bootstrap/dist/css/bootstrap.min.css";
import "../CSS/logViewer.css";
import "../CSS/LogEntry.css";

const LogViewer = ({ relays, logs }) => {
  // Assuming logs contain log entries for the past two weeks.
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  return (
    <div className="App">
      <h1 className="home-text14">Releittesi lokit</h1>
      {relays && logs && <RenderTabs relays={relays} logs={logs} />}
    </div>
  );
};

const RenderTabs = ({ relays, logs }) => {
  const [activeKey, setActiveKey] = useState("tab1"); // New state to manage the active tab
  const [openRelays, setOpenRelays] = useState({}); // Separate state to manage open/closed state of tabs
  const nodeRef = useRef(null);

  const handleTabSelect = (selectedKey) => {
    const relayId = selectedKey.replace("tab", "");
    setActiveKey((prevKey) => {
      if (prevKey === selectedKey) {
        // If the tab is already active, toggle its open/closed state
        setOpenRelays((prevOpenRelays) => {
          const newOpenRelays = {
            ...prevOpenRelays,
            [relayId]: !prevOpenRelays[relayId],
          };
          return newOpenRelays;
        });
        return null; // Return null to indicate no change in the active tab
      } else {
        // If a different tab is selected, close all tabs and open the selected tab
        const newOpenRelays = {};
        for (let key in openRelays) {
          newOpenRelays[key] = false;
        }
        newOpenRelays[relayId] = true;
        setOpenRelays(newOpenRelays);
        return selectedKey; // Return the selectedKey to update the active tab
      }
    });
  };

  const duration = 1000; // Duration of transition in milliseconds

  return (
    <div className="logTabs">
      <Tabs
        id="controlled-tabs"
        className="myTabs"
        activeKey={activeKey}
        onSelect={handleTabSelect}
      >
        {relays.map((relay) => {
          const relayLogs = logs.filter((log) => log.relayId === relay.id);
          relayLogs.sort(
            (a, b) => new Date(b.timeStamp) - new Date(a.timeStamp)
          );
          const nodeRef = useRef(null); // Moved inside the map function

          return (
            <Tab
              key={relay.id}
              eventKey={`tab${relay.id}`}
              title={
                <span>
                  {openRelays[relay.id] ? "-" : "+"} {relay.description}
                </span>
              }
            >
              <CSSTransition
                in={openRelays[relay.id]}
                timeout={duration}
                classNames="tab-content-transition"
                nodeRef={nodeRef} // Ensure nodeRef is passed here
                unmountOnExit
              >
                <div ref={nodeRef} className="tab-content">
                  {relayLogs.map((log, index) => (
                    <div key={index} className="log-entry">
                      <h4>{log.timeStamp.toLocaleString()}</h4>
                      <LogTree data={log.logEntry} />
                    </div>
                  ))}
                </div>
              </CSSTransition>
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
    if (typeof value === "object" && value !== null) {
      return (
        <div key={key} className={`tree-node level-${level}`}>
          <span
            onClick={toggleOpen}
            className="toggle-icon"
            style={{ color: "DarkBlue" }}
          >
            {isOpen ? "-" : "+"}
          </span>
          <span className="node-key" style={{ color: "DarkBlue" }}>
            {key}:
          </span>
          {isOpen && <LogTree data={value} level={level + 1} />}
        </div>
      );
    } else {
      let color;
      if (typeof value === "string") color = "DarkCyan";
      else if (typeof value === "number") color = "RoyalBlue";
      else if (typeof value === "boolean" || value === null)
        color = "DarkSlateBlue";
      else color = "DarkTurquoise";

      return (
        <div key={key} className={`tree-leaf level-${level}`}>
          <span className="leaf-key" style={{ color: "DarkBlue" }}>
            {key}:
          </span>
          <span style={{ color }}>{value}</span>
        </div>
      );
    }
  };

  return (
    <div className="log-tree">
      {data &&
        typeof data === "object" &&
        Object.entries(data).map(([key, value]) => renderNode(key, value))}
    </div>
  );
};

export default LogViewer;
