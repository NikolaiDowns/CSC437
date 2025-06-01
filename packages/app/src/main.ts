// packages/app/src/main.ts
import { define, Auth, History, Switch } from "@calpoly/mustang";
import "./components/app-header";
import { routes } from "./router";

console.log("main.ts loaded");

define({
  // 1) Provide Auth context (exactly as in your proto)
  "mu-auth": Auth.Provider,

  // 2) Provide History context exactly as before
  "mu-history": History.Provider,

  // 3) Provide Switch, telling it to use both history + auth
  "mu-switch": class AppSwitch extends Switch.Element {
    constructor() {
      // Must list 'truewalk:history' *then* 'truewalk:auth'
      super(routes as any, "truewalk:history", "truewalk:auth");
      console.log("AppSwitch constructor called");
    }
    protected createRenderRoot() {
      // Opt out of Shadow DOM so global CSS applies
      return this;
    }
  },
});

console.log("Components defined (history + auth)");
