// src/services/user-svc.ts

import { Schema, model } from "mongoose";
import { User, DataShare } from "../models/user";

// Subdocument for sharing relationships
const DataShareSchema = new Schema<DataShare>(
  {
    withUserId: {
      type: String,
      required: true,
      trim: true,
      ref: "User",
    },
    mode: {
      type: String,
      enum: ["temporary", "indefinite"],
      required: true,
    },
    sharedAt: {
      type: Date,
      default: () => new Date(),
      required: true,
    },
    expiresAt: Date,
  },
  { _id: false }
);

const UserSchema = new Schema<User>(
  {
    id: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    tocAccepted: {
      type: Boolean,
      default: false,
    },
    tocVersion: String,
    tocTimestamp: Date,
    shares: {
      type: [DataShareSchema],
      default: [],
    },
    usage: {
      type: [Number],
      default: [],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    collection: "truewalk_users",
    timestamps: true, // adds createdAt & updatedAt
  }
);

const UserModel = model<User>("User", UserSchema);

function index(): Promise<User[]> {
  return UserModel.find().exec();
}

function get(id: string): Promise<User | null> {
  return UserModel.findOne({ id }).exec();
}

export default { index, get };
