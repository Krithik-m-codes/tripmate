// pages/api/generate-itinerary.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY ?? "";
// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(apiKey);

// POST /api/generate-trip-itinerary
export async function POST(request: Request) {
  const { destination, duration, preferences, budget, travelStyle } =
    await request.json();

  // debug
  console.log(
    "Request received: ",
    destination,
    duration,
    preferences,
    budget,
    travelStyle
  );

  // Construct the prompt for Gemini
  // const prompt = `Generate a detailed ${duration} itinerary for a trip to ${destination}.
  //    Include activities related to ${preferences}.
  //    The budget is ${budget} and the preferred travel style is ${travelStyle}.
  //    Please provide a day-by-day breakdown of activities, recommended places to visit, and any travel tips.`;

  const prompt = `Generate a detailed itinerary for a trip to ${destination} lasting ${duration}. Focus on ${preferences} while considering a ${budget} type of budget and ${travelStyle} travel style.

Please provide:
1. A day-by-day breakdown of activities and sights
2. Recommended accommodations
3. Transportation suggestions between locations
4. Estimated costs for major expenses
5. Local cuisine recommendations
6. Cultural insights or travel tips

Format the itinerary as follows:

Day 1:
- Morning: [Activity]
- Afternoon: [Activity]
- Evening: [Activity]
- Accommodation: [Hotel/Hostel name]
- Highlight: [Special experience or sight]

[Repeat for each day]

Total Estimated Budget: [Amount]

Travel Tips:
1. [Tip 1]
2. [Tip 2]
3. [Tip 3]

Feel free to add more details is required to make the trip memorable.`;

  // Generate an itinerary using the Gemini API
  try {
    if (!destination || !duration || !preferences || !budget || !travelStyle) {
      return Response.json(
        {
          success: false,
          message: `Please provide all required fields : ${destination} , ${duration}, ${preferences}, ${budget}, ${travelStyle}`,
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    // Call the Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    // console.log("Itinerary generated successfully ", result.response.text());

    const itinerary = result.response.text();

    // formatting the response
    // const formattedItinerary = itinerary.replace(/(?:\r\n|\r|\n)/g, "<br>");

    const formattedItinerary = itinerary.replace(/\*/g, "");

    return Response.json(
      {
        success: true,
        message: "Itinerary generated successfully",
        data: formattedItinerary,
      },
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: "Failed to generate itinerary",
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
