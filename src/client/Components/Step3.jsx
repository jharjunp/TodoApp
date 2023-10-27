// Step3.js
export const Step3 = ({ logic, formData, setFormData }) => (
  <div>
    <p>Instruction for step 3: Specify the hours and device ID.</p>
    <img src="step3.png" alt="Step 3 illustration" />
    <div className="flex items-center">
      <label className="w-20">Tunnit: </label>
      <input
        type="number"
        name="hours"
        min="0"
        max="24"
        value={formData.hours}
        onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
        className="border border-gray-300 p-2 rounded"
      />
    </div>
    <div className="flex items-center">
      <label className="w-20">deviceID: </label>
      <input
        type="text"
        name="deviceID"
        value={formData.deviceID}
        onChange={(e) => setFormData({ ...formData, deviceID: e.target.value })}
        required
        className="border border-gray-300 p-2 rounded"
      />
    </div>
    {logic === '2' && (
      <>
        <div className="flex items-center">
          <label className="w-20">Lämpötila: </label>
          <input
            type="number"
            name="temp_1"
            value={formData.temp_1}
            onChange={(e) => setFormData({ ...formData, temp_1: e.target.value })}
            className="border border-gray-300 p-2 rounded"
          />
        </div>
        <div className="flex items-center">
          <label className="w-20">Alennettu lämpö: </label>
          <input
            type="number"
            name="temp_2"
            value={formData.temp_2}
            onChange={(e) => setFormData({ ...formData, temp_2: e.target.value })}
            className="border border-gray-300 p-2 rounded"
          />
        </div>
      </>
    )}
  </div>
);
