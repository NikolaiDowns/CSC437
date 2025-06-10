// packages/app/src/model.ts

// DataShare shape
export interface DataShare {
  withUserId: string;
  mode: "temporary" | "indefinite";
  sharedAt: string;      // JSON‐serialized date 
  expiresAt?: string;    // JSON‐serialized date, if temporary
}

export interface User {
  id: string;
  name: string;

  tocAccepted: boolean;
  tocVersion?: string;
  tocTimestamp?: Date;

  shares?: DataShare[];
  receives?: DataShare[];

  usage?: number[];
  isDeleted?: boolean;
  deletedAt?: Date;
}

// app-wide model
export interface Model {
  currentUser?: User;
}

// Initialize with no user loaded
export const init: Model = {};
