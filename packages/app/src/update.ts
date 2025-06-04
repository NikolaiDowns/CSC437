// packages/app/src/update.ts

import { Auth, Update } from "@calpoly/mustang";
import { Model, User } from "./model";
import { Msg } from "./messages";

/**
 * The “update” function is called whenever a message is dispatched.
 *   - message: Msg (one of "user/load", "user/set", "user/clear", "share/save")
 *   - apply:   a function to atomically update our Model
 *   - user:    an Auth.User object representing the currently authenticated user
 */
export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  user: Auth.User
) {
  switch (message[0]) {
    //
    // ─── SHARE/SAVE ────────────────────────────────────────────────────────────────
    //
    // When the view dispatches ["share/save", { userid, share, onSuccess, onFailure }]
    // we need to:
    //   1) Grab the existing full User from the MVU store (model.currentUser).
    //   2) Build a brand-new User object whose `shares` array = oldShares + new share.
    //   3) PUT that entire new User to /api/users/:userid (server expects a full User).
    //   4) When the server replies with 200 + JSON(updatedUser), apply(updatedUser) back to the store.
    //   5) Call onSuccess() or onFailure(err) as appropriate.
    //
    case "share/save": {
      // 1) Extract payload:
      const { userid, share, onSuccess, onFailure } = message[1];

      // 2) Synchronously read the entire Model (so we can reach model.currentUser).
      //    We do a “no-op” apply that simply copies m → m, but captures the old model in `current`.
      let current: Model | undefined;
      apply((m) => {
        current = m;
        return m;
      });

      // If there is no currentUser in the model, we cannot proceed:
      if (!current || !current.currentUser) {
        const err = new Error("No loaded user to update shares");
        console.error(err);
        if (onFailure) onFailure(err);
        break;
      }

      const originalUser: User = current.currentUser;
      // 3) Compute the new shares array:
      const prevShares: User["shares"] = Array.isArray(originalUser.shares)
        ? originalUser.shares
        : [];

      const updatedShares = [...prevShares, share];

      // 4) Build a brand-new `User` object (do not mutate `originalUser` in place):
      const userToSend: User = {
        ...originalUser,
        shares: updatedShares,
      };

      // 5) Perform the PUT to /api/users/:userid:
      fetch(
        "http://localhost:3000/api/users/" + encodeURIComponent(userid),
        {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...Auth.headers(user), // send JWT so the server’s authenticateUser middleware passes
        },
        body: JSON.stringify(userToSend),
      })
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            // If the server returns 4xx/5xx, treat that as a failure:
            throw new Error(`Failed to save share for ${userid}`);
          }
        })
        .then((json: unknown) => {
          // 6) The server replies with the updated User JSON:
          const updatedUser = json as User;

          // 7) Apply the updatedUser back into the MVU store:
          apply((model) => ({
            ...model,
            currentUser: updatedUser,
          }));

          // 8) Finally, call onSuccess (if provided):
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
      const token = localStorage.getItem("token");
      fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (!response.ok) {
            // If token invalid/expired, clear currentUser:
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
          // Once we have the JSON User from the server, apply it to the store:
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
