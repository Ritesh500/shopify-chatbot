import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message required",
      });
    }

    const completion =
    await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
          You are a Shopify AI chatbot.

          Rules:
          - Reply professionally.
          - Reply shortly.
          - Reply in Hindi or English according to user language.

          Store Info:
          - Delivery: 3-7 days
          - Return: 7 days
          - Support: support@mystore.com
          `
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    return res.status(200).json({
      reply:
        completion.choices[0].message.content,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      error: error.message,
    });
  }
}