import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import {
  UserData,
  calculateBMR,
  calculateCalories,
  calculateMacronutrients,
  calculateWaterIntake,
} from "@/lib/diet-calculator";

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
    const bmr = calculateBMR(userData);
    const calories = calculateCalories(userData);
    const macros = calculateMacronutrients(calories, userData.goal);
    const waterIntake = calculateWaterIntake(userData.weight);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const { goal, dietPreference, dietStyle, allergies, exclude } = userData;
    const formattedGoal = goal.replace("-", " ");
    const fullDietDescription = `${dietStyle} ${dietPreference}`;

    const prompt = `
      You are a professional nutritionist. Create a detailed diet plan for a person with the following details:
      - Goal: ${formattedGoal}
      - Daily Calorie Target: Approximately ${Math.round(calories)} calories
      - Macronutrient Targets: Protein: ${macros.protein}g, Carbs: ${macros.carbs}g, Fats: ${macros.fats}g
      - Diet Preference: ${fullDietDescription}
      - Allergies: ${allergies || 'None specified'}
      - Foods to Exclude: ${exclude || 'None specified'}
      - Additional Comments: ${userData.comments || 'None specified'}

      First, create a summary section as a single HTML <div>. This div should contain the key nutritional targets: total calories, protein, carbs, fats, and water intake.
      The summary div should be structured exactly like this example, using these exact class names:
      <div class="nutrition-summary">
        <div class="summary-item">
          <span class="icon">🔥</span>
          <span class="value">${Math.round(calories)}</span>
          <span class="label">Calories</span>
        </div>
        <div class="summary-item">
          <span class="icon">🍗</span>
          <span class="value">${macros.protein}g</span>
          <span class="label">Protein</span>
        </div>
        <div class="summary-item">
          <span class="icon">🍚</span>
          <span class="value">${macros.carbs}g</span>
          <span class="label">Carbs</span>
        </div>
        <div class="summary-item">
          <span class="icon">🥑</span>
          <span class="value">${macros.fats}g</span>
          <span class="label">Fats</span>
        </div>
        <div class="summary-item">
          <span class="icon">💧</span>
          <span class="value">${waterIntake.toFixed(1)}L</span>
          <span class="label">Water</span>
        </div>
      </div>

      Following the summary div, generate the rest of the diet plan as a detailed, well-structured HTML document. The plan should be tailored to the user's profile and adhere to the following constraints:
      - Goal: ${userData.goal}
      - Diet Preference: ${userData.dietPreference}
      - Cuisine Style: ${userData.dietStyle}
      - Allergies: ${userData.allergies || 'None specified'}
      - Foods to Exclude: ${userData.exclude || 'None specified'}
      - Additional Comments: ${userData.comments || 'None specified'}

      Use Tailwind CSS classes for styling to ensure a modern and clean look. The entire response should be a single block of HTML, starting with the nutrition summary div.
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

      Ensure the final output is ONLY the raw HTML for the summary div AND the table, with no extra text, markdown, code fences, or explanations before or after it.
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
