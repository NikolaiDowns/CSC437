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
  
    shares?: DataShare[];
    usage?: number[];
    isDeleted?: boolean;
    deletedAt?: Date;
  }
  