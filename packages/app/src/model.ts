// packages/app/src/model.ts

/**
 *  In our server, User looks like this:
 *  export interface User {
 *    id: string;
 *    name: string;
 *    tocAccepted: boolean;
 *    tocVersion?: string;
 *    tocTimestamp?: Date;
 *    shares?: DataShare[];     // we can ignore DataShare for now
 *    usage?: number[];         // this is the array of length 24+7+31+12
 *    isDeleted?: boolean;
 *    deletedAt?: Date;
 *  }
 *
 *  Here in the app, we only need the same shape for `User`. 
 *  (We do not yet need DataShare or other fields, 
 *   but it’s okay if your server’s interface has extra fields.)
 */
export interface User {
    id: string;
    name: string;
    tocAccepted: boolean;
    tocVersion?: string;
    tocTimestamp?: Date;
    shares?: any[];   // you can tighten up this type later if you like
    usage?: number[];
    isDeleted?: boolean;
    deletedAt?: Date;
  }
  
  /** 
   * Our app‐wide Model.  Eventually, you might add more pieces of state,
   * but for “Lab 14” we just need a single `currentUser?: User`. 
   */
  export interface Model {
    currentUser?: User;
  }
  
  /** 
   * We initialize with an empty Model.  That means `currentUser` starts undefined,
   * so the view will render a “Loading…” placeholder until we fetch it.
   */
  export const init: Model = {};
  