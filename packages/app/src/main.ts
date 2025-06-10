// packages/app/src/main.ts

import { define, Auth, History, Switch, Store } from "@calpoly/mustang";
import "./components/app-header";
import { routes } from "./router";

import { Msg } from "./messages";

import update from "./update";
import { init } from "./model";

console.log("main.ts loaded");

define({
  // Auth context
  "mu-auth": Auth.Provider,

  // History context
  "mu-history": History.Provider,

  // MVU store: pass update, init, and the “truewalk:auth” name so the store can pull Auth.User
  "mu-store": class AppStore extends Store.Provider<typeof init, Msg> {
    constructor() {
      super(update, init, "truewalk:auth");
    }
  },

  // Switch: pass in our routes array, then history + auth context names
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      super(routes as any, "truewalk:history", "truewalk:auth");
      console.log("AppSwitch constructor called");
    }
    protected createRenderRoot() {
      return this; // use styles.css
    }
  },
});

console.log("Components defined (history + auth + store + switch)");
