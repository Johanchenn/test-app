// Assuming this file is in the same directory as your models directory
import AirQualityData from "../models/AirQualityData";

export const storeAirQualityData = async (data: any[], requestUrl: string) => {
  try {
    const transformedData = data.map((item) => ({
      ...item,
      requestUrl, // Adding the request URL to each item
      fromTime: new Date(item.fromTime),
      toTime: new Date(item.toTime),
    }));

    await AirQualityData.insertMany(transformedData);
    console.log("Data stored successfully");
  } catch (error) {
    console.error("Error storing data:", error);
  }
};
