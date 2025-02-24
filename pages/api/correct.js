export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: "Texto requerido" });
  }

  try {
    console.log("Procesando texto:", text); // Para ver si el texto llega correctamente
    console.log("Clave API utilizada:", process.env.OPENAI_API_KEY ? "Presente" : "No encontrada"); // Para ver si la clave está definida

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "Corrige el siguiente texto manteniendo su significado y estructura:" },
          { role: "user", content: text }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error en la API de OpenAI:", response.status, errorText);
      return res.status(response.status).json({ message: `Error de OpenAI: ${errorText}` });
    }

    const data = await response.json();
    const correctedText = data.choices?.[0]?.message?.content || "No se pudo obtener una corrección.";

    return res.status(200).json({ correctedText });
  } catch (error) {
    console.error("Error interno:", error);
    return res.status(500).json({ message: "Error interno del servidor.", error: error.message });
  }
}
