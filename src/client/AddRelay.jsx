import React, { useState } from 'react'
import axios from 'axios'
import createRelay from '@wasp/actions/createRelay'

const AddRelay = () => {
  const [formData, setFormData] = useState({
    logic: 1,
    description: '',
    hours: 24,
    temp_1: 19,
    temp_2: 16,
    price_1: 3.0,
    price_2: 10.0,
    isOn: false,
    SetOn: false,
    deviceID: 'kokko',
    apiKey: 'kokko',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to your API endpoint for creating Relay entries
      const response = await createRelay(formData);

      // Handle success (e.g., show a success message, reset the form)
      console.log('New Relay entry created:', response.data);

      // Reset the form
      setFormData({
        logic: 1,
        description: '',
        hours: 24,
        temp_1: 19,
        temp_2: 16,
        price_1: 3.0,
        price_2: 10.0,
        isOn: false,
        SetOn: false,
        deviceID: 'kokko',
        apiKey: 'kokko',
      });
    } catch (error) {
      // Handle errors (e.g., display an error message)
      console.error('Error creating Relay entry:', error);
    }
  };

  return (
    <div className="add-relay">
      <h2>Add New Relay Entry</h2>
      <form onSubmit={handleSubmit}>
        <div>
        <table>
          <thead>
            <tr>
              <th>Logiikka</th>
              <th>Kuvaus</th>
              <th>Tuntia</th>
              <th>Normaali lämpö</th>
              <th>Alennettu lämpö</th>
              <th>devideID</th>
              <th>apiKey</th>
            </tr>
          </thead>
          <tbody>
              <tr key={1}>
                <td><input type="number" id="Logiikka" name="logic" value={formData.logic} onChange={handleChange} /></td>
                <td><input type="text" id="Kuvaus" name="description" value={formData.description} onChange={handleChange} /></td>
                <td><input type="number" id="Tuntia" name="hours" value={formData.hours} onChange={handleChange} /></td>
                <td><input type="number" id="Normaali lämpö" name="temp_1" value={formData.temp_1} onChange={handleChange} /></td>
                <td><input type="number" id="Alennettu lämpö" name="temp_2" value={formData.temp_2} onChange={handleChange} /></td>
                <td><input type="text" id="deviceID" name="deviceID" value={formData.deviceID} onChange={handleChange} /></td>
                <td><input type="text" id="apiKey" name="apiKey" value={formData.apiKey} onChange={handleChange} /></td>
              </tr>
          </tbody>
        </table>
        </div>
        <div>
          <button type="submit">Add Relay Entry</button>
        </div>
      </form>
    </div>
  );
};

export default AddRelay;