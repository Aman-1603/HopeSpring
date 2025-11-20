import React, { useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import CalendarPicker from "../CalenderPicker"

// ⛳️ Mock: replace with your auth/user context later
const mockUser = {
  name: "Aman Ansari",
  email: "aman@example.com",
  phone: "+1 (226) 555-0134",
};

// ⛳️ Mock availability (date -> slots). In real app, load from API per program.
const mockAvailability = {
  "2025-10-22": ["09:00", "11:00", "14:30"],
  "2025-10-23": ["10:00", "13:00", "16:00"],
  "2025-10-25": ["09:30", "12:00"],
  "2025-10-28": ["09:00", "10:30", "15:00", "17:00"],
};

const  Book_Program = () => {
  // Expecting program passed from Programs page:
  // <Link to="/booking" state={{ program }}>Book Now</Link>
  const location = useLocation();
  const program = location.state?.program || {
    title: "Yoga for Wellness",
    category: "Wellness",
    description:
      "Gentle yoga sessions designed to improve flexibility, reduce stress, and promote overall well-being.",
  };

  const [member, setMember] = useState(mockUser);
  const [selection, setSelection] = useState({ date: null, time: null });
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  const canConfirm = useMemo(
    () =>
      member.name.trim() &&
      member.email.trim() &&
      member.phone.trim() &&
      selection.date &&
      selection.time,
    [member, selection]
  );

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!canConfirm) return;

    // Here you'd POST to your API with { programId, member, date, time, notes }
    // await axios.post('/api/bookings', payload)
    setConfirmed(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f7f5fb] to-[#f3f0fa] py-10 px-6 sm:px-10 lg:px-20">
      {/* Back link */}
      <div className="flex justify-end mb-6">
        <Link
          to="/programs"
          className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium px-5 py-2 rounded-xl shadow-sm transition"
        >
          ← Back to Programs
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Program & Calendar */}
        <div className="lg:col-span-2 space-y-6">
          {/* Program summary */}
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <div className="flex items-start gap-4">
              <div className="bg-[#e6f8f7] rounded-full p-4">
                <span className="text-[#67c6c6] text-xl">🧘‍♀️</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {program.title}
                </h2>
                <div className="text-[#67c6c6] font-medium">{program.category}</div>
                <p className="text-gray-600 mt-2">{program.description}</p>
              </div>
            </div>
          </div>

          {/* Calendar + Times */}
          <CalendarPicker
            availability={mockAvailability}
            value={selection}
            onChange={setSelection}
          />
        </div>

        {/* Right: Booking details / confirmation */}
        <form
          onSubmit={handleConfirm}
          className="bg-white rounded-3xl shadow-xl p-6 h-fit sticky top-6"
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Booking Details
          </h3>

          {/* Member info (pre-filled) */}
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                value={member.name}
                onChange={(e) => setMember((m) => ({ ...m, name: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#a88ff0]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={member.email}
                onChange={(e) => setMember((m) => ({ ...m, email: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#a88ff0]"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Phone</label>
              <input
                type="tel"
                value={member.phone}
                onChange={(e) => setMember((m) => ({ ...m, phone: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#a88ff0]"
              />
            </div>
          </div>

          {/* Selected date/time */}
          <div className="bg-[#f8f7ff] rounded-2xl p-4 text-sm text-gray-700 mb-4">
            <div className="flex items-center justify-between">
              <span>Date</span>
              <span className="font-semibold">
                {selection.date ? (
                  <>
                    {/** date-fns format string */}
                    {Intl.DateTimeFormat("en-CA", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(selection.date)}
                  </>
                ) : (
                  <span className="text-gray-400">Pick a date</span>
                )}
              </span>
            </div>
            <div className="flex items-center justify-between mt-2">
              <span>Time</span>
              <span className="font-semibold">
                {selection.time || <span className="text-gray-400">Choose a slot</span>}
              </span>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#a88ff0]"
              placeholder="Anything you'd like the facilitator to know?"
            />
          </div>

          {/* Confirm button */}
          <button
            type="submit"
            disabled={!canConfirm}
            className={[
              "w-full py-3 rounded-lg font-semibold transition shadow-md",
              canConfirm
                ? "bg-[#67c6c6] hover:bg-[#5ab7b7] text-white"
                : "bg-gray-200 text-gray-500 cursor-not-allowed",
            ].join(" ")}
          >
            Confirm Booking
          </button>

          {/* Success mini-card */}
          {confirmed && (
            <div className="mt-4 bg-white border border-[#cfe4e1] rounded-2xl p-4 shadow-sm">
              <div className="text-[#67c6c6] font-semibold mb-1">Booking Confirmed 🎉</div>
              <div className="text-sm text-gray-600">
                You’re booked for <span className="font-medium">{program.title}</span>{" "}
                on{" "}
                <span className="font-medium">
                  {Intl.DateTimeFormat("en-CA", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }).format(selection.date)}
                </span>{" "}
                at <span className="font-medium">{selection.time}</span>.
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Book_Program;
