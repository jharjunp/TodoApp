import React, { useState, useEffect } from "react";
import createRelay from "@wasp/actions/createRelay";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { Step3 } from "./Step3";

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

  const isFormComplete = () => {
    if (!type || !logic || !formData.deviceID) return false;
    if (logic === "2" && (!formData.temp_1 || !formData.temp_2)) return false;
    return true;
  };

  const steps = [
    <Step1 type={type} setType={setType} />,
    <Step2 type={type} logic={logic} setLogic={setLogic} />,
    <Step3 logic={logic} formData={formData} setFormData={setFormData} />,
    // ... other steps
  ];

  return (
    <div className="add-relay p-4 bg-white rounded shadow-lg">
      {!isFormVisible ? (
        <button
          onClick={() => {
            setIsFormVisible(true);
            setStage(1);
          }}
          className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition duration-300"
        >
          Lisää uusi rele
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {steps[stage - 1]}
          <div className="flex space-x-4">
            {isFormComplete() && (
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition duration-300"
              >
                Add Relay Entry
              </button>
            )}
            <button
              type="button"
              onClick={handleCancel}
              className="bg-red-500 text-white px-6 py-2 rounded shadow hover:bg-red-700 transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddRelay;
