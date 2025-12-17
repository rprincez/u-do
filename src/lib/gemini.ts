const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export async function callGemini(prompt: string, apiKey: string): Promise<string> {
  if (!apiKey) {
    throw new Error('API key is required');
  }

  const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to call Gemini API');
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export async function sanitizeTask(title: string, apiKey: string): Promise<string> {
  const prompt = `You are an Executive Function Coach. The user has entered a vague task: "${title}". 
Rewrite it into a specific, actionable SMART goal (Specific, Measurable, Achievable, Relevant, Time-bound).
Return ONLY the rewritten text string, nothing else. Keep it concise but specific.`;
  
  return callGemini(prompt, apiKey);
}

export async function prioritizeTasks(tasks: { id: string; title: string }[], apiKey: string): Promise<{ id: string; score: number }[]> {
  const taskList = tasks.map((t, i) => `${i + 1}. ${t.title}`).join('\n');
  
  const prompt = `You are a Productivity Judge. Analyze these tasks and assign a priority score from 0-100 based on urgency, importance, and complexity:

${taskList}

Return ONLY a JSON array with objects containing "index" (1-based) and "score" (0-100). Example:
[{"index": 1, "score": 85}, {"index": 2, "score": 42}]`;

  const response = await callGemini(prompt, apiKey);
  
  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error('No JSON found');
    
    const scores: { index: number; score: number }[] = JSON.parse(jsonMatch[0]);
    return scores.map((s) => ({
      id: tasks[s.index - 1]?.id || '',
      score: s.score,
    })).filter(s => s.id);
  } catch {
    return tasks.map(t => ({ id: t.id, score: 50 }));
  }
}

export async function generateExecutionPlan(title: string, apiKey: string): Promise<string> {
  const prompt = `You are a Project Manager and Study Coach. Create a detailed step-by-step execution plan for this task: "${title}"

Format your response as clean HTML with:
- An <h4> title for each major phase
- <ul> lists with specific action items
- Include time estimates where appropriate
- Add tips or resources if relevant

Make it practical and immediately actionable.`;

  return callGemini(prompt, apiKey);
}

export async function generateDailyPlan(taskTitles: string[], apiKey: string): Promise<string> {
  const prompt = `You are a Personal Productivity Coach. Based on these pending tasks:

${taskTitles.map((t, i) => `${i + 1}. ${t}`).join('\n')}

Create a "Today's Learning Journey" plan. Format as HTML with:
- A motivating opening statement
- Prioritized order of tasks with reasoning
- Time blocks suggestions
- A "Quick Wins" section for easy momentum builders
- Key resources or preparation needed
- End with an encouraging note

Keep it energizing and actionable!`;

  return callGemini(prompt, apiKey);
}

export async function askTutor(
  taskTitle: string,
  question: string,
  chatHistory: { role: string; content: string }[],
  apiKey: string
): Promise<string> {
  const historyContext = chatHistory
    .slice(-6)
    .map((m) => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.content}`)
    .join('\n');

  const prompt = `You are an AI Tutor helping a student with this specific task: "${taskTitle}"

Previous conversation:
${historyContext || 'No previous messages'}

Student's question: ${question}

Provide a helpful, encouraging response. If explaining concepts, use clear examples. 
If the student seems stuck, offer practical next steps.
Keep responses focused and actionable.`;

  return callGemini(prompt, apiKey);
}
