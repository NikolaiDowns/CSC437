// packages/app/src/messages.ts

import { User } from "./model";

export type Msg =
  | ["user/load", {}]
  | ["user/set", { user: User }]
  | ["user/clear", {}]
  | [
      "share/save",
      {
        userid: string;
        share: {
          withUserId: string;
          mode: "temporary" | "indefinite";
          sharedAt: Date;
          expiresAt?: Date;
        };
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]
  // ← NEW: "share/stop"
  | [
      "share/stop",
      {
        userid: string;
        withUserId: string;
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ];
