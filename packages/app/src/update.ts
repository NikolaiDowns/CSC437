// packages/app/src/update.ts

import { Update } from "@calpoly/mustang";
import { Model, User } from "./model";
import { Msg } from "./messages";

/**
 * The “update” function is called whenever a message is dispatched.
 *   - message: Msg (one of "user/load", "user/set", "user/clear", "share/save")
 *   - apply:   a function to atomically update our Model
 *   - user:    an Auth.User object (ignored here, since we read JWT directly)
 */
export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  _user: any // we won’t use Mustang’s Auth.User in this routine
) {
  switch (message[0]) {
    //
    // ─── SHARE/SAVE ────────────────────────────────────────────────────────────────
    //
    case "share/save": {
      // 1) Extract payload
      const { userid /* “withUserId”, i.e. the person we are sharing to */,
              share,
              onSuccess,
              onFailure } = message[1];

      // 2) Read the current Model synchronously so we can grab model.currentUser
      let current: Model | undefined;
      apply((m) => {
        current = m;
        return m; // no-op, just capture `m`
      });

      if (!current || !current.currentUser) {
        const err = new Error("No loaded user to update shares");
        console.error(err);
        if (onFailure) onFailure(err);
        break;
      }

      // 3) “originalUser” is the logged-in user document (that we will update)
      const originalUser: User = current.currentUser;

      // 4) Build a brand-new shares array:
      const prevShares: User["shares"] = Array.isArray(originalUser.shares)
        ? originalUser.shares
        : [];
      const updatedShares = [...prevShares, share];

      // 5) Construct a new “full User” object (do NOT mutate originalUser in place):
      const userToSend: User = {
        ...originalUser,
        shares: updatedShares,
      };

      // 6) Pull the raw JWT out of localStorage (must match the one set at login)
      const rawToken = localStorage.getItem("token") || "";

      // 7) Issue a PUT to /api/users/<the-logged-in-user-id>
      //    (we PUT our entire “full User” document, including updated shares)
      fetch(
        `http://localhost:3000/api/users/${encodeURIComponent(originalUser.id)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // here we send a plain Authorization header with the JWT
            Authorization: `Bearer ${rawToken}`,
          },
          body: JSON.stringify(userToSend),
        }
      )
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            // any 4xx/5xx → treat it as a failure
            throw new Error(`Failed to save share for ${originalUser.id}`);
          }
        })
        .then((json: unknown) => {
          // 8) Server gives us back the updated User JSON; apply it to the store
          const updatedUser = json as User;
          apply((model) => ({
            ...model,
            currentUser: updatedUser,
          }));

          // 9) Finally, call onSuccess() if one was provided
          if (onSuccess) onSuccess();
        })
        .catch((err: Error) => {
          console.error("Error in share/save:", err);
          if (onFailure) onFailure(err);
        });

      break;
    }

    //
    // ─── USER/LOAD ───────────────────────────────────────────────────────────────────
    //
    case "user/load": {
      const token = localStorage.getItem("token") || "";
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (!response.ok) {
            // invalid/expired token → clear currentUser
            apply((model) => {
              const next = { ...model };
              delete next.currentUser;
              return next;
            });
            return undefined;
          }
          return response.json();
        })
        .then((json: any | undefined) => {
          if (!json) return;
          const loadedUser = json as Model["currentUser"];
          apply((model) => ({ ...model, currentUser: loadedUser }));
        })
        .catch((err) => {
          console.error("Error loading user:", err);
          // on network error, also clear currentUser
          apply((model) => {
            const copy = { ...model };
            delete copy.currentUser;
            return copy;
          });
        });
      break;
    }

    //
    // ─── USER/SET ────────────────────────────────────────────────────────────────────
    //
    case "user/set": {
      const { user: newUser } = message[1];
      apply((model) => ({ ...model, currentUser: newUser }));
      break;
    }

    //
    // ─── USER/CLEAR ──────────────────────────────────────────────────────────────────
    //
    case "user/clear": {
      apply((model) => {
        const next = { ...model };
        delete next.currentUser;
        return next;
      });
      break;
    }

    //
    // ─── EXHAUSTIVE CHECK ─────────────────────────────────────────────────────────────
    //
    default: {
      const _exhaustiveCheck: never = message[0];
      throw new Error(`Unhandled message "${_exhaustiveCheck}"`);
    }
  }
}
