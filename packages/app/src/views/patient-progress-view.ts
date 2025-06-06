// packages/app/src/views/patient-progress-view.ts

import { define, View, History, Form } from "@calpoly/mustang";
import { html, css } from "lit";
import { customElement, state } from "lit/decorators.js";

import { Model, User } from "../model";
import { Msg } from "../messages";

// ────────────────────────────────────────────────────────────────────────────────
// Helper type to pair a User’s info + the DataShare that brought them here.
// (We attach the DataShare so we can show “mode” / “sharedAt” if you want.)
// ────────────────────────────────────────────────────────────────────────────────
interface SharerWithShare extends User {
  shareInfo: {
    withUserId: string;
    mode: "temporary" | "indefinite";
    sharedAt: string;   // JSON‐serialized date string
    expiresAt?: string; // JSON‐serialized date string (optional)
  };
}

@customElement("patient-progress-view")
export class PatientProgressView extends View<Model, Msg> {
  // ─────── Register any Mustang components (none needed here) ────────────────────
  static uses = define({});

  // ────────────────────────────────────────────────────────────────────────────────
  // Local reactive state:
  //   - `currentUser` is copied from `model.currentUser` (once loaded)
  //   - `sharers` is the array of “User + share metadata” that we will fetch
  // ────────────────────────────────────────────────────────────────────────────────
  @state() private currentUser?: User;
  @state() private sharers: SharerWithShare[] = [];

  constructor() {
    super("truewalk:model");
  }

  override connectedCallback() {
    super.connectedCallback();
    // 1) Ask Mustang to load “/api/auth/me” so model.currentUser is populated
    this.dispatchMessage(["user/load", {}]);
  }

  protected updated(_changed: Map<string, any>) {
    super.updated(_changed);

    // 2) Once `model.currentUser` is defined and differs from local `currentUser`,
    //    copy it into local state and then trigger `loadSharers()`.
    if (
      this.model.currentUser &&
      this.model.currentUser !== this.currentUser
    ) {
      this.currentUser = this.model.currentUser;
      this.loadSharers(); // fetch each sharer’s usage[], etc.
    }
  }

  /**
   * Fetch each person who is sharing *to* the current user.
   * We look at `currentUser.receives[]`, which is a list of
   * { withUserId, mode, sharedAt, expiresAt? }. For each `withUserId`,
   * we fetch that user’s document from `/api/users/:withUserId`,
   * then combine it with the `shareInfo` so that we can display
   * both “User ID” + “usage[]” + “mode/sharedAt” if desired.
   */
  private async loadSharers() {
    if (!this.currentUser?.receives || this.currentUser.receives.length === 0) {
      this.sharers = [];
      return;
    }

    // Make a parallel fetch for each shareer’s full user doc:
    const token = localStorage.getItem("token") || "";

    const promises = this.currentUser.receives.map(async (shareRecord) => {
      // 1) Fetch the full user document for shareRecord.withUserId
      const resp = await fetch(
        `http://localhost:3000/api/users/${encodeURIComponent(
          shareRecord.withUserId
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!resp.ok) {
        // If that user doesn’t exist (404) or we get another error,
        // we’ll still return a “stub” so the UI doesn’t crash.
        console.error(
          `Could not fetch user ${shareRecord.withUserId}: status ${resp.status}`
        );
        return {
          id: shareRecord.withUserId,
          name: "(unknown)",
          tocAccepted: false,
          usage: [],
          shareInfo: { ...shareRecord },
        } as SharerWithShare;
      }

      const thatUser = (await resp.json()) as User;

      // 2) Return a combined object:
      return {
        // Copy everything from thatUser:
        ...thatUser,
        // Append the share metadata:
        shareInfo: {
          withUserId: shareRecord.withUserId,
          mode: shareRecord.mode,
          sharedAt: shareRecord.sharedAt.toString(),
          expiresAt: shareRecord.expiresAt?.toString(),
        },
      } as SharerWithShare;
    });

    // 3) Wait for all fetches to finish (or fail):
    const results = await Promise.all(promises);

    // 4) Store into local state so Lit re‐renders:
    this.sharers = results;
  }

  static styles = css`
    :host {
      display: block;
      padding: 70px 1rem 1rem; /* push content below header */
    }
    h1 {
      margin-bottom: 1rem;
    }
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      border: 1px solid var(--color-muted);
      border-radius: 4px;
      margin-bottom: 0.75rem;
      padding: 0.5rem 1rem;
    }
    .share-info {
      font-size: 0.9rem;
      color: var(--color-secondary);
      margin-bottom: 0.5rem;
    }
    .usage-list {
      font-family: monospace;
      white-space: pre-wrap;
      margin-top: 0.25rem;
    }
  `;

  protected createRenderRoot() {
    // Render in light DOM so your app.css / global CSS applies
    return this;
  }

  override render() {
    // 1) If we haven’t yet loaded `model.currentUser`, show a placeholder:
    if (!this.currentUser) {
      return html`<h2>Loading your profile…</h2>`;
    }

    // 2) If no one is sharing with them:
    if (!this.sharers || this.sharers.length === 0) {
      return html`<h2>No one is currently sharing data with you.</h2>`;
    }

    // 3) Otherwise render a list of sharers + their usage[]:
    return html`
      <h1>People Sharing Their Progress with You</h1>
      <ul>
        ${this.sharers.map(
          (sh) => html`
            <li>
              <div><strong>User ID:</strong> ${sh.id}</div>
              <div><strong>Name:</strong> ${sh.name}</div>
              <div class="share-info">
                <em>Mode:</em> ${sh.shareInfo.mode}
                &nbsp;|&nbsp;
                <em>Shared At:</em>
                ${new Date(sh.shareInfo.sharedAt).toLocaleString()}
                ${sh.shareInfo.mode === "temporary" &&
                sh.shareInfo.expiresAt
                  ? html`
                      <br />
                      <em>Expires At:</em>
                      ${new Date(sh.shareInfo.expiresAt).toLocaleDateString()}
                    `
                  : ""}
              </div>
              <div class="usage-list">
                <strong>Usage Array:</strong><br />
                ${sh.usage && sh.usage.length > 0
                  ? html`${sh.usage.join(", ")}`
                  : html`(no usage data)`}
              </div>
            </li>
          `
        )}
      </ul>
    `;
  }
}
