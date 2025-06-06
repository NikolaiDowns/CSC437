// packages/server/src/services/user-svc.ts

import { Schema, model } from "mongoose";
import { User, DataShare } from "../models/user";

// ───────────────────────────────────────────────────────────────────────────────
// Sub-document schema for DataShare (used both in shares[] and receives[]).
// ───────────────────────────────────────────────────────────────────────────────
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

// ───────────────────────────────────────────────────────────────────────────────
// Main User schema: now with a “receives” array as well as “shares”.
// ───────────────────────────────────────────────────────────────────────────────
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
    receives: {
      type: [DataShareSchema], // ← NEW field
      default: [],
    },

    usage: {
      type: [Number],
      default: () =>
        Array.from({ length: 156 }, () => Math.floor(Math.random() * 71)),
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

function create(u: User): Promise<User> {
  const doc = new UserModel(u);
  return doc.save();
}

function update(id: string, u: User): Promise<User> {
  return UserModel.findOneAndUpdate({ id }, u, { new: true }).then((updated) => {
    if (!updated) throw `${id} not found`;
    return updated;
  });
}

function remove(id: string): Promise<void> {
  return UserModel.findOneAndDelete({ id }).then((deleted) => {
    if (!deleted) throw `${id} not found`;
  });
}

// ← Make sure UserModel is a named export, so routes/users.ts can import it:
export { UserModel };

// ← Also keep the default export so you can do `import Users from "./user-svc"`
export default { index, get, create, update, remove, UserModel };