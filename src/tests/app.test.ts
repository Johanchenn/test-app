import supertest from "supertest";
import { app } from "../app";
import axios from "axios";
import AirQualityData from "../models/AirQualityData";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("../src/models/AirQualityData");
jest.mock("../src/database/database");

describe("Request Handling", () => {
  it("should proxy requests and return data", async () => {
    const response = await supertest(app).get("/aq/utd?station=Oslo");
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    // Add more specific checks based on the expected response structure
  });
});

describe("handleProxyRequest", () => {
  it("fetches and stores data when not in the database", async () => {
    const mockApiData = [{ id: 1, value: "test data" }];
    mockedAxios.get.mockResolvedValue({ data: mockApiData });

    AirQualityData.findOne = jest.fn().mockResolvedValue(null); // Mock to return null, simulating no data in DB

    const response = await supertest(app).get("/aq/utd?station=Oslo");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockApiData);
    expect(mockedAxios.get).toHaveBeenCalled();
    expect(AirQualityData.findOne).toHaveBeenCalled();
  });

  it("returns data from the database if available", async () => {
    const mockDbData = { data: [{ id: 1, value: "test data from DB" }] };
    AirQualityData.findOne = jest.fn().mockResolvedValue(mockDbData);

    const response = await supertest(app).get("/aq/utd?station=Oslo");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockDbData.data);
    expect(AirQualityData.findOne).toHaveBeenCalled();
    expect(mockedAxios.get).not.toHaveBeenCalled(); // Axios should not be called if data is in DB
  });
});
