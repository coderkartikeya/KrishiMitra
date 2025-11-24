// Summarize endpoint using local Ollama instance
export async function POST(request) {
  const { text, lang } = await request.json();

  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return new Response(JSON.stringify({ error: 'Missing text' }), { status: 400 });
  }

  const systemPrompt = "You are a helpful agricultural assistant. Summarize the following discussion in 2-3 concise sentences. Focus on the main problem and the suggested solutions. Keep it simple and easy for a farmer to understand.";

  try {
    const ollamaResponse = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Summarize this: ${text}` }
        ],
        stream: false
      }),
    });

    if (!ollamaResponse.ok) {
      throw new Error(`Ollama API responded with status: ${ollamaResponse.status}`);
    }

    const data = await ollamaResponse.json();
    const summary = data.message?.content || "Summary unavailable.";

    return new Response(JSON.stringify({ summary, lang: lang || 'en' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error connecting to Ollama:', error);

    // Fallback heuristic summary if Ollama fails
    const sentences = text
      .replace(/\s+/g, ' ')
      .split(/(?<=[.!?])\s+/)
      .slice(0, 3)
      .join(' ')
      .trim();

    const fallbackSummary = sentences.length > 0 ? sentences : text.slice(0, 220) + (text.length > 220 ? '…' : '');

    return new Response(JSON.stringify({
      summary: fallbackSummary + " (AI summary unavailable, showing preview)",
      lang: lang || 'en',
      error: 'AI service unavailable'
    }), {
      status: 200, // Return 200 with fallback to avoid breaking UI
      headers: { 'Content-Type': 'application/json' }
    });
  }
}


