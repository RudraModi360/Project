// pages/api/getanswer.ts
import { NextRequest } from "next/server";

export const runtime = "edge";

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default async function handler(req: NextRequest) {
  try {
    const { msg, imageUrl, conversationHistory } = await req.json();

    // Environment variables
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "AZURE_OPENAI_API_KEY environment variable is not defined"
      );
    }
    const apiVersion = "2024-02-15-preview";
    const deployment = "gpt-4o";

    const url = `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

    // Convert conversation history to OpenAI message format
    const previousMessages =
      conversationHistory?.map((msg: ConversationMessage) => ({
        role: msg.role,
        content: msg.content,
      })) || [];

    // Prepare the messages array based on whether an image is included
    const userMessage = imageUrl
      ? {
          role: "user",
          content: [
            {
              type: "text",
              text: msg,
            },
            {
              type: "image_url",
              image_url: {
                url: imageUrl,
              },
            },
          ],
        }
      : {
          role: "user",
          content: msg,
        };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "You are Ayunetra, an AI-powered health assistant that provides personalized recommendations for common day-to-day health concerns. You help users manage and find relief from various common ailments such as cough, fever, sneezing, acidity, and other non-severe conditions. Important guidelines:\n\n1. Focus on providing general guidance for common, non-severe health conditions\n2. Always include a clear disclaimer that you are not a replacement for professional medical advice\n3. For any serious symptoms or conditions, strongly recommend consulting a healthcare provider\n4. Provide practical, easy-to-follow recommendations\n5. When appropriate, suggest lifestyle modifications and preventive measures\n6. Maintain a caring and professional tone\n7. If analyzing images of symptoms, be cautious and always recommend professional evaluation for concerning findings\n8. Reference previous conversation context to provide more personalized recommendations\n\nEnd each response with a brief encouraging note about taking care of one's health.",
          },
          ...previousMessages,
          userMessage,
        ],
        max_tokens: 1500,
        temperature: 0.3,
        top_p: 0.95,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: true, // Enable streaming
      }),
    });

    if (!response.ok) {
      console.error(response.statusText);
      return new Response(
        JSON.stringify({
          error: "Failed to get response from Azure OpenAI API",
        }),
        { status: 500 }
      );
    }

    // Create a TransformStream for processing the response
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const stream = new TransformStream({
      async transform(chunk, controller) {
        const text = decoder.decode(chunk);
        const lines = text.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              return;
            }
            try {
              const json = JSON.parse(data);
              const content = json.choices[0]?.delta?.content || "";
              if (content) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
                );
              }
              if (json.choices[0]?.finish_reason === "stop") {
                controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                return;
              }
            } catch (e) {
              console.error("Error parsing JSON:", e);
              // Don't throw error, just log it and continue
              continue;
            }
          }
        }
      },
      async flush(controller) {
        try {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        } catch (e) {
          console.error("Error in flush:", e);
        }
      },
    });

    return new Response(response.body?.pipeThrough(stream), {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    });
  } catch (err) {
    console.error(err);
    if (err instanceof Error) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
      });
    }
    return new Response(JSON.stringify({ error: err }), {
      status: 500,
    });
  }
}
