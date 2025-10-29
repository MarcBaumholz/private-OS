import { GoogleGenAI, Modality } from "@google/genai";
import type { Habit, Todo, WeeklyGoal, CalendarEvent, CoreValue } from '../types';
import { CORE_VALUES } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const model = 'gemini-2.5-flash';

export const getDailyBrief = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: "Provide a concise, motivating daily briefing for a user of a personal productivity dashboard. Include a piece of interesting tech news, a productivity tip, and a short motivational quote. Format the output as markdown with headings for each section.",
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching daily brief:", error);
    return "## Apologies\n\nI'm currently unable to fetch your daily brief. Please check your connection or API key and try again later.";
  }
};

export const generateWeeklySummary = async (data: { habits: Habit[]; todos: Todo[]; journalEntry: string }): Promise<string> => {
    const completedHabits = data.habits.filter(h => h.completed).map(h => h.name).join(', ') || 'None';
    const completedTodos = data.todos.filter(t => t.completed).map(t => t.text).join(', ') || 'None';

    const prompt = `
You are an AI assistant for a 'Life OS' app. Analyze the user's daily data and generate a motivational summary for their week.
This data represents a snapshot of one day this week. Extrapolate to celebrate their effort for the entire week.
Highlight their achievements and consistency. Be encouraging and provide a positive outlook for the week ahead.
Format the output as markdown.

**User's Data Snapshot:**
- **Completed Habits Today:** ${completedHabits}
- **Completed Todos Today:** ${completedTodos}
- **Journal Entry Snippet:** ${data.journalEntry.substring(0, 100)}...

Based on this, generate a warm and motivational summary celebrating their weekly progress.
    `;
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating weekly summary:", error);
        return "## Error\n\nCould not generate your weekly summary. The AI service may be temporarily unavailable.";
    }
};

export const analyzeBrainDump = async (text: string): Promise<string> => {
    const prompt = `
You are an expert AI assistant skilled in productivity and organization.
Analyze the following 'brain dump' from a user. Your task is to organize the thoughts into a structured mind map format.
Use markdown with nested lists to create this structure.
Identify key themes, projects, actionable next steps, and any underlying feelings or concerns.
The goal is to bring clarity and order to the user's raw thoughts.

**User's Brain Dump:**
---
${text}
---

Provide the analysis below.
    `;
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing brain dump:", error);
        return "## Analysis Failed\n\nI was unable to process your thoughts at this time. Please try again.";
    }
};

export const generateVisionBoardImage = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
        throw new Error("No image data returned from API.");
    } catch (error) {
        console.error("Error generating vision board image:", error);
        return "https://picsum.photos/seed/error/800/600"; // Fallback image
    }
};

export const suggestTasks = async (context: { weeklyGoals: WeeklyGoal[], calendarEvents: CalendarEvent[] }): Promise<string[]> => {
    const goalsText = context.weeklyGoals.filter(g => !g.completed).map(g => `- ${g.text}`).join('\n');
    const eventsText = context.calendarEvents.map(e => `- ${e.title} at ${e.time}`).join('\n');

    const prompt = `
    As a productivity assistant, analyze the user's context and suggest 3 actionable tasks for today.
    The tasks should be concise, clear, and directly related to their goals and schedule.
    Return ONLY a JSON array of strings, like ["Task 1", "Task 2", "Task 3"]. Do not include any other text, markdown, or code fences.

    **User's Context:**
    **This Week's Active Goals:**
    ${goalsText || 'No active weekly goals.'}
    **Today's Calendar Events:**
    ${eventsText || 'No events scheduled.'}

    Based on this, what are 3 specific tasks they should focus on today?
    `;
    let response;
    try {
        response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const jsonString = response.text.trim();
        const tasks = JSON.parse(jsonString);
        return Array.isArray(tasks) ? tasks.slice(0, 3) : [];
    } catch (error) {
        // Fix: The 'event' variable was not defined, causing an error on this line. 
        // The logging now includes the raw API response to aid in debugging parsing errors.
        console.error("Error suggesting tasks:", error, "Raw response:", response?.text);
        return ["Could not generate suggestions."];
    }
};

export const getJournalPrompt = async (context: { habits: Habit[] }): Promise<string> => {
    const completedHabits = context.habits.filter(h => h.completed).map(h => h.name).join(', ') || 'none';
    const incompleteHabits = context.habits.filter(h => !h.completed).map(h => h.name).join(', ') || 'none';
    const randomValue = CORE_VALUES[Math.floor(Math.random() * CORE_VALUES.length)];

    const prompt = `
    You are a thoughtful journaling assistant. Your goal is to provide an insightful, open-ended question to help the user reflect on their day.
    Base the question on their completed habits, their missed habits, or one of their core values.
    Keep the prompt to a single, engaging question. Do not add any extra conversational text, quotes, or formatting.

    **User's Context:**
    - Habits they completed today: ${completedHabits}
    - Habits they missed today: ${incompleteHabits}
    - A core value of theirs: "${randomValue.value}" - which means "${randomValue.statement}"

    Generate one reflective journal prompt based on this context.
    `;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error fetching journal prompt:", error);
        return "What is one thing that brought you joy today?";
    }
};
