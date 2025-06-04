// packages/app/src/messages.ts

import { User } from "./model";

/**
 * 1) “user/load”   → payload: {}        (trigger the fetch of /api/auth/me)
 * 2) “user/set”    → payload: { user: User }   (update model.currentUser)
 * 3) “user/clear”  → payload: {}        (logged out → clear currentUser)
 * 
 * (Later, you could add share/add, share/remove, etc., but for now we only need user‐related messages.)
 */
export type Msg =
  | ["user/load", {}]
  | ["user/set", { user: User }]
  | ["user/clear", {}];
