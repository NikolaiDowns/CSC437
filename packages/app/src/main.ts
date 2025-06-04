// packages/app/src/main.ts

import { define, Auth, History, Switch, Store } from "@calpoly/mustang";
import "./components/app-header";
import { routes } from "./router";

// ← Import Msg so Store.Provider<… , Msg> compiles
import { Msg } from "./messages";

// ← Import update & init so we can give them to the store:
import update from "./update";
import { init } from "./model";

console.log("main.ts loaded");

define({
  // 1) Auth context
  "mu-auth": Auth.Provider,

  // 2) History context
  "mu-history": History.Provider,

  // 3) MVU store: pass update, init, and the “truewalk:auth” name so the store can pull Auth.User
  "mu-store": class AppStore extends Store.Provider<typeof init, Msg> {
    constructor() {
      super(update, init, "truewalk:auth");
    }
  },

  // 4) Switch: pass in our routes array, then history + auth context names
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes as any, "truewalk:history", "truewalk:auth");
      console.log("AppSwitch constructor called");
    }
    protected createRenderRoot() {
      return this; // render into light DOM so global CSS applies
    }
  },
});

console.log("Components defined (history + auth + store + switch)");
