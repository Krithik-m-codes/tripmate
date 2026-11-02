export type DemoActivity = {
  slot: "Morning" | "Afternoon" | "Evening";
  title: string;
  area: string;
  cost: string;
  category: "Sightseeing" | "Food" | "Transport" | "Activity" | "Shopping";
};

export type DemoDay = {
  day: number;
  theme: string;
  activities: DemoActivity[];
};

export type DemoPlan = {
  city: string;
  country: string;
  days: DemoDay[];
  weather: string;
  coordinates: string;
  total: string;
  food: string;
  isSample: true;
};

const LISBON: DemoPlan = {
  city: "Lisbon",
  country: "Portugal",
  weather: "18–24°C · mostly sunny",
  coordinates: "38.72, -9.14",
  total: "$480–620",
  food: "Time Out Market · Pastéis de Belém · A Brasileira",
  isSample: true,
  days: [
    {
      day: 1,
      theme: "Alfama & the river",
      activities: [
        {
          slot: "Morning",
          title: "Walk Alfama's lanes to São Jorge Castle",
          area: "Alfama",
          cost: "$18",
          category: "Sightseeing",
        },
        {
          slot: "Afternoon",
          title: "Lunch at Time Out Market",
          area: "Cais do Sodré",
          cost: "$22",
          category: "Food",
        },
        {
          slot: "Evening",
          title: "Sunset at Miradouro da Senhora do Monte",
          area: "Graça",
          cost: "$0",
          category: "Sightseeing",
        },
      ],
    },
    {
      day: 2,
      theme: "Belém, west along the Tagus",
      activities: [
        {
          slot: "Morning",
          title: "Jerónimos Monastery and Belém Tower",
          area: "Belém",
          cost: "$20",
          category: "Sightseeing",
        },
        {
          slot: "Afternoon",
          title: "Pastéis de Belém, then MAAT",
          area: "Belém",
          cost: "$14",
          category: "Food",
        },
        {
          slot: "Evening",
          title: "Tagus riverside walk",
          area: "Belém",
          cost: "$0",
          category: "Activity",
        },
      ],
    },
    {
      day: 3,
      theme: "Sintra day trip",
      activities: [
        {
          slot: "Morning",
          title: "Pena Palace, first entry slot",
          area: "Sintra",
          cost: "$25",
          category: "Sightseeing",
        },
        {
          slot: "Afternoon",
          title: "Quinta da Regaleira and its wells",
          area: "Sintra",
          cost: "$15",
          category: "Sightseeing",
        },
        {
          slot: "Evening",
          title: "Cabo da Roca at sunset",
          area: "Sintra coast",
          cost: "$12",
          category: "Transport",
        },
      ],
    },
    {
      day: 4,
      theme: "Chiado, Bairro Alto, fado",
      activities: [
        {
          slot: "Morning",
          title: "Coffee at A Brasileira, then Chiado",
          area: "Chiado",
          cost: "$8",
          category: "Food",
        },
        {
          slot: "Afternoon",
          title: "LX Factory shops and murals",
          area: "Alcântara",
          cost: "$0",
          category: "Shopping",
        },
        {
          slot: "Evening",
          title: "Fado dinner in Bairro Alto",
          area: "Bairro Alto",
          cost: "$45",
          category: "Food",
        },
      ],
    },
    {
      day: 5,
      theme: "Cascais and the Atlantic",
      activities: [
        {
          slot: "Morning",
          title: "Train to Cascais",
          area: "Cais do Sodré",
          cost: "$6",
          category: "Transport",
        },
        {
          slot: "Afternoon",
          title: "Praia da Rainha and Boca do Inferno",
          area: "Cascais",
          cost: "$0",
          category: "Activity",
        },
        {
          slot: "Evening",
          title: "Seafood at the Cascais marina",
          area: "Cascais",
          cost: "$35",
          category: "Food",
        },
      ],
    },
  ],
};

