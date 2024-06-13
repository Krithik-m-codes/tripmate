import mongoose from "mongoose";

// Connection object to store connection status of the database
type ConnectionObject = {
  isConnected?: number;
};

// Function to connect to the database and store the connection status in the connection object
// optional to be object or number
const connection: ConnectionObject = {};

// Function to connect to the database
async function dbConnect(): Promise<void> {
  // If the connection object is not defined, create a new connection
  if (connection.isConnected) {
    console.log("Using existing Database connection");
    return;
  }
  // Connect to the database
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {
      dbName: "tripmate",
    });
    connection.isConnected = db.connections[0].readyState;
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to database : ");
    console.error(error);
    // Exit the process if the connection to the database fails
    process.exit(1);
  }
}

export default dbConnect;
