import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { emailText } = await request.json();

    if (!emailText) {
      return NextResponse.json(
        { error: 'Email text is required' },
        { status: 400 }
      );
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `You are an expert project management assistant. Analyze the following email and extract structured project information.

Email Content:
${emailText}

CRITICAL: Your response must be ONLY valid JSON with no additional text, explanations, or markdown formatting. Do not wrap the JSON in code blocks or backticks.

Provide your response in exactly this JSON structure:
{
  "email_metadata": {
    "subject": "string (extract from email if present)",
    "from": "string (sender name/email if mentioned)",
    "date": "string (extract if mentioned, otherwise 'Not specified')",
    "project_name": "string (infer from context)"
  },
  "action_items": [
    {
      "task": "string",
      "assignee": "string (name of person responsible)",
      "due_date": "string (extract if mentioned, otherwise 'Not specified')",
      "priority": "High|Medium|Low"
    }
  ],
  "decisions": [
    {
      "decision": "string",
      "context": "string (brief explanation)"
    }
  ],
  "risks": [
    {
      "risk": "string (description of the risk)",
      "severity": "High|Medium|Low",
      "impact": "string (what this affects)",
      "mentioned_by": "string (who raised it)"
    }
  ],
  "key_topics": ["array of main topics discussed"],
  "status_updates": [
    {
      "area": "string (what aspect of the project)",
      "status": "string (the update or information)",
      "type": "Progress|Blocker|Delay|Resource Issue|Budget|Other"
    }
  ],
  "project_health": {
    "status": "On Track|At Risk|Blocked",
    "summary": "string (1-2 sentence overall assessment based on email content)"
  }
}

Be thorough but concise. Extract information about:
- Project status updates
- Supply chain delays or issues
- Resource bottlenecks
- Client concerns
- Timeline slips
- Budget variances
- Any blockers or risks mentioned

If information isn't present, use "Not specified" or empty arrays as appropriate.

Remember: Respond with ONLY the JSON object, nothing else.`,
        },
      ],
    });

    let responseText = message.content[0].type === 'text' 
      ? message.content[0].text 
      : '';

    console.log('Raw Claude response:', responseText.substring(0, 200));

    responseText = responseText
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/g, '')
      .trim();

    const jsonStart = responseText.indexOf('{');
    const jsonEnd = responseText.lastIndexOf('}') + 1;
    
    if (jsonStart !== -1 && jsonEnd > jsonStart) {
      responseText = responseText.substring(jsonStart, jsonEnd);
    }

    console.log('Cleaned response:', responseText.substring(0, 200));

    const analysisResult = JSON.parse(responseText);

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error('Error analyzing email:', error);
    console.error('Error details:', error instanceof Error ? error.message : 'Unknown error');
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
