const steps = [
  {
    title: "Sube tu PAC",
    description: "Arrastra el PDF y añade materiales opcionales.",
  },
  {
    title: "Analyzer gratuito",
    description: "Requisitos, temas, dificultad y checklist en segundos.",
  },
  {
    title: "Guía paso a paso",
    description:
      "Study Pack, Guided Plan o Review cuando quieras ir más allá.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto grid max-w-4xl gap-8 sm:grid-cols-3">
        {steps.map((step, i) => (
          <div key={step.title} className="flex flex-col items-center text-center">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
              {i + 1}
            </span>
            <h3 className="mt-3 font-semibold text-navy">{step.title}</h3>
            <p className="mt-1 text-sm text-navy/70">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
