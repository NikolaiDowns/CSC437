// packages/app/src/views/share-progress-view.ts

import { View } from "@calpoly/mustang";
import { html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Model, User } from "../model";
import { Msg } from "../messages";
import { History } from "@calpoly/mustang";

@customElement("share-progress-view")
export class ShareProgressView extends View<Model, Msg> {
  @state()
  private currentUser?: User;

  // form fields
  private withUserId = "";
  private mode: "temporary" | "indefinite" = "indefinite";
  private expiresAt: Date | undefined;

  constructor() {
    super("truewalk:model");
  }

  override connectedCallback() {
    super.connectedCallback();
    // Trigger loading currentUser if not already loaded
    this.dispatchMessage(["user/load", {}]);
  }

  // Whenever the store updates the user in the model, grab it locally:
  protected updated(changed: Map<string, any>) {
    super.updated(changed);
    if (this.model.currentUser && this.model.currentUser !== this.currentUser) {
      this.currentUser = this.model.currentUser;
    }
  }

  private onWithUserIdChange(e: InputEvent) {
    const input = e.target as HTMLInputElement;
    this.withUserId = input.value;
  }

  private onModeChange(e: InputEvent) {
    const select = e.target as HTMLSelectElement;
    this.mode = select.value as "temporary" | "indefinite";
    if (this.mode === "indefinite") {
      this.expiresAt = undefined; // clear out any old date
    }
  }

  private onExpiresAtChange(e: InputEvent) {
    const input = e.target as HTMLInputElement;
    this.expiresAt = input.value ? new Date(input.value) : undefined;
  }

  private handleSubmit(e: Event) {
    e.preventDefault();
    if (!this.currentUser) {
      return; // shouldn’t happen—but guard anyway
    }
    const userId = this.currentUser.id;

    this.dispatchMessage([
        "share/save",
        {
          userid: this.withUserId.trim(),
          share: {
            withUserId: this.withUserId.trim(),
            mode: this.mode,
            sharedAt: new Date(),
            expiresAt: this.mode === "temporary" ? this.expiresAt : undefined,
          },
          onSuccess: () => {
            History.dispatch(this, "history/navigate", { href: "/app/track" });
          },
          onFailure: (err: Error) => {
            console.error("Failed to save share:", err);
          },
        },
      ]);
  }

  static styles = css`
    :host {
      display: block;
      padding: 70px 1rem 1rem; /* push content below the fixed header */
    }
    form {
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
    }
  `;

  protected createRenderRoot() {
    return this; // render into light DOM so global styles apply
  }

  override render() {
    if (!this.currentUser) {
      return html`<h2>Loading user…</h2>`;
    }

    return html`
      <h1>Share Your Progress</h1>
      <form @submit=${this.handleSubmit}>
        <label>
          Share with User ID:
          <input
            type="text"
            .value=${this.withUserId}
            @input=${this.onWithUserIdChange}
            required
          />
        </label>

        <label>
          Mode:
          <select @change=${this.onModeChange}>
            <option value="indefinite" ?selected=${this.mode === "indefinite"}>
              Indefinite
            </option>
            <option value="temporary" ?selected=${this.mode === "temporary"}>
              Temporary
            </option>
          </select>
        </label>

        ${this.mode === "temporary"
          ? html`
              <label>
                Expires At (only for “temporary”):
                <input
                  type="date"
                  .value=${this.expiresAt
                    ? this.expiresAt.toISOString().substr(0, 10)
                    : ""}
                  @change=${this.onExpiresAtChange}
                  required
                />
              </label>
            `
          : null}

        <button type="submit">Save Share</button>
      </form>
    `;
  }
}
