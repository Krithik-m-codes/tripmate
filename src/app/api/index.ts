// import { ApiResponse } from "@/types/ApiResponse";

// function to get images from pixa bay api
export const fetchImages = async (search: string) => {
  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=${process.env.NEXT_PUBLIC_PIXABAY_API_KEY}&q=${search}&image_type=photo`
    );
    const data = await response.json();
    // console.log("data in index.ts for fetch image : ", data);
    return data.hits;
  } catch (error) {
    return [];
  }
};

//function to get directions from mapbox api
export const fetchDirections = async (origin: string, destination: string) => {
  try {
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${origin};${destination}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_API_KEY}`
    );
    const data = await response.json();
    return Response.json(
      {
        success: true,
        message: "Directions fetched successfully",
        data: data.routes[0].geometry,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error fetching directions",
      },
      {
        status: 500,
      }
    );
  }
};

// fetch trending places from api

// fetch lat and lon from locationiq api
// export const fetchLatLon = async (search: string) => {
//   try {
//     const response = await fetch(
//       `https://us1.locationiq.com/v1/search.php?key=${process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY}&q=${search}&format=json`
//     );
//     const data = await response.json();
//     console.log("data in index.ts for fetch lat lon : ", data);
//     return data[0];
//   } catch (error) {
//     return {};
//   }
// };
