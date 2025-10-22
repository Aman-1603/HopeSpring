export default function Page({ title, intro }) {
  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="text-3xl font-extrabold text-[#0b1c33]">{title}</h1>
        {intro && <p className="text-gray-700 mt-3">{intro}</p>}
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-gray-600">
            This is the <strong>{title}</strong> page. Replace this with your real content.
          </p>
        </div>
      </div>
    </section>
  );
}
