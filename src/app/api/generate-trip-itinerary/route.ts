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
  const prompt = `Generate a detailed ${duration} itinerary for a trip to ${destination}. 
     Include activities related to ${preferences}.
     The budget is ${budget} and the preferred travel style is ${travelStyle}.
     Please provide a day-by-day breakdown of activities, recommended places to visit, and any travel tips.`;

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
