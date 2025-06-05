// packages/app/src/update.ts

import { Update } from "@calpoly/mustang";
import { Model, User } from "./model";
import { Msg } from "./messages";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  _user: any // we don’t use Mustang’s Auth.User here because we read the JWT manually
) {
  switch (message[0]) {
    //
    // ─── SHARE/SAVE ────────────────────────────────────────────────────────────────
    //
    case "share/save": {
      const {
        userid,     // this is the *logged-in* user’s ID (originalUser.id)
        share,
        onSuccess,
        onFailure,
      } = message[1];

      // 1) Read the current Model synchronously so we can grab model.currentUser
      let current: Model | undefined;
      apply((m) => {
        current = m;
        return m; // no changes—just capture `m`
      });

      if (!current || !current.currentUser) {
        const err = new Error("No loaded user to update shares");
        console.error(err);
        if (onFailure) onFailure(err);
        break;
      }

      const originalUser: User = current.currentUser;
      const prevShares: User["shares"] = Array.isArray(originalUser.shares)
        ? originalUser.shares
        : [];

      // 2) Build a brand-new shares array:
      const updatedShares = [...prevShares, share];

      // 3) Copy originalUser into a new object with shares replaced:
      const userToSend: User = {
        ...originalUser,
        shares: updatedShares,
      };

      // 4) Read the raw JWT from localStorage:
      const rawToken = localStorage.getItem("token") || "";

      // 5) PUT the entire user document (including updated shares) back to the server
      fetch(
        `http://localhost:3000/api/users/${encodeURIComponent(
          originalUser.id
        )}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${rawToken}`,
          },
          body: JSON.stringify(userToSend),
        }
      )
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            throw new Error(`Failed to save share for ${originalUser.id}`);
          }
        })
        .then((json: unknown) => {
          const updatedUser = json as User;
          // 6) Apply the updated user back into the MVU store:
          apply((model) => ({
            ...model,
            currentUser: updatedUser,
          }));
          // 7) Call onSuccess():
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
      // ← Here is the change: point at port 3000 (not Vite’s port 5173)
      fetch("http://localhost:3000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (!response.ok) {
            // invalid/expired token → clear out currentUser
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
