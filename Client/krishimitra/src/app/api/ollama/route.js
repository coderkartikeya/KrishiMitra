export async function POST(request) {
  try {
    const { messages, model = 'llama3.2' } = await request.json();

    // Format messages for Ollama API
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Add farming-specific system prompt
    const systemPrompt = {
      role: 'system',
      content: `You are a helpful agricultural assistant for Indian farmers. 
      Provide accurate, practical advice on farming practices, crop management, pest control, 
      weather adaptation, government schemes, and market information. 
      Be respectful and supportive. Respond in both Hindi and English when possible.
      Focus on sustainable and traditional farming methods applicable to Indian agriculture.
      If you don't know something, admit it rather than providing incorrect information.`
    };

    // Call Ollama API
    try {
      const ollamaResponse = await fetch('http://127.0.0.1:11434/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          messages: [systemPrompt, ...formattedMessages],
          stream: false,
          keep_alive: -1
        }),
      });

      if (!ollamaResponse.ok) {
        throw new Error(`Ollama API responded with status: ${ollamaResponse.status}`);
      }

      const data = await ollamaResponse.json();
      return Response.json({ response: data.message.content });
    } catch (fetchError) {
      console.error('Failed to connect to Ollama:', fetchError);
      return Response.json({
        response: "I'm having trouble connecting to my AI brain right now. Please make sure Ollama is running locally. (मुझे अपने एआई मस्तिष्क से जुड़ने में समस्या हो रही है। कृपया सुनिश्चित करें कि ओलामा स्थानीय रूप से चल रहा है।)"
      });
    }

  } catch (error) {
    console.error('Error in Ollama API route:', error);
    return Response.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    );
  }
}