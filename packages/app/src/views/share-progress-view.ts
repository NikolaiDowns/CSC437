// packages/app/src/views/share-progress-view.ts

import { define, Form, View, History } from "@calpoly/mustang";
import { html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Model, User } from "../model";
import { Msg } from "../messages";

@customElement("share-progress-view")
export class ShareProgressView extends View<Model, Msg> {
  // ─────── Register <mu-form> with Mustang ────────────────────────────────────
  static uses = define({
    "mu-form": Form.Element
  });

  @state()
  private currentUser?: User;

  constructor() {
    super("truewalk:model");
  }

  override connectedCallback() {
    super.connectedCallback();
    // Tell MVU to load “/api/auth/me” and push the result into model.currentUser
    this.dispatchMessage(["user/load", {}]);
  }

  // Whenever model.currentUser changes, copy it into our local state
  protected updated(_changed: Map<string, any>) {
    super.updated(_changed);
    if (this.model.currentUser && this.model.currentUser !== this.currentUser) {
      this.currentUser = this.model.currentUser;
    }
  }

  /**
   * Called when <mu-form> fires its “mu-form:submit” event.
   *
   * By omitting any `.init=…`, the form fields start blank.  User types
   * into them, and when they hit “Save Share,” this handler sees:
   *   e.detail = { withUserId: string, mode: "indefinite"|"temporary", expiresAt?: string }
   */
  private handleMuFormSubmit(
    e: Form.SubmitEvent<{
      withUserId: string;
      mode: "temporary" | "indefinite";
      expiresAt?: string;
    }>
  ) {
    e.preventDefault();

    if (!this.currentUser) {
      // In theory this shouldn’t happen (we only render the form once
      // currentUser is defined), but just in case:
      return console.warn("No currentUser available!");
    }

    const data = e.detail;
    const trimmedId = data.withUserId.trim();
    if (!trimmedId) {
      return alert("Please enter a valid User ID to share with.");
    }

    // Build exactly the “share” object your server expects:
    const shareObject = {
      withUserId: trimmedId,
      mode: data.mode,
      sharedAt: new Date(),
      // Only set expiresAt if mode === "temporary" and a date string was provided
      expiresAt:
        data.mode === "temporary" && data.expiresAt
          ? new Date(data.expiresAt)
          : undefined
    };

    // Dispatch our “share/save” message (UPDATE handler does the PUT, etc.)
    this.dispatchMessage([
      "share/save",
      {
        userid: this.currentUser.id,
        share: shareObject,
        onSuccess: () => {
          // After a successful PUT, navigate (MVU) to /app/share
          History.dispatch(this, "history/navigate", { href: "/app/share" });
        },
        onFailure: (err: Error) => {
          console.error("Failed to save share:", err);
          alert("Could not save share (check console).");
        }
      }
    ]);
  }

  static styles = css`
    :host {
      display: block;
      padding: 70px 1rem 1rem; /* push content below header */
    }
    mu-form {
      max-width: 360px;
      margin: 0 auto;
      display: grid;
      gap: 0.5rem;
    }
    label {
      display: flex;
      flex-direction: column;
      font-weight: bold;
    }
    input,
    select {
      padding: 0.3rem;
      font-size: 1rem;
      margin-top: 0.2rem;
    }
    button {
      width: 100px;
      padding: 0.4rem;
      margin-top: 1rem;
    }
  `;

  protected createRenderRoot() {
    // Render in light DOM so your global CSS applies
    return this;
  }

  override render() {
    // If currentUser is not yet loaded, show a loading message:
    if (!this.currentUser) {
      return html`<h2>Loading user…</h2>`;
    }

    // Otherwise render our <mu-form> (no .init=… so fields start blank):
    return html`
      <h1>Share Your Progress</h1>

      <mu-form @mu-form:submit=${this.handleMuFormSubmit}>
        <label>
          Share with User ID:
          <input name="withUserId" type="text" required />
        </label>

        <label>
          Mode:
          <select name="mode" required>
            <option value="indefinite">Indefinite</option>
            <option value="temporary">Temporary</option>
          </select>
        </label>

        <label>
          Expires At (for “temporary”):
          <input name="expiresAt" type="date" />
        </label>

        <button type="submit">Save Share</button>
      </mu-form>
    `;
  }
}
