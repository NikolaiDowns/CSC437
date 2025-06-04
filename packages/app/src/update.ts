// packages/app/src/update.ts

import { Auth, Update } from "@calpoly/mustang";
import { Model } from "./model";
import { Msg } from "./messages";

/**
 * The “update” function is called whenever a message is dispatched.
 *   message: Msg (one of "user/load", "user/set", "user/clear")
 *   apply:   a function to atomically update our Model
 *   user:    an Auth.User object representing the currently authenticated user
 */
export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    case "user/load": {
        const token = localStorage.getItem("token");
            fetch("/api/auth/me", {
                headers: { "Authorization": `Bearer ${token}` },
            })
        .then((response) => {
          if (!response.ok) {
            // if unauthorized or expired, clear out currentUser:
            apply((model) => {
              const newModel: Model = { ...model };
              delete newModel.currentUser;
              return newModel;
            });
            return undefined;
          }
          return response.json();
        })
        .then((json: any | undefined) => {
          if (!json) return;
          // 2) Once we have the JSON, dispatch “user/set” by applying it:
          const loadedUser = json as Model["currentUser"];
          apply((model) => ({ ...model, currentUser: loadedUser }));
        })
        .catch((err) => {
          console.error("Error loading user in update():", err);
          // On network error, also clear currentUser:
          apply((model) => {
            const copy = { ...model };
            delete copy.currentUser;
            return copy;
          });
        });
      break;
    }

    case "user/set": {
      // We already set currentUser inside the "user/load" logic above.
      // But if you ever dispatch ["user/set", { user: … }], you can also handle it here:
      const { user: newUser } = message[1];
      apply((model) => ({ ...model, currentUser: newUser }));
      break;
    }

    case "user/clear": {
      // Logged-out → remove currentUser
      apply((model) => {
        const next = { ...model };
        delete next.currentUser;
        return next;
      });
      break;
    }

    default: {
      // This “never” check ensures we covered every Msg.  If you add new Msg variants,
      // TypeScript will error here until you add a matching case above.
      const _exhaustiveCheck: never = message[0];
      throw new Error(`Unhandled message "${_exhaustiveCheck}"`);
    }
  }
}
