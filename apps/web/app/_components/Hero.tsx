import UploadDropzone from "./UploadDropzone";

export default function Hero() {
  return (
    <section className="flex flex-col items-center gap-6 bg-offwhite px-6 py-20 text-center">
      <span className="text-sm font-semibold uppercase tracking-wide text-teal">
        Pathora
      </span>
      <h1 className="max-w-2xl text-3xl font-bold text-navy sm:text-4xl">
        Sube tu PAC. Descubre qué necesitas para resolverla.
      </h1>
      <p className="max-w-xl text-navy/70">
        Analizamos el enunciado, conectamos cada pregunta con tus materiales
        y te damos una guía clara para avanzar.
      </p>

      <UploadDropzone />

      <p className="text-xs text-navy/50">
        Análisis básico gratis · Sin suscripción · Materiales opcionales
      </p>
    </section>
  );
}
