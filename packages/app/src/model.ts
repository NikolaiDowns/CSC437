// packages/app/src/model.ts

// (You can define your own DataShare shape here, matching server’s user.ts)
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

  shares?: DataShare[];   // we already had this
  receives?: DataShare[]; // ← add this

  usage?: number[];
  isDeleted?: boolean;
  deletedAt?: Date;
}

/** 
 * Our app‐wide Model.  
 */
export interface Model {
  currentUser?: User;
}

/** 
 * Initialize with no user loaded.
 */
export const init: Model = {};