const TOKYO: DemoPlan = {
  city: "Tokyo",
  country: "Japan",
  weather: "14–21°C · clear with one rainy day",
  coordinates: "35.68, 139.69",
  total: "$760–940",
  food: "Tsukiji Outer Market · Afuri · Higashiya",
  isSample: true,
  days: [
    {
      day: 1,
      theme: "Shibuya to Shinjuku",
      activities: [
        { slot: "Morning", title: "Meiji Jingu forest walk", area: "Shibuya", cost: "$0", category: "Sightseeing" },
        { slot: "Afternoon", title: "Shibuya Crossing and Miyashita Park", area: "Shibuya", cost: "$8", category: "Activity" },
        { slot: "Evening", title: "Omoide Yokocho yakitori", area: "Shinjuku", cost: "$28", category: "Food" },
      ],
    },
    {
      day: 2,
      theme: "Asakusa and Ueno",
      activities: [
        { slot: "Morning", title: "Senso-ji before the crowds", area: "Asakusa", cost: "$0", category: "Sightseeing" },
        { slot: "Afternoon", title: "Ueno Park and Tokyo National Museum", area: "Ueno", cost: "$7", category: "Sightseeing" },
        { slot: "Evening", title: "Yanaka backstreets and dinner", area: "Yanaka", cost: "$24", category: "Food" },
      ],
    },
    {
      day: 3,
      theme: "Fish market and Ginza",
      activities: [
        { slot: "Morning", title: "Tsukiji Outer Market breakfast", area: "Tsukiji", cost: "$18", category: "Food" },
        { slot: "Afternoon", title: "Ginza galleries and Itoya stationery", area: "Ginza", cost: "$0", category: "Shopping" },
        { slot: "Evening", title: "Tokyo Station and Marunouchi lights", area: "Marunouchi", cost: "$12", category: "Activity" },
      ],
    },
    {
      day: 4,
      theme: "Harajuku and Daikanyama",
      activities: [
        { slot: "Morning", title: "Meiji Jingu Gaien ginkgo avenue", area: "Aoyama", cost: "$0", category: "Sightseeing" },
        { slot: "Afternoon", title: "Takeshita Street and Cat Street", area: "Harajuku", cost: "$15", category: "Shopping" },
        { slot: "Evening", title: "Daikanyama T-Site and dinner", area: "Daikanyama", cost: "$32", category: "Food" },
      ],
    },
    {
      day: 5,
      theme: "Odaiba and the bay",
      activities: [
        { slot: "Morning", title: "teamLab Planets", area: "Toyosu", cost: "$25", category: "Activity" },
        { slot: "Afternoon", title: "Odaiba seaside walk", area: "Odaiba", cost: "$0", category: "Activity" },
        { slot: "Evening", title: "Rainbow Bridge view and ramen", area: "Shibaura", cost: "$16", category: "Food" },
      ],
    },
  ],
};

const BALI: DemoPlan = {
  city: "Bali",
  country: "Indonesia",
  weather: "26–31°C · humid, afternoon showers",
  coordinates: "-8.65, 115.22",
  total: "$540–720",
  food: "Locavore To Go · Warung Babi Guling · Crate Café",
  isSample: true,
  days: [
    {
      day: 1,
      theme: "Ubud centre",
      activities: [
        { slot: "Morning", title: "Campuhan Ridge Walk", area: "Ubud", cost: "$0", category: "Activity" },
        { slot: "Afternoon", title: "Ubud Art Market and palace", area: "Ubud", cost: "$10", category: "Shopping" },
        { slot: "Evening", title: "Balinese dance at Ubud Palace", area: "Ubud", cost: "$12", category: "Activity" },
      ],
    },
    {
      day: 2,
      theme: "Tegallalang and the north",
      activities: [
        { slot: "Morning", title: "Tegallalang rice terraces early", area: "Tegallalang", cost: "$8", category: "Sightseeing" },
        { slot: "Afternoon", title: "Tirta Empul water temple", area: "Tampaksiring", cost: "$6", category: "Sightseeing" },
        { slot: "Evening", title: "Warung dinner in Ubud", area: "Ubud", cost: "$12", category: "Food" },
      ],
    },
    {
      day: 3,
      theme: "Uluwatu and the south coast",
      activities: [
        { slot: "Morning", title: "Drive to Uluwatu", area: "Uluwatu", cost: "$25", category: "Transport" },
        { slot: "Afternoon", title: "Padang Padang beach", area: "Uluwatu", cost: "$5", category: "Activity" },
        { slot: "Evening", title: "Kecak dance at Uluwatu Temple", area: "Uluwatu", cost: "$15", category: "Activity" },
      ],
    },
    {
      day: 4,
      theme: "Canggu",
      activities: [
        { slot: "Morning", title: "Surf lesson at Batu Bolong", area: "Canggu", cost: "$30", category: "Activity" },
        { slot: "Afternoon", title: "Crate Café and beach clubs", area: "Canggu", cost: "$18", category: "Food" },
        { slot: "Evening", title: "Sunset at Echo Beach", area: "Canggu", cost: "$0", category: "Sightseeing" },
      ],
    },
    {
      day: 5,
      theme: "Seminyak and Tanah Lot",
      activities: [
        { slot: "Morning", title: "Seminyak boutiques", area: "Seminyak", cost: "$20", category: "Shopping" },
        { slot: "Afternoon", title: "Tanah Lot temple", area: "Tanah Lot", cost: "$8", category: "Sightseeing" },
        { slot: "Evening", title: "Seafood at Jimbaran Bay", area: "Jimbaran", cost: "$28", category: "Food" },
      ],
    },
  ],
};

