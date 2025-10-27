import React from "react";

/**
 * Newsletter Code
 */
export default function Newsletter({
  title = "Subscribe to our Newsletter",
  blurb = "Stay updated on inspiring stories, upcoming events, and opportunities to make a difference. Join our community and receive weekly doses of inspiration in your inbox.",
  quote = "“Thank you for your dedication and lifting our spirits” – EK",
  imageSrc = "/images/hope-notes.png",
  formHtml,
  className = "",
}) {
  return (
    <section className={`bg-[#ff8a00] py-16 ${className}`}>
      <div className="mx-auto max-w-6xl px-4 grid gap-10 md:grid-cols-2 items-start">
        {/* Left column */}
        <div>
          <h3 className="text-3xl md:text-4xl font-extrabold text-white">
            {title}
          </h3>
          <p className="mt-4 text-white/90">{blurb}</p>
          {quote ? <p className="mt-4 italic text-white/95">{quote}</p> : null}

          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Newsletter preview"
              className="mt-8 w-full max-w-[380px] rounded-2xl shadow-xl ring-1 ring-black/10"
            />
          ) : null}
        </div>

        {/* Right column – form card */}
        <div className="rounded-2xl bg-white shadow-xl ring-1 ring-black/10 overflow-hidden">
          <div className="px-6 py-5 border-b">
            <h4 className="text-lg font-semibold text-[#0b1c33]">
              Subscribe to our newsletter
            </h4>
          </div>

          {/* Either your Mailchimp embed, or our default form */}
          {formHtml ? (
            <div
              className="p-6 md:p-8"
              // Paste Mailchimp's <form> markup into the formHtml prop (no external <link> CSS).
              dangerouslySetInnerHTML={{ __html: formHtml }}
            />
          ) : (
            <form
              onSubmit={(e) => e.preventDefault()}
              className="p-6 md:p-8 space-y-5"
            >
              <div>
                <label className="block text-sm font-medium text-[#0b1c33]">
                  Email Address <span className="text-red-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  className="mt-1 w-full h-11 rounded-lg border border-gray-300 px-3
                             focus:outline-none focus:ring-2 focus:ring-[#0e2340]/30"
                />
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-[#0b1c33]">
                  Marketing Permissions
                </p>
                <div className="grid gap-2 text-sm text-[#0b1c33]">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4" /> Email
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4" /> Direct Mail
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4" /> Customized
                    online advertising
                  </label>
                </div>
              </div>

              <div className="space-y-3 text-xs leading-relaxed text-gray-600">
                <p>
                  You can change your mind at any time by clicking the
                  unsubscribe link in the footer of any email you receive from
                  us, or by contacting us at marketing@hopespring.ca. We will
                  treat your information with respect.
                </p>
                <p>
                  We use Mailchimp as our marketing platform. By clicking below
                  to subscribe, you acknowledge that your information will be
                  transferred to Mailchimp for processing.
                </p>
              </div>

              <div className="pt-2">
                <button className="h-11 px-5 rounded-lg bg-[#0b1c33] text-white font-semibold hover:brightness-110">
                  SUBSCRIBE
                </button>
              </div>
            </form>
          )}

          {/* thin bottom accent */}
          <div className="h-3 w-full bg-[#ff8a00]" />
        </div>
      </div>
    </section>
  );
}
