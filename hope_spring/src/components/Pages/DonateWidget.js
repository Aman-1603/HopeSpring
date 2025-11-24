// src/pages/DonateWidget.jsx
import React, { useState } from "react";
import axios from "axios";

const DonateWidget = () => {
  const fixedAmounts = [35, 50, 75, 100, 250];
  const [selected, setSelected] = useState(null);
  const [customAmount, setCustomAmount] = useState("");

  const startDonation = async () => {
    const amount =
      selected === "Other" ? Number(customAmount) : Number(selected);

    if (!amount || amount <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    try {
      const res = await axios.post("/api/donate/create-session", {
        amount: Math.round(amount * 100), // Stripe uses cents
        category: "General Support",
      });

      // Redirect to Stripe Checkout
      window.location.href = res.data.url;
    } catch (err) {
      console.error("❌ Unable to start donation:", err);
      alert("Unable to start donation. Please try again.");
    }
  };

  return (
    <div className="border rounded-xl p-4">
      <p className="font-semibold text-[#0b1c33]">Donate securely</p>
      <p className="text-sm text-gray-600">
        Choose an amount or enter your custom donation.
      </p>

      {/* Fixed Amount Buttons */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {fixedAmounts.map((amt) => (
          <button
            key={amt}
            onClick={() => {
              setSelected(amt);
              setCustomAmount("");
            }}
            className={`h-10 rounded-lg border font-semibold ${
              selected === amt
                ? "bg-[#0b1c33] text-white"
                : "bg-white text-[#0b1c33] hover:bg-gray-50"
            }`}
          >
            ${amt}
          </button>
        ))}

        {/* Other Button */}
        <button
          onClick={() => setSelected("Other")}
          className={`h-10 rounded-lg border font-semibold ${
            selected === "Other"
              ? "bg-[#0b1c33] text-white"
              : "bg-white text-[#0b1c33] hover:bg-gray-50"
          }`}
        >
          Other
        </button>
      </div>

      {/* Custom Amount Input */}
      {selected === "Other" && (
        <input
          type="number"
          min="1"
          placeholder="Enter custom amount"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          className="mt-3 w-full h-11 rounded-lg border px-3 text-[#0b1c33] focus:ring-[#0b1c33] outline-none"
        />
      )}

      {/* Donate Button */}
      <button
        onClick={startDonation}
        className="mt-4 w-full h-11 rounded-lg bg-[#0e2340] text-white font-semibold hover:brightness-110"
      >
        Donate
      </button>
    </div>
  );
};

export default DonateWidget;
