import React, { useState } from "react";

export default function Contador() {
  const [count, setCount] = useState(0);

  return (
    <section aria-label="Contador de práctica">
      <p>Contador: {count}</p>
      <button type="button" onClick={() => setCount((value) => value + 1)}>
        Incrementar
      </button>
      <button type="button" onClick={() => setCount((value) => value - 1)}>
        Decrementar
      </button>
    </section>
  );
}
