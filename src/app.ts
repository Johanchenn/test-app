import express, { Request, Response } from "express";
import axios from "axios";
import { LRUCache } from "lru-cache";
import mongoose from "mongoose";
import { storeAirQualityData } from "./database/storeAirQualityData";
import AirQualityData from "./models/AirQualityData";
import dotenv from "dotenv";
dotenv.config();

export const app = express();
const port = 8080;

const mongoDbUri = process.env.MONGODB_ATLAS_URI;

if (!mongoDbUri) {
  throw new Error("MONGODB_ATLAS_URI is not defined in .env file");
} else {
  // MongoDB connection
  mongoose
    .connect(mongoDbUri, {})
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));
}

// Setting up LRU Cache
const options = {
  max: 500, // The maximum size of the cache
  maxAge: 1000 * 60 * 60, // 1 hour cache expiration
};
export const cache = new LRUCache<string, any>(options);

// Function to build the NILU API URL with query parameters
const buildApiUrl = (endpoint: string, query: any): string => {
  const baseUrl = "https://api.nilu.no";
  let url = `${baseUrl}/${endpoint}?`;
  Object.keys(query).forEach((key) => {
    url += `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}&`;
  });
  return url.slice(0, -1);
};

// Generic route handler for proxying requests
const handleProxyRequest = async (
  req: Request,
  res: Response,
  endpoint: string
) => {
  try {
    const apiUrl = buildApiUrl(endpoint, req.query);

    // Check database first
    const cachedResponse = await AirQualityData.findOne({ requestUrl: apiUrl });
    if (cachedResponse) {
      return res.json(cachedResponse.data);
    }

    // Fetch from external API
    const response = await axios.get(apiUrl);
    const responseData = response.data;

    // Store the data in MongoDB
    if (Array.isArray(responseData)) {
      await storeAirQualityData(responseData, apiUrl);
    }

    res.json(responseData);
  } catch (error) {
    res.status(500).send("An error occurred");
  }
};

// Route for air quality data
app.get("/aq/:type", (req, res) => {
  const endpoint = req.params.type === "utd" ? "aq/utd" : "aq/historical";
  handleProxyRequest(req, res, endpoint);
});

// Route for air quality observations
app.get("/obs/:type", (req, res) => {
  const endpoint = req.params.type === "utd" ? "obs/utd" : "obs/historical";
  handleProxyRequest(req, res, endpoint);
});

// Route for aggregated values
app.get("/agg/:type", (req, res) => {
  // Assuming 'type' parameter is used to differentiate aggregated data types
  handleProxyRequest(req, res, `agg/${req.params.type}`);
});

// Route for daily average statistics
app.get("/stats/day", (req, res) => {
  handleProxyRequest(req, res, "stats/day");
});

// Additional routes can be implemented similarly

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
