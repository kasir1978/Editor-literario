import React, { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [text, setText] = useState("");
  const [correctedText, setCorrectedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/correct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const data = await response.json();
      setCorrectedText(data.correctedText);
    } catch (err) {
      setError("Hubo un problema al procesar el texto.");
    }

    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Editor Literario</title>
        <meta name="description" content="Asistente literario con IA para mejorar la escritura y corrección de textos." />
      </Head>
      <main className="flex flex-col items-center justify-center min-h-screen p-5 bg-gray-100">
        <h1 className="text-4xl font-bold text-gray-900">Editor Literario</h1>
        <p className="mt-4 text-lg text-gray-700">
          Corrige, mejora y analiza tus textos con inteligencia artificial.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 w-full max-w-lg">
          <textarea
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="5"
            placeholder="Escribe o pega tu texto aquí..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="mt-4 px-5 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 w-full"
            disabled={loading}
          >
            {loading ? "Analizando..." : "Analizar Texto"}
          </button>
        </form>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {correctedText && (
          <div className="mt-6 p-4 bg-white shadow-lg rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold">Texto Corregido:</h2>
            <p className="mt-2 text-gray-800">{correctedText}</p>
          </div>
        )}
      </main>
    </>
  );
}
