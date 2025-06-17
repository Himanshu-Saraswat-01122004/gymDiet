import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { UserData, calculateCalories } from "@/lib/diet-calculator";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Gemini API key not configured. Please add it to .env.local" },
      { status: 500 }
    );
  }

  try {
    const userData: UserData = await req.json();
    const calories = calculateCalories(userData);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { goal, dietPreference, dietStyle } = userData;
    const formattedGoal = goal.replace('-', ' ');
    const fullDietDescription = `${dietStyle} ${dietPreference}`;

    const prompt = `
      You are a professional nutritionist. Create a detailed diet plan for a person with the following details:
      - Goal: ${formattedGoal}
      - Daily Calorie Target: Approximately ${Math.round(calories)} calories
      - Diet Preference: ${fullDietDescription}

      Generate the diet plan as a single, well-structured HTML table. The table should have the following columns: "Meal", "Time", and "Options / Description".
      The table should be structured exactly like this example, including the caption:
      <table>
        <caption>${fullDietDescription} ${formattedGoal} Diet Plan</caption>
        <thead>
          <tr>
            <th>Meal</th>
            <th>Time</th>
            <th>Options / Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Pre-Workout</td>
            <td>5:30 AM – 6:00 AM</td>
            <td><ul><li>Detail 1</li><li>Detail 2</li></ul></td>
          </tr>
          <tr>
            <td>Breakfast</td>
            <td>7:30 AM – 8:30 AM</td>
            <td><strong>Option 1:</strong><ul><li>Detailed description 1</li></ul><strong>Option 2:</strong><ul><li>Detailed description 2</li></ul><strong>Option 3:</strong><ul><li>Detailed description 3</li></ul></td>
          </tr>
          <tr>
            <td>Lunch</td>
            <td>1:00 PM – 2:00 PM</td>
            <td><strong>Option 1:</strong><ul><li>Detailed description 1</li></ul><strong>Option 2:</strong><ul><li>Detailed description 2</li></ul><strong>Option 3:</strong><ul><li>Detailed description 3</li></ul></td>
          </tr>
          <tr>
            <td>Dinner</td>
            <td>7:30 PM – 8:30 PM</td>
            <td><strong>Option 1:</strong><ul><li>Detailed description 1</li></ul><strong>Option 2:</strong><ul><li>Detailed description 2</li></ul><strong>Option 3:</strong><ul><li>Detailed description 3</li></ul></td>
          </tr>
        </tbody>
      </table>

      For Breakfast, Lunch, and Dinner, provide at least 3 detailed meal options. The details should include portion sizes and ingredients.
      Make the plan compact and visually appealing by using relevant emojis for each meal (e.g., 🍳 for Breakfast, 🥗 for Lunch).

      Ensure the final output is ONLY the raw HTML for the table, with no extra text, markdown, code fences, or explanations before or after it.
      The meal options should be healthy, balanced, and appropriate for the given calorie target and goal.
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    let htmlContent = response.text();

    // Clean the response to remove markdown fences and trim whitespace.
    htmlContent = htmlContent.replace(/^```html/, '').replace(/```$/, '').trim();

    return NextResponse.json({ dietPlanHtml: htmlContent });
  } catch (error) {
    console.error("Error generating diet plan:", error);
    return NextResponse.json(
      { error: "Failed to generate diet plan from AI" },
      { status: 500 }
    );
  }
}
