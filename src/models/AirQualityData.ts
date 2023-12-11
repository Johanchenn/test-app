import mongoose, { Schema, Document } from "mongoose";

interface IAirQualityData extends Document {
  id: number;
  data: any;
  zone: string;
  municipality: string;
  area: string;
  station: string;
  eoi: string;
  type: string;
  component: string;
  fromTime: Date;
  toTime: Date;
  value: number;
  unit: string;
  latitude: number;
  longitude: number;
  timestep: number;
  index: number;
  color: string;
  isValid: boolean;
  isVisible: boolean;
  requestUrl: string; // To track the API request URL
}

const airQualityDataSchema: Schema = new Schema({
  id: { type: Number, required: true },
  data: { type: Schema.Types.Mixed, required: true },
  zone: { type: String, required: true },
  municipality: { type: String, required: true },
  area: { type: String, required: true },
  station: { type: String, required: true },
  eoi: { type: String, required: true },
  type: { type: String, required: true },
  component: { type: String, required: true },
  fromTime: { type: Date, required: true },
  toTime: { type: Date, required: true },
  value: { type: Number, required: true },
  unit: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestep: { type: Number, required: true },
  index: { type: Number, required: true },
  color: { type: String, required: true },
  isValid: { type: Boolean, required: true },
  isVisible: { type: Boolean, required: true },
  requestUrl: { type: String, required: true }, // To track the API request URL
});

export default mongoose.model<IAirQualityData>(
  "AirQualityData",
  airQualityDataSchema
);
