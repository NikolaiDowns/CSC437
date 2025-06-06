// packages/app/src/update.ts

import { Update } from "@calpoly/mustang";
import { Model, User } from "./model";
import { Msg } from "./messages";

export default function update(
  message: Msg,
  apply: Update.ApplyMap<Model>,
  _user: any
) {
  switch (message[0]) {
    //
    // ─── SHARE/SAVE ────────────────────────────────────────────────────────────────
    //
    case "share/save": {
      const {
        userid, // the logged‐in user’s ID (originalUser.id)
        share,
        onSuccess,
        onFailure,
      } = message[1];

      let current: Model | undefined;
      apply((m) => {
        current = m;
        return m; // just capture `m`—no changes yet
      });

      if (!current || !current.currentUser) {
        const err = new Error("No loaded user to update shares");
        console.error(err);
        if (onFailure) onFailure(err);
        break;
      }

      const originalUser: User = current.currentUser;
      const rawToken = localStorage.getItem("token") || "";

      // Instead of do a full PUT /users/:id, we now call POST /users/:id/share
      fetch(
        `http://localhost:3000/api/users/${encodeURIComponent(
          originalUser.id
        )}/share`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${rawToken}`,
          },
          body: JSON.stringify(share), // MUST include { withUserId, mode, sharedAt, expiresAt? }
        }
      )
        .then((res) => {
          if (res.status === 200) {
            return res.json();
          } else {
            throw new Error(
              `Failed to save share for ${originalUser.id}, status ${res.status}`
            );
          }
        })
        .then((json: unknown) => {
          const updatedUser = json as User;
          // 6) Update the MVU state with the updated sharer (so shares[] is up to date)
          apply((model) => ({
            ...model,
            currentUser: updatedUser,
          }));
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
      fetch("http://localhost:3000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (!response.ok) {
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
