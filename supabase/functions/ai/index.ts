import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const { type, prompt, tasks, taskTitle, chatHistory } = await req.json();
    console.log('AI request type:', type);

    let systemPrompt = '';
    let userPrompt = prompt || '';

    switch (type) {
      case 'sanitize':
        systemPrompt = 'You are a productivity expert. Rewrite vague task descriptions into specific, actionable SMART goals. Keep it concise (1-2 sentences max). Return ONLY the rewritten task, no explanations.';
        userPrompt = `Rewrite this task into a specific, actionable goal: "${prompt}"`;
        break;
      
      case 'prioritize':
        systemPrompt = 'You are a productivity expert. Analyze tasks and assign priority scores from 0-100 based on urgency and importance. Return ONLY a JSON array of objects with "id" and "priority" fields.';
        userPrompt = `Assign priority scores (0-100) to these tasks. Return JSON array with id and priority:\n${JSON.stringify(tasks)}`;
        break;
      
      case 'execution-plan':
        systemPrompt = 'You are a productivity coach. Create detailed, actionable step-by-step plans. Use HTML formatting with <h4> for section headers and <ul><li> for steps. Be specific and practical.';
        userPrompt = `Create a detailed step-by-step execution plan for this task: "${taskTitle}"`;
        break;
      
      case 'daily-plan':
        systemPrompt = 'You are a learning coach. Create a focused daily learning plan based on pending tasks. Use HTML formatting with <h4> headers and <ul><li> lists. Include time estimates and resources.';
        userPrompt = `Create a daily learning/preparation plan for these tasks:\n${tasks?.map((t: any) => `- ${t.title}`).join('\n')}`;
        break;
      
      case 'tutor':
        systemPrompt = `You are an expert tutor helping with this specific task: "${taskTitle}". Provide clear, educational answers. Use examples when helpful. Be encouraging but concise.`;
        break;
      
      default:
        systemPrompt = 'You are a helpful AI assistant.';
    }

    const messages = [
      { role: 'system', content: systemPrompt },
    ];

    if (type === 'tutor' && chatHistory?.length) {
      messages.push(...chatHistory);
    }
    
    messages.push({ role: 'user', content: userPrompt });

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI usage limit reached. Please add credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    console.log('AI response received, length:', content.length);

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in AI function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
