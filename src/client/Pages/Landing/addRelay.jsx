import React, { useState, useEffect } from 'react';
import createRelay from '@wasp/actions/createRelay';

const AddRelay = () => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [stage, setStage] = useState(0);
  const [type, setType] = useState('');
  const [logic, setLogic] = useState('');
  const [formData, setFormData] = useState({
    hours: 24,
    temp_1: 19,
    temp_2: 16,
    deviceID: ''
  });

  const resetForm = () => {
    setIsFormVisible(false);
    setStage(0);
    setType('');
    setLogic('');
    setFormData({
      hours: 24,
      temp_1: 19,
      temp_2: 16,
      deviceID: ''
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
    if (name === 'type') {
      setType(value);
      setLogic('');  // Reset logic when type changes
    } else if (name === 'logic') {
      setLogic(value);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.deviceID) {
      alert('deviceID is required.');
      return;
    }
    let dataToSend = {
      type: Number(type),
      logic: Number(logic),
      deviceID: formData.deviceID,
      ...formData
    };
    if (logic === '1') {
      dataToSend.hours = Number(formData.hours);
    } else if (logic === '2') {
      dataToSend = {
        ...dataToSend,
        temp_1: Number(formData.temp_1),
        temp_2: Number(formData.temp_2)
      };
    }
    try {
      const response = await createRelay(dataToSend);
      console.log('New Relay entry created:', response.data);
      resetForm();  // Reset the form and state here
    } catch (error) {
      console.error('Error creating Relay entry:', error);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel?")) {
      resetForm();  // Reset the form and state here
    }
  };

  return (
    <div className="add-relay">
      {!isFormVisible ? (
        <button onClick={() => { setIsFormVisible(true); setStage(1); }}>Lisää uusi rele</button>
      ) : (
        <form onSubmit={handleSubmit}>
          {stage >= 1 && (
            <div>
              <label>Type: </label>
              <select name="type" value={type} onChange={handleChange}>
                <option value="" disabled>Select type</option>
                <option value={1}>Shelly</option>
                <option value={2}>Sensibo</option>
              </select>
            </div>
          )}
          {stage >= 2 && (
            <div>
              <label>Logic: </label>
              <select name="logic" value={logic} onChange={handleChange}>
                <option value="" disabled>Select logic</option>
                {type === '1' && <option value={1}>1</option>}
                {type === '2' && [<option key={1} value={1}>1</option>, <option key={2} value={2}>2</option>]}
              </select>
            </div>
          )}
          {stage >= 3 && (
            <>
              <div>
                <label>Hours: </label>
                <input
                  type="number"
                  name="hours"
                  min="0"
                  max="24"
                  value={formData.hours}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>deviceID: </label>
                <input
                  type="text"
                  name="deviceID"
                  value={formData.deviceID}
                  onChange={handleChange}
                  required  // This attribute ensures that the field is filled before form submission
                />
              </div>
            </>
          )}
          {logic === '2' && (
            <>
              <div>
                <label>Temp 1: </label>
                <input
                  type="number"
                  name="temp_1"
                  value={formData.temp_1}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Temp 2: </label>
                <input
                  type="number"
                  name="temp_2"
                  value={formData.temp_2}
                  onChange={handleChange}
                />
              </div>
            </>
          )}
          {logic && (
            <div>
              <button type="submit">Add Relay Entry</button>
              <button type="button" onClick={handleCancel}>Cancel</button>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default AddRelay;
