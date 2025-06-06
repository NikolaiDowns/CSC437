// packages/app/src/model.ts


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
  