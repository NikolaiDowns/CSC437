//server/src/models/user.ts
export interface DataShare {
    withUserId: string;              // the other user’s id
    mode: 'temporary' | 'indefinite';// one‐off share or open‐ended
    sharedAt: Date;                  // when this share was granted
    expiresAt?: Date;                // only for temporary shares
  }

export interface User {
    id: string;
    name: string;
  
    // current toc consent
    tocAccepted: boolean;
    tocVersion?: string;
    tocTimestamp?: Date;
  
    shares?: DataShare[];   // Every person this user is sharing data with
    receives?: DataShare[]; // Every person this user is receiving data from
    usage?: number[];       // Users data
    isDeleted?: boolean;
    deletedAt?: Date;
  }
  