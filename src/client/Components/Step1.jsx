// Step1.js
import React, { useState } from "react";

export const Step1 = ({ type, setType }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      {!isModalOpen && (
        <button
          type="button"
          className="bg-blue-500 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition duration-300"
          onClick={() => setIsModalOpen(true)}
        >
          Info
        </button>
      )}
      {isModalOpen && (
        <div className="p-4 bg-white rounded shadow-lg text-black">
          <button
            onClick={() => setIsModalOpen(false)}
            className="bg-red-500 text-white px-6 py-2 rounded shadow hover:bg-red-700 transition duration-300"
          >
            Sulje
          </button>
          <div className="text-xl font-bold mb-2">Tuetut Rele Mallit</div>
          <div className="md:grid grid-cols-2 gap-4 flex flex-col">
            <div className="bg-gray-50 p-4 rounded shadow mb-4 md:mb-0">
              <div className="text-lg font-semibold mb-2">Shelly</div>
              <p className="mb-2">
                Tällä hetkellä ReiluRele tukee kahden valmistajan releitä,
                Shelly ja Sensibo. Shellyltä tuetaan kaikkia on/off tyyppisiä
                releitä, esimerkiksi Shelly Plus 1 PM ja Shelly EM3. Shelly
                soveltuu ohjaamaan mitä hyvänsä kuormaa, jolle riittää tilat
                päällä ja pois. Näitä kuormia on mm. lämminvesivaraaja,
                lattialämmitys, yms.
              </p>
              <a
                href="https://www.shelly.com/en-fi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Lue lisää Shellystä
              </a>
            </div>
            <div className="bg-gray-50 p-4 rounded shadow">
              <div className="text-lg font-semibold mb-2">Sensibo</div>
              <p className="mb-2">
                Sensibo on verkon yli ohjattava IR-kaukosäädin. ReiluReleellä
                voidaan Shellyn avulla ohjata mitä hyvänsä Shellyn tukemaa
                lämmityslaitetta, kuten useimpia ilmalämpöpumppuja. Jos
                ilmalämpöpumppua ohjattaisiin Shellyllä laite saattaisi
                pakkasella rikkoutua virtojen yllättäen katketessa. Sensibolla
                voidaan päivän kalleimmiksi tunneiksi asettaa pienempi
                pyyntilämpötila, tai kytkeä laite hallitusti pois päältä.
              </p>
              <a
                href="https://sensibo.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                Lue lisää Sensibosta
              </a>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center">
        <label className="w-20">Malli: </label>
        <select
          name="type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-gray-300 p-2 rounded"
        >
          <option value="" disabled>
            Releen malli
          </option>
          <option value={1}>Shelly</option>
          <option value={2}>Sensibo</option>
        </select>
      </div>
    </div>
  );
};
