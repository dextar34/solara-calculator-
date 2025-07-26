import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const applianceData = [
  { name: "Light", watt: 10 },
  { name: "Fan", watt: 60 },
  { name: "TV", watt: 100 },
  { name: "Fridge", watt: 200 },
  { name: "Computer", watt: 150 },
  { name: "Cooker", watt: 1000 },
  { name: "0.5 HP pump", watt: 373 },
  { name: "1 HP pump", watt: 746 },
  { name: "1.5 HP pump", watt: 1119 },
];

const HybridSolarCalculator = () => {
  const [quantities, setQuantities] = useState(Array(applianceData.length).fill(0));
  const [backupHours, setBackupHours] = useState(2);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (index, value) => {
    const updated = [...quantities];
    updated[index] = parseInt(value) || 0;
    setQuantities(updated);
  };

  const calculate = () => {
    const totalInput = quantities.reduce((sum, qty) => sum + qty, 0);
    if (totalInput === 0) {
      setError("Please enter at least one appliance quantity before calculating.");
      setResults(null);
      return;
    }

    setError("");

    const totalLoad = quantities.reduce((sum, qty, i) => sum + qty * applianceData[i].watt, 0);
    const dailyConsumption = totalLoad * backupHours;
    const inverterSize = (totalLoad * 1.25) / 1000;
    const panelSize = dailyConsumption / (5 * 0.8);
    const batteryCapacity = (dailyConsumption / 1000) / 0.8;

    setResults({
      totalLoad,
      dailyConsumption,
      inverterSize,
      panelSize,
      batteryCapacity,
    });
  };

  // Custom function to format date as 26-Jul-2025
  const formatDate = (date) => {
    const day = date.getDate();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const generatePDF = () => {
    if (!results) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Solara Energy Ltd – Hybrid Solar System Quotation", 14, 20);
    doc.setFontSize(10);
    doc.text(`Date: ${formatDate(new Date())}`, 14, 28);

    autoTable(doc, {
      startY: 35,
      head: [["SL", "Item", "Quantity (pcs)"]],
      body: applianceData.map((item, i) => [i + 1, item.name, quantities[i]]),
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["System Details", "Value"]],
      body: [
        ["Backup Hours", `${backupHours} hours`],
        ["Total Load", `${results.totalLoad.toFixed(2)} W`],
        ["Total Daily Consumption", `${results.dailyConsumption.toFixed(2)} Wh`],
      ],
    });

    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Recommended System Sizing", "Value"]],
      body: [
        ["Inverter Size", `${results.inverterSize.toFixed(2)} kW`],
        ["Solar Panel Size", `${results.panelSize.toFixed(2)} W`],
        ["Battery Capacity", `${results.batteryCapacity.toFixed(2)} kWh`],
      ],
    });

    doc.setFontSize(9);
    doc.text(
      "Disclaimer: This is an estimated calculation. Actual system requirements may vary.",
      14,
      doc.lastAutoTable.finalY + 10
    );

    doc.setFontSize(10);
    doc.text(
      "Regards\nSolara Energy Ltd\ninfo@solaraenergyltd.com\n+8801603-528085\nDhaka, Bangladesh",
      14,
      doc.lastAutoTable.finalY + 20
    );

    doc.save("Solara_Energy_Ltd_quotation.pdf");
//     // Redirect after saving the PDF
//   window.location.href = "https://www.solaraenergyltd.com";
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-gray-800">
      <h1 className="text-2xl sm:text-3xl font-bold text-center text-green-700 mb-6">
        ☀️ Hybrid Solar Home System Calculator
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow">
        {applianceData.map((item, i) => (
          <div key={i} className="flex flex-col">
            <label className="font-medium mb-1">{item.name}</label>
            <input
              type="number"
              min="0"
              value={quantities[i]}
              onChange={(e) => handleChange(i, e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        ))}

        <div className="sm:col-span-2 flex flex-col mt-2">
          <label className="font-medium mb-1">Backup Hours</label>
          <input
            type="number"
            min="1"
            value={backupHours}
            onChange={(e) => setBackupHours(parseInt(e.target.value) || 1)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 text-red-600 font-medium text-center">{error}</div>
      )}

      <div className="text-center mt-6">
        <button
          onClick={calculate}
          className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded transition"
        >
          Calculate
        </button>
      </div>

      {results && (
        <div className="mt-8 bg-green-50 border border-green-200 p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-green-800 mb-4">
            📊 Calculation Results
          </h2>
          <div className="space-y-2 text-gray-700">
            <p>Total Load: <strong>{results.totalLoad.toFixed(2)} W</strong></p>
            <p>Daily Consumption: <strong>{results.dailyConsumption.toFixed(2)} Wh</strong></p>
            <p>Inverter Size: <strong>{results.inverterSize.toFixed(2)} kW</strong></p>
            <p>Solar Panel Size: <strong>{results.panelSize.toFixed(2)} W</strong></p>
            <p>Battery Capacity: <strong>{results.batteryCapacity.toFixed(2)} kWh</strong></p>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={generatePDF}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded transition"
            >
              Download Quotation PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HybridSolarCalculator;
