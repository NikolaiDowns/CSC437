import { Schema, model } from "mongoose";
import { Traveler }     from "../models/traveler";

const TravelerSchema = new Schema<Traveler>({
  userid:   { type: String, required: true, trim: true },
  name:     { type: String, required: true, trim: true },
  nickname: { type: String, trim: true },
  home:     { type: String, trim: true },
  airports: [String],
  avatar:   String,
  color:    String
}, { collection: "blz_travelers" });

const TravelerModel = model<Traveler>("Traveler", TravelerSchema);

function index(): Promise<Traveler[]> {
  return TravelerModel.find().exec();
}

function get(userid: string): Promise<Traveler | null> {
  return TravelerModel.findOne({ userid }).exec();
}

export default { index, get };
