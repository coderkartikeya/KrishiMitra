// Placeholder summarize endpoint. Replace with your AI provider of choice.
export async function POST(request) {
  const { text, lang } = await request.json();
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return new Response(JSON.stringify({ error: 'Missing text' }), { status: 400 });
  }

  // Simple heuristic summary: first 2-3 sentences trimmed
  const sentences = text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .slice(0, 3)
    .join(' ')
    .trim();

  const summary = sentences.length > 0 ? sentences : text.slice(0, 220) + (text.length > 220 ? '…' : '');
  return new Response(JSON.stringify({ summary, lang: lang || 'en' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}


