// src/components/LanguageDropdown.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const LanguageDropdown = () => {
  const { i18n, t } = useTranslation();
  const current = (i18n.language || "en").slice(0, 2); // "en-CA" -> "en"

  const handleChange = (e) => {
    const lng = e.target.value;
    i18n.changeLanguage(lng);
    if (typeof document !== "undefined") {
      document.documentElement.lang = lng;
    }
  };

  return (
    <div className="flex items-center gap-1">
      <label htmlFor="lang-select" className="sr-only">
        {t("menu.common.language")}
      </label>
      <select
        id="lang-select"
        value={current}
        onChange={handleChange}
        className="border border-gray-300 rounded-lg px-2 py-1 text-sm bg-white text-gray-800"
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
      </select>
    </div>
  );
};

export default LanguageDropdown;
