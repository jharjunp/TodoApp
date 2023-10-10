import React, { useState, useEffect } from "react";
import createRelay from "@wasp/actions/createRelay";

const AddRelay = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [stage, setStage] = useState(0);
  const [type, setType] = useState("");
  const [logic, setLogic] = useState("");
  const [formData, setFormData] = useState({
    hours: 24,
    temp_1: 19,
    temp_2: 16,
    deviceID: "",
  });

  const resetForm = () => {
    setIsFormVisible(false);
    setStage(0);
    setType("");
    setLogic("");
    setFormData({
      hours: 24,
      temp_1: 19,
      temp_2: 16,
      deviceID: "",
    });
  };

  useEffect(() => {
    if (type) {
      setStage(2);
    }
    if (logic) {
      setStage(3);
    }
  }, [type, logic]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "type") {
      setType(value);
      setLogic(""); // Reset logic when type changes
    } else if (name === "logic") {
      setLogic(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.deviceID) {
      alert("deviceID is required.");
      return;
    }
    let dataToSend = {
      type: Number(type),
      logic: Number(logic),
      deviceID: formData.deviceID,
      ...formData,
    };
    if (logic === "1") {
      dataToSend.hours = Number(formData.hours);
    } else if (logic === "2") {
      dataToSend = {
        ...dataToSend,
        temp_1: Number(formData.temp_1),
        temp_2: Number(formData.temp_2),
        hours: Number(formData.hours),
      };
    }
    try {
      const response = await createRelay(dataToSend);
      console.log("New Relay entry created:", response.data);
      resetForm(); // Reset the form and state here
    } catch (error) {
      console.error("Error creating Relay entry:", error);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel?")) {
      resetForm(); // Reset the form and state here
    }
  };

  return (
    <div className="add-relay p-4 bg-white rounded shadow-lg">
      {!isFormVisible ? (
        <button 
          onClick={() => { setIsFormVisible(true); setStage(1); }} 
          className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition duration-300"
        >
          Lisää uusi rele
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {stage >= 1 && (
            <div className="flex items-center">
              <label className="w-20">Malli: </label>
              <select name="type" value={type} onChange={handleChange} className="border border-gray-300 p-2 rounded">
                <option value="" disabled>Releen malli</option>
                <option value={1}>Shelly</option>
                <option value={2}>Sensibo</option>
              </select>
            </div>
          )}
          {stage >= 2 && (
            <div className="flex items-center">
              <label className="w-20">Ohjelma: </label>
              <select name="logic" value={logic} onChange={handleChange} className="border border-gray-300 p-2 rounded">
                <option value="" disabled>Valitse ohjelma</option>
                {type === '1' && <option value={1}>On-Off</option>}
                {type === '2' && [<option key={1} value={1}>On-Off</option>, <option key={2} value={2}>High-Low</option>]}
              </select>
            </div>
          )}
          {stage >= 3 && (
            <>
              <div className="flex items-center">
                <label className="w-20">Tunnit: </label>
                <input
                  type="number"
                  name="hours"
                  min="0"
                  max="24"
                  value={formData.hours}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="flex items-center">
                <label className="w-20">deviceID: </label>
                <input
                  type="text"
                  name="deviceID"
                  value={formData.deviceID}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 p-2 rounded"
                />
              </div>
            </>
          )}
          {logic === '2' && (
            <>
              <div className="flex items-center">
                <label className="w-20">Lämpötila: </label>
                <input
                  type="number"
                  name="temp_1"
                  value={formData.temp_1}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded"
                />
              </div>
              <div className="flex items-center">
                <label className="w-20">Alennettu lämpö: </label>
                <input
                  type="number"
                  name="temp_2"
                  value={formData.temp_2}
                  onChange={handleChange}
                  className="border border-gray-300 p-2 rounded"
                />
              </div>
            </>
          )}
          {logic && (
            <div className="flex space-x-4">
              <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition duration-300">Add Relay Entry</button>
              <button type="button" onClick={handleCancel} className="bg-red-500 text-white px-6 py-2 rounded shadow hover:bg-red-700 transition duration-300">Cancel</button>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default AddRelay;
