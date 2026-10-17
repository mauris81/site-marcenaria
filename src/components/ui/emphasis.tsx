/** Renderiza trechos entre *asteriscos* com ênfase: itálico na cor da marca. */
export function Emphasis({ text }: { text: string }) {
  return (
    <>
      {text.split("*").map((part, index) =>
        index % 2 === 1 ? (
          <em key={index} className="text-brand">
            {part}
          </em>
        ) : (
          part
        ),
      )}
    </>
  );
}
