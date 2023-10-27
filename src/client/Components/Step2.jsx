// Step2.js
export const Step2 = ({ type, logic, setLogic }) => (
  <div>
    <p>Instruction for step 2: Select a program based on your relay model.</p>
    <img src="step2.png" alt="Step 2 illustration" />
    <div className="flex items-center">
      <label className="w-20">Ohjelma: </label>
      <select
        name="logic"
        value={logic}
        onChange={(e) => setLogic(e.target.value)}
        className="border border-gray-300 p-2 rounded"
      >
        <option value="" disabled>Valitse ohjelma</option>
        {type === '1' && <option value={1}>On-Off</option>}
        {type === '2' && [<option key={1} value={1}>On-Off</option>, <option key={2} value={2}>High-Low</option>]}
      </select>
    </div>
  </div>
);
