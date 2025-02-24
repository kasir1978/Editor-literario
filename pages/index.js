import React, { useState } from "react";
import Head from "next/head";

export default function Home() {
  const [text, setText] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const [responseText, setResponseText] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      setResponseText(data.correctedText || "No se pudo procesar el texto.");
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      setResponseText("Hubo un error al analizar el texto.");
    }

    setSubmittedText(text);
  };

  return (
    <>
      <Head>
        <title>Editor Literario</title>
        <meta
          name="description"
          content="Asistente literario con IA para mejorar la escritura y corrección de textos."
        />
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
          >
            Analizar Texto
          </button>
        </form>
        {submittedText && (
          <div className="mt-6 p-4 bg-white shadow-lg rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold">Texto Ingresado:</h2>
            <p className="mt-2 text-gray-800">{submittedText}</p>
          </div>
        )}
        {responseText && (
          <div className="mt-6 p-4 bg-white shadow-lg rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold">Texto Corregido:</h2>
            <p className="mt-2 text-green-700">{responseText}</p>
          </div>
        )}
      </main>
    </>
  );
}
