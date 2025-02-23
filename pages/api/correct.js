export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ message: "No se proporcionó texto" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Usamos la API Key de OpenAI desde Vercel
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "Corrige errores y mejora el siguiente texto, manteniendo su idioma original." },
          { role: "user", content: text }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const correctedText = data.choices?.[0]?.message?.content || "Error al obtener respuesta";

    return res.status(200).json({ correctedText });
  } catch (error) {
    return res.status(500).json({ message: "Error al procesar la solicitud", error });
  }
}
