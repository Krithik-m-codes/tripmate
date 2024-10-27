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

  //   // Prompt
  //   const prompt = `Generate a detailed itinerary for a trip to ${destination} lasting ${duration}. Focus on ${preferences} while considering a ${budget} type of budget and ${travelStyle} travel style.

  // Please provide:
  // 1. A day-by-day breakdown of activities and sights
  // 2. Recommended accommodations
  // 3. Transportation suggestions between locations
  // 4. Estimated costs for major expenses
  // 5. Local cuisine recommendations
  // 6. Cultural insights or travel tips

  // Format the itinerary as follows:

  // Day 1:
  // - Morning: [Activity]
  // - Afternoon: [Activity]
  // - Evening: [Activity]
  // - Accommodation: [Hotel/Hostel name]
  // - Highlight: [Special experience or sight]

  // [Repeat for each day for the whole duration range of the trip]

  // Total Estimated Budget: [Amount]

  // Travel Tips:
  // 1. [Tip 1]
  // 2. [Tip 2]
  // 3. [Tip 3]

  // Feel free to add more details is required to make the trip memorable.`;

  // Fixing the duration to calculate the number of days
  const startDate = new Date(duration.from).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const endDate = new Date(duration.to).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const totalDays =
    Math.ceil(
      (new Date(duration.to).getTime() - new Date(duration.from).getTime()) /
        (1000 * 60 * 60 * 24)
    ) + 1;

  console.log("Fixed duration: ", startDate, endDate, totalDays);

  // Determine the season based on the start date
  const getSeason = (date: any) => {
    const month = new Date(date).getMonth() + 1; // getMonth returns 0-based month
    if (month >= 6 && month <= 9) {
      return "monsoon season"; // June to September is typically monsoon season in many regions
    } else if (month >= 10 && month <= 11) {
      return "post-monsoon / early winter season"; // October and November are cooler with clear skies
    } else if (month >= 12 || month <= 2) {
      return "winter season"; // December to February is winter in most regions
    } else if (month >= 3 && month <= 5) {
      return "summer season"; // March to May is summer
    }
  };

  const season = getSeason(duration.from); // Calculate the season based on the start date

  // Enhanced prompt with fixed duration
  // Enhanced prompt with season context and fixed duration
  const prompt = `
Generate a highly detailed and personalized itinerary for a trip to ${destination}, lasting ${totalDays} days from ${startDate} to ${endDate}.
The trip will take place during the ${season}, so please recommend activities and travel tips appropriate for this time of year.
The itinerary should focus on ${preferences}, considering a ${budget} budget and a ${travelStyle} travel style.

Please ensure the itinerary covers:
1. **Day-by-Day Breakdown**: Provide activities, must-see sights, and hidden gems for each day, including seasonal events and local experiences if applicable. Ensure the itinerary flows smoothly, with a balance of adventure and relaxation where appropriate. Consider weather-related activities based on the ${season}.
2. **Accommodation Recommendations**: Suggest a range of accommodation options (e.g., hotels, hostels, Airbnb) for each night, based on the budget and travel style. Include alternatives such as eco-lodges, boutique stays, or unique places like treehouses or houseboats, if relevant.
3. **Transportation Options**: Detail how to get around between locations. Consider local transport (e.g., buses, trains, bicycles), ride-sharing services, and car rentals. Mention the best, most efficient, or scenic modes of travel.
4. **Cost Estimates**: Provide estimated costs for major expenses like accommodations, activities, transportation, and meals each day, within the specified budget.
5. **Local Cuisine**: Recommend places to eat, including street food, local markets, and traditional restaurants. Suggest signature dishes or drinks for each meal, especially those unique to the destination.
6. **Cultural Insights & Travel Tips**: Offer advice on local customs, etiquette, or unique cultural practices. Provide insider tips for an authentic experience, such as when to visit popular spots to avoid crowds, how to interact with locals, and seasonal/weather-related advice based on the ${season}.
7. **Optional Activities**: For each day, suggest optional experiences for different interests, such as adventure activities, relaxation options (e.g., spa, beach), or local workshops (e.g., cooking classes, pottery, dance lessons).

### Format the itinerary as follows:

Day 1 (${startDate}):
- **Morning**: [Activity] (Include timing suggestions if relevant)
- **Afternoon**: [Activity]
- **Evening**: [Activity]
- **Accommodation**: [Hotel/Hostel/Airbnb name]
- **Highlight**: [Special experience or sight for the day, such as a sunset view or iconic attraction]
- **Meals**: [Local dish recommendations and specific restaurants]
- **Cost Breakdown**: [Estimated cost for day (accommodation, transport, food, activities)]

[Repeat for each day until ${endDate}, updating the date for each day and including all above sections.]

### Total Estimated Budget: [Amount for the entire trip, broken down by categories like accommodation, meals, transport, and activities]

### Travel Tips:
1. [Tip 1 related to local customs]
2. [Tip 2 for navigating transportation or avoiding tourist traps]
3. [Tip 3 related to safety, seasonal advice, or money-saving hacks]

Feel free to add further details and local insights where necessary to ensure the trip is unique, enjoyable, and memorable. Provide a balance between popular attractions and hidden gems or lesser-known places.
`;

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
