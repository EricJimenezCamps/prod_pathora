const tiers = [
  {
    name: "PAC Analyzer",
    price: "Gratis",
    description: "Entrada sin fricción: lectura estructurada del enunciado.",
    cta: "Analizar mi PAC gratis",
    highlighted: false,
  },
  {
    name: "Study Pack",
    price: "4,99 €",
    description: "Resumen exclusivo de los conceptos necesarios.",
    cta: "Conseguir Study Pack",
    highlighted: false,
  },
  {
    name: "Guided Plan",
    price: "9,99–11,99 €",
    description:
      "Para cada ejercicio: qué pide, conceptos, pasos y checklist.",
    cta: "Crear mi guía paso a paso",
    highlighted: true,
  },
  {
    name: "Review",
    price: "6,99 €",
    description: "Contrasta tu borrador con el enunciado y la rúbrica.",
    cta: "Revisar mi PAC",
    highlighted: false,
  },
];

export default function Pricing() {
  return (
    <section className="bg-offwhite px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-2xl font-bold text-navy">
          Precios de validación inicial
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-lg border p-6 ${
                tier.highlighted
                  ? "border-teal bg-white shadow-md"
                  : "border-navy/10 bg-white"
              }`}
            >
              {tier.highlighted && (
                <span className="mb-2 text-xs font-semibold uppercase tracking-wide text-teal">
                  Producto principal
                </span>
              )}
              <h3 className="font-semibold text-navy">{tier.name}</h3>
              <p className="mt-1 text-xl font-bold text-navy">{tier.price}</p>
              <p className="mt-2 flex-1 text-sm text-navy/70">
                {tier.description}
              </p>
              <button
                type="button"
                className={`mt-4 rounded-md px-4 py-2 text-sm font-semibold ${
                  tier.highlighted
                    ? "bg-blue text-white"
                    : "bg-navy/5 text-navy"
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