function titleCase(value: string) {
  return value
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function genericPlan(input: string): DemoPlan {
  const city = titleCase(input || "Your destination");
  const themes = [
    "Arrival and orientation",
    "Old town and local food",
    "Museums and markets",
    "Day trip outside the city",
    "Slow morning and departure",
  ];
  const activitySets: DemoActivity[][] = [
    [
      { slot: "Morning", title: "Drop bags and walk the old town", area: "City centre", cost: "$0", category: "Sightseeing" },
      { slot: "Afternoon", title: "Local market lunch", area: "Market district", cost: "$15", category: "Food" },
      { slot: "Evening", title: "Sunset viewpoint", area: "Riverside", cost: "$0", category: "Sightseeing" },
    ],
    [
      { slot: "Morning", title: "Landmark walk", area: "Historic core", cost: "$12", category: "Sightseeing" },
      { slot: "Afternoon", title: "Neighbourhood food crawl", area: "Local quarter", cost: "$24", category: "Food" },
      { slot: "Evening", title: "Live music or a quiet bar", area: "Nightlife district", cost: "$18", category: "Activity" },
    ],
    [
      { slot: "Morning", title: "Museum or gallery", area: "Museum quarter", cost: "$14", category: "Sightseeing" },
      { slot: "Afternoon", title: "Independent shops", area: "Design district", cost: "$0", category: "Shopping" },
      { slot: "Evening", title: "Dinner near the water", area: "Waterfront", cost: "$28", category: "Food" },
    ],
    [
      { slot: "Morning", title: "Train or bus out of the city", area: "Day trip", cost: "$16", category: "Transport" },
      { slot: "Afternoon", title: "Short hike or beach", area: "Day trip", cost: "$0", category: "Activity" },
      { slot: "Evening", title: "Return and eat locally", area: "City centre", cost: "$20", category: "Food" },
    ],
    [
      { slot: "Morning", title: "Café and a final walk", area: "City centre", cost: "$8", category: "Food" },
      { slot: "Afternoon", title: "Pick up gifts", area: "Market district", cost: "$20", category: "Shopping" },
      { slot: "Evening", title: "Airport transfer", area: "City centre", cost: "$18", category: "Transport" },
    ],
  ];

  return {
    city,
    country: "Sample structure",
    weather: "Forecast appears here for real trips",
    coordinates: "Resolved by geocode_place",
    total: "$420–580",
    food: "Local recommendations appear here",
    isSample: true,
    days: themes.map((theme, index) => ({
      day: index + 1,
      theme,
      activities: activitySets[index],
    })),
  };
}

export function getDemoPlan(input: string): DemoPlan {
  const value = input.toLowerCase();
  if (value.includes("lisbon") || value.includes("lisboa") || value.includes("portugal")) {
    return LISBON;
  }
  if (value.includes("tokyo") || value.includes("japan")) {
    return TOKYO;
  }
  if (value.includes("bali") || value.includes("ubud") || value.includes("indonesia")) {
    return BALI;
  }
  return genericPlan(input);
}
