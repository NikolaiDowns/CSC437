// packages/app/src/views/share-progress-view.ts

import "../components/share-form-card";   // Registers <share-form-card>
import "../components/share-entry-card";  // Registers <share-entry-card>
import { define, View, History } from "@calpoly/mustang";
import { html, css } from "lit";
import { customElement, state } from "lit/decorators.js";

import { Model, User, DataShare as DataShareString } from "../model"; 
import { Msg } from "../messages";

/**
 * DataShareString is the front-end’s “string‐based” share record:
 * (withUserId, mode, sharedAt: string, expiresAt?: string).
 * We only use it to read from currentUser.shares[], which indeed
 * stores ISO‐date strings. But when dispatching “share/save” we
 * build a separate object that has Date instances.
 */
@customElement("share-progress-view")
export class ShareProgressView extends View<Model, Msg> {
  static uses = define({});

  @state() private currentUser?: User;

  constructor() {
    super("truewalk:model");
  }

  override connectedCallback() {
    super.connectedCallback();
    // Trigger “user/load” → fetch "/api/auth/me" → populate currentUser (with .shares[])
    this.dispatchMessage(["user/load", {}]);
  }

  protected updated(_changed: Map<string, any>) {
    super.updated(_changed);
    if (this.model.currentUser && this.model.currentUser !== this.currentUser) {
      this.currentUser = this.model.currentUser;
    }
  }

  // Fired by <share-form-card> with { withUserId: string; mode: "temporary"|"indefinite"; expiresAt?: string }
  private handleNewShare(
    e: CustomEvent<{
      withUserId: string;
      mode: "temporary" | "indefinite";
      expiresAt?: string;
    }>
  ) {
    const shareData = e.detail;
    if (!this.currentUser) return;

    // Build a plain JS object that exactly matches Msg["share/save"]’s “share” shape:
    //   { withUserId: string; mode: "temporary"|"indefinite"; sharedAt: Date; expiresAt?: Date; }
    const shareObject = {
      withUserId: shareData.withUserId,
      mode: shareData.mode,
      sharedAt: new Date(), // <-- Date, not string
      expiresAt:
        shareData.mode === "temporary" && shareData.expiresAt
          ? new Date(shareData.expiresAt) // convert ISO string→Date
          : undefined,
    };

    // Dispatch “share/save” (which your update() already handles):
    this.dispatchMessage([
      "share/save",
      {
        userid: this.currentUser.id,
        share: shareObject,
        onSuccess: () => {
          // once saved, reload /app/share so the list updates
          History.dispatch(this, "history/navigate", { href: "/app/share" });
        },
        onFailure: (err: Error) => {
          console.error("Failed to save share:", err);
          alert("Could not save share (see console).");
        },
      },
    ]);
  }

  // Fired by <share-entry-card> with { withUserId: string }
  private handleStopShare(e: CustomEvent<{ withUserId: string }>) {
    const targetId = e.detail.withUserId;
    if (!this.currentUser) return;

    // Since you said “there is no share/stop yet,” we’ll just console.log here.
    // If you do add a “share/stop” Msg + update() logic, you can dispatch it here:
    console.log("Stop sharing with:", targetId);

    // Example stub for future “share/stop”:
    // this.dispatchMessage([
    //   "share/stop",
    //   {
    //     userid: this.currentUser.id,
    //     withUserId: targetId,
    //     onSuccess: () => {
    //       History.dispatch(this, "history/navigate", { href: "/app/share" });
    //     },
    //     onFailure: (err: Error) => {
    //       console.error("Failed to stop share:", err);
    //       alert("Could not stop sharing (see console).");
    //     },
    //   },
    // ]);
  }

  static styles = css`
    :host {
      display: block;
      padding: 70px 1rem 1rem; /* push content below fixed header */
    }
    h1 {
      margin-bottom: 1rem;
      color: var(--color-primary, #182d3b);
    }
    .entries {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  `;

  protected createRenderRoot() {
    // Render in light DOM so that your global CSS variables still apply
    return this;
  }

  override render() {
    // If not loaded, show placeholder
    if (!this.currentUser) {
      return html`<h2>Loading user…</h2>`;
    }

    // (1) The “new‐share” form up top:
    const formSection = html`
      <share-form-card @share-submit="${this.handleNewShare}"></share-form-card>
    `;

    // (2) If there are no active shares, show text
    if (!this.currentUser.shares || this.currentUser.shares.length === 0) {
      return html`
        <h1>Share Your Progress</h1>
        ${formSection}
        <h2>You are not sharing with anyone right now.</h2>
      `;
    }

    // (3) Otherwise, render one <share-entry-card> per share in currentUser.shares[]
    const listSection = html`
      <div class="entries">
        ${this.currentUser.shares.map(
          (sh: DataShareString) => html`
            <share-entry-card
              .dataShareinfo="${{
                withUserId: sh.withUserId,
                mode: sh.mode,
                sharedAt: sh.sharedAt,
                expiresAt: sh.expiresAt,
              }}"
              @stop-share="${this.handleStopShare}"
            ></share-entry-card>
          `
        )}
      </div>
    `;

    return html`
      <h1>Share Your Progress</h1>
      ${formSection}
      ${listSection}
    `;
  }
}
