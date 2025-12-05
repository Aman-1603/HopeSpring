// src/components/Pages/BookaService/WigsCamisolesHeadcovers.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../../contexts/AuthContext";
import {
  Heart,
  ShoppingBag,
  Truck,
  Store,
  User,
  Users,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const LOCAL_CITIES = ["waterloo", "kitchener", "cambridge", "guelph"];

function classNames(...parts) {
  return parts.filter(Boolean).join(" ");
}

export default function WigsCamisolesHeadcovers() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const [forWhom, setForWhom] = useState("self"); // 'self' | 'family' | 'friend' | 'other'
  const [requesterName, setRequesterName] = useState("");
  const [requesterEmail, setRequesterEmail] = useState("");
  const [requesterPhone, setRequesterPhone] = useState("");

  const [recipientName, setRecipientName] = useState("");
  const [relationship, setRelationship] = useState("");

  const [wantsWig, setWantsWig] = useState(true);
  const [wantsHeadcover, setWantsHeadcover] = useState(false);
  const [wantsCamisole, setWantsCamisole] = useState(false);
  const [otherItems, setOtherItems] = useState("");

  const [deliveryMethod, setDeliveryMethod] = useState("home_delivery"); // 'home_delivery' | 'clinic_pickup'
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("Ontario");
  const [postalCode, setPostalCode] = useState("");
  const [inLocalDeliveryArea, setInLocalDeliveryArea] = useState(false);

  const [preferredContactMethod, setPreferredContactMethod] =
    useState("no_preference");
  const [notes, setNotes] = useState("");

  // Prefill from logged-in user if available
  useEffect(() => {
    if (user) {
      if (!requesterName) setRequesterName(user.name || "");
      if (!requesterEmail) setRequesterEmail(user.email || "");
    }
  }, [user]);

  // Auto-flag local delivery area based on city
  useEffect(() => {
    const c = (city || "").trim().toLowerCase();
    setInLocalDeliveryArea(LOCAL_CITIES.includes(c));
  }, [city]);

  const isLoggedIn = !!token;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!isLoggedIn) {
      setError("Please log in before submitting a request.");
      return;
    }

    setError(null);

    if (!requesterName || !requesterEmail) {
      setError("Name and email are required.");
      return;
    }

    if (!wantsWig && !wantsHeadcover && !wantsCamisole && !otherItems.trim()) {
      setError("Please select at least one item or describe what you need.");
      return;
    }

    if (deliveryMethod === "home_delivery" && !addressLine1.trim()) {
      setError("Please provide your delivery address (at least Address line 1).");
      return;
    }

    setLoading(true);

    try {
      const body = {
        forWhom,
        requesterName,
        requesterEmail,
        requesterPhone: requesterPhone || null,
        recipientName: forWhom === "self" ? null : recipientName || null,
        relationship: forWhom === "self" ? null : relationship || null,
        wantsWig,
        wantsHeadcover,
        wantsCamisole,
        otherItems: otherItems || null,
        deliveryMethod,
        addressLine1: deliveryMethod === "home_delivery" ? addressLine1 : null,
        addressLine2:
          deliveryMethod === "home_delivery" && addressLine2
            ? addressLine2
            : null,
        city:
          deliveryMethod === "home_delivery" && city
            ? city
            : null,
        province:
          deliveryMethod === "home_delivery" && province
            ? province
            : null,
        postalCode:
          deliveryMethod === "home_delivery" && postalCode
            ? postalCode
            : null,
        inLocalDeliveryArea:
          deliveryMethod === "home_delivery" ? inLocalDeliveryArea : false,
        preferredContactMethod,
        notes: notes || null,
      };

      await axios.post("/api/boutique/requests", body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Submit boutique request failed:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Something went wrong. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <main className="bg-emerald-50 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <div className="rounded-2xl bg-white border border-amber-200 px-6 py-8 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <h1 className="text-lg font-semibold text-gray-900">
                Please log in to request boutique items
              </h1>
            </div>
            <p className="text-sm text-gray-700">
              To request wigs, headcovers, or camisoles, please sign in to your
              HopeSpring account. This helps us connect your request to your
              profile and follow up securely.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="bg-emerald-50 min-h-screen">
        <div className="mx-auto max-w-3xl px-4 py-16">
          <div className="rounded-2xl bg-white border border-emerald-200 px-6 py-8 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
                <CheckCircle2 className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Thank you — your request has been received
                </h1>
                <p className="text-sm text-gray-600">
                  A team member will review your request and contact you to
                  confirm details and next steps.
                </p>
              </div>
            </div>

            <ul className="mt-3 text-sm text-gray-700 list-disc pl-5 space-y-1">
              <li>
                If you selected <strong>home delivery</strong>, we’ll confirm
                address and sizing before we send anything.
              </li>
              <li>
                If you selected <strong>clinic pickup</strong>, we’ll arrange a
                time for you to come in.
              </li>
            </ul>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-emerald-50 min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-10">
        {/* HERO */}
        <section className="mb-8">
          <div className="flex flex-col gap-4 rounded-3xl bg-white/80 border border-emerald-100 px-5 py-5 sm:px-7 sm:py-7 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-800">
              <ShoppingBag className="w-4 h-4" />
              Boutique Request
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                  Request Wigs, Camisoles & Headcovers
                </h1>
                <p className="text-sm text-gray-700 max-w-xl">
                  HopeSpring can provide wigs, headcovers, and camisoles at no
                  cost. Items can be{" "}
                  <span className="font-semibold">delivered to your home</span>{" "}
                  (no-contact) or made available for{" "}
                  <span className="font-semibold">clinic pickup</span>.
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-xs text-emerald-900 flex items-start gap-2">
                <Heart className="w-4 h-4 mt-0.5 text-emerald-700" />
                <p>
                  Delivery is available in{" "}
                  <span className="font-semibold">
                    Waterloo, Kitchener, Cambridge, and Guelph
                  </span>{" "}
                  at no cost. Outside this area, we can arrange free shipping.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FORM */}
        <section>
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white border border-gray-200 px-5 py-6 sm:px-7 sm:py-7 shadow-sm space-y-6"
          >
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {/* WHO IS THIS FOR */}
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                Who is this request for?
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { key: "self", label: "Myself" },
                  { key: "family", label: "Family member" },
                  { key: "friend", label: "Friend" },
                  { key: "other", label: "Other" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setForWhom(opt.key)}
                    className={classNames(
                      "rounded-xl border px-3 py-2 flex items-center justify-center gap-1.5",
                      forWhom === opt.key
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <User className="w-3 h-3 text-gray-400" />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* REQUESTER INFO */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Your name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Your email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={requesterEmail}
                  onChange={(e) => setRequesterEmail(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Phone number (optional)
                </label>
                <input
                  type="tel"
                  value={requesterPhone}
                  onChange={(e) => setRequesterPhone(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="For faster follow-up"
                />
              </div>
            </div>

            {/* RECIPIENT INFO IF NOT SELF */}
            {forWhom !== "self" && (
              <div className="grid gap-4 sm:grid-cols-2 border rounded-2xl border-emerald-100 bg-emerald-50/40 px-3 py-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    Recipient name
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    Relationship
                  </label>
                  <input
                    type="text"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="e.g. mother, friend, partner"
                  />
                </div>
              </div>
            )}

            {/* ITEMS REQUESTED */}
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
                What would you like to request?
              </h2>
              <div className="grid gap-2 sm:grid-cols-3 text-sm">
                <label className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                  <input
                    type="checkbox"
                    checked={wantsWig}
                    onChange={(e) => setWantsWig(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Wig</span>
                </label>
                <label className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                  <input
                    type="checkbox"
                    checked={wantsHeadcover}
                    onChange={(e) => setWantsHeadcover(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Headcover (hats, turbans, scarves)</span>
                </label>
                <label className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2">
                  <input
                    type="checkbox"
                    checked={wantsCamisole}
                    onChange={(e) => setWantsCamisole(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Camisole</span>
                </label>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Anything specific you’re looking for? (size, colour, style)
                </label>
                <textarea
                  value={otherItems}
                  onChange={(e) => setOtherItems(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Example: shoulder-length brown wig, size medium; soft cotton headcover; post-surgery camisole size L…"
                />
              </div>
            </div>

            {/* DELIVERY VS PICKUP */}
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                How would you like to receive items?
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 text-sm">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("home_delivery")}
                  className={classNames(
                    "rounded-2xl border px-3 py-3 text-left flex gap-3",
                    deliveryMethod === "home_delivery"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  )}
                >
                  <div className="mt-1">
                    <Truck className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-gray-900">
                      Home delivery (no-contact)
                    </p>
                    <p className="text-xs text-gray-600">
                      Available in Waterloo, Kitchener, Cambridge, and Guelph.
                      Outside this area, we can arrange free shipping.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMethod("clinic_pickup")}
                  className={classNames(
                    "rounded-2xl border px-3 py-3 text-left flex gap-3",
                    deliveryMethod === "clinic_pickup"
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  )}
                >
                  <div className="mt-1">
                    <Store className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-semibold text-gray-900">
                      Pickup at the centre
                    </p>
                    <p className="text-xs text-gray-600">
                      We’ll contact you to arrange a time to visit the centre
                      and choose items in person.
                    </p>
                  </div>
                </button>
              </div>

              {deliveryMethod === "home_delivery" && (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-medium text-gray-700">
                      Address line 1 <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={addressLine1}
                      onChange={(e) => setAddressLine1(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-medium text-gray-700">
                      Address line 2 (optional)
                    </label>
                    <input
                      type="text"
                      value={addressLine2}
                      onChange={(e) => setAddressLine2(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-700">
                      Province
                    </label>
                    <input
                      type="text"
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2 sm:max-w-xs">
                    <label className="text-xs font-medium text-gray-700">
                      Postal code
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="inline-flex items-center gap-2 text-xs text-gray-700">
                      <input
                        type="checkbox"
                        checked={inLocalDeliveryArea}
                        onChange={(e) =>
                          setInLocalDeliveryArea(e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>
                        I live in Waterloo, Kitchener, Cambridge, or Guelph.
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* CONTACT PREFS */}
            <div className="space-y-2">
              <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-emerald-600" />
                How should we contact you?
              </h2>
              <div className="flex flex-wrap gap-2 text-xs">
                {[
                  { key: "no_preference", label: "No preference" },
                  { key: "phone", label: "Phone" },
                  { key: "email", label: "Email" },
                ].map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setPreferredContactMethod(opt.key)}
                    className={classNames(
                      "rounded-full border px-3 py-1.5",
                      preferredContactMethod === opt.key
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-500">
                We’ll only use your contact details for this request unless you
                ask us to follow up about other programs.
              </p>
            </div>

            {/* NOTES */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">
                Anything else we should know?
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="For example: comfort needs, skin sensitivities, upcoming surgery dates, language needs, or anything that will help us support you better."
              />
            </div>

            {/* SUBMIT */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-[11px] text-gray-500 max-w-md">
                Submitting this form does not create an appointment. A team
                member will review your request and contact you to confirm
                options and next steps.
              </p>
              <button
                type="submit"
                disabled={loading}
                className={classNames(
                  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white",
                  loading
                    ? "bg-emerald-300 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700"
                )}
              >
                {loading && (
                  <span className="h-4 w-4 rounded-full border-2 border-white/60 border-t-transparent animate-spin" />
                )}
                Submit request
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
