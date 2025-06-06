"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var user_svc_exports = {};
__export(user_svc_exports, {
  UserModel: () => UserModel,
  default: () => user_svc_default
});
module.exports = __toCommonJS(user_svc_exports);
var import_mongoose = require("mongoose");
const DataShareSchema = new import_mongoose.Schema(
  {
    withUserId: {
      type: String,
      required: true,
      trim: true,
      ref: "User"
    },
    mode: {
      type: String,
      enum: ["temporary", "indefinite"],
      required: true
    },
    sharedAt: {
      type: Date,
      default: () => /* @__PURE__ */ new Date(),
      required: true
    },
    expiresAt: Date
  },
  { _id: false }
);
const UserSchema = new import_mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    tocAccepted: {
      type: Boolean,
      default: false
    },
    tocVersion: String,
    tocTimestamp: Date,
    shares: {
      type: [DataShareSchema],
      default: []
    },
    receives: {
      type: [DataShareSchema],
      // ← NEW field
      default: []
    },
    usage: {
      type: [Number],
      default: () => Array.from({ length: 156 }, () => Math.floor(Math.random() * 71))
    },
    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: Date
  },
  {
    collection: "truewalk_users",
    timestamps: true
    // adds createdAt & updatedAt
  }
);
const UserModel = (0, import_mongoose.model)("User", UserSchema);
function index() {
  return UserModel.find().exec();
}
function get(id) {
  return UserModel.findOne({ id }).exec();
}
function create(u) {
  const doc = new UserModel(u);
  return doc.save();
}
function update(id, u) {
  return UserModel.findOneAndUpdate({ id }, u, { new: true }).then((updated) => {
    if (!updated) throw `${id} not found`;
    return updated;
  });
}
function remove(id) {
  return UserModel.findOneAndDelete({ id }).then((deleted) => {
    if (!deleted) throw `${id} not found`;
  });
}
var user_svc_default = { index, get, create, update, remove, UserModel };
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UserModel
});
