import { NextResponse } from "next/server";

// Curated climate profile fallback base
const CLIMATE_DATABASE: Record<
  string,
  {
    tempMinC: number;
    tempMaxC: number;
    condition: string;
    description: string;
    packingAdvice: string[];
  }
> = {
  tokyo: {
    tempMinC: 15,
    tempMaxC: 23,
    condition: "Partly Sunny",
    description: "Pleasant seasonal temperatures with mild breezes and clear morning skies.",
    packingAdvice: ["Light jacket or cardigan", "Comfortable walking sneakers", "Compact umbrella"],
  },
  kyoto: {
    tempMinC: 14,
    tempMaxC: 22,
    condition: "Mild & Scenic",
    description: "Crisp morning air around temples turning into warm, comfortable afternoons.",
    packingAdvice: ["Layers for easy shedding", "Slip-on shoes for temple entry", "Small daypack"],
  },
  paris: {
    tempMinC: 12,
    tempMaxC: 20,
    condition: "Mild with Showers",
    description: "Classic European weather with mix of bright sunshine and brief refreshing showers.",
    packingAdvice: ["Stylish trench coat or water-resistant jacket", "Scarf", "Comfortable city walking boots"],
  },
  bali: {
    tempMinC: 26,
    tempMaxC: 31,
    condition: "Tropical & Warm",
    description: "Warm tropical breezes with high humidity and occasional afternoon rain refreshes.",
    packingAdvice: ["Breathable linen/cotton clothes", "Reef-safe sunscreen & sunglasses", "Swimwear & sandals"],
  },
  rome: {
    tempMinC: 16,
    tempMaxC: 25,
    condition: "Sunny & Warm",
    description: "Mediterranean sunshine perfect for outdoor dining and historic sightseeing.",
    packingAdvice: ["Sun hat & sunglasses", "Light breathable cottons", "Good walking shoes for cobblestones"],
  },
  new_york: {
    tempMinC: 13,
    tempMaxC: 22,
    condition: "Crisp & Clear",
    description: "Brisk morning wind turning into sunny, energizing afternoons across the city.",
    packingAdvice: ["Versatile layered outfits", "Sturdy walking shoes", "Windbreaker jacket"],
  },
  london: {
    tempMinC: 11,
    tempMaxC: 18,
    condition: "Overcast with Sun Breaks",
    description: "Mild British temperatures with characteristic shifting skies throughout the day.",
    packingAdvice: ["Waterproof outer layer", "Layers for changing temperatures", "Compact umbrella"],
  },
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const destination = searchParams.get("destination") || "Tokyo";
    const dates = searchParams.get("dates") || "";

    const cleanDest = destination.toLowerCase().replace(/[^a-z]/g, "_");
    const matchedKey = Object.keys(CLIMATE_DATABASE).find(
      (k) => cleanDest.includes(k) || k.includes(cleanDest)
    );

    const data = matchedKey
      ? CLIMATE_DATABASE[matchedKey]
      : {
          tempMinC: 18,
          tempMaxC: 26,
          condition: "Sunny & Pleasant",
          description: "Optimal travel conditions with balanced warmth and comfortable humidity.",
          packingAdvice: ["Comfortable walking shoes", "Light layers for evening", "Sunglasses & sunscreen"],
        };

    const tempMinF = Math.round((data.tempMinC * 9) / 5 + 32);
    const tempMaxF = Math.round((data.tempMaxC * 9) / 5 + 32);

    return NextResponse.json({
      success: true,
      data: {
        destination,
        dates,
        tempC: `${data.tempMinC}°C - ${data.tempMaxC}°C`,
        tempF: `${tempMinF}°F - ${tempMaxF}°F`,
        condition: data.condition,
        description: data.description,
        packingAdvice: data.packingAdvice,
      },
    });
  } catch (error) {
    console.error("GET /api/weather/destination error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch weather forecast" },
      { status: 500 }
    );
  }
}
