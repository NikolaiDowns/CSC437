// packages/app/src/views/share-progress-view.ts

import "../components/share-form-card";   // <share-form-card> emits "share-submit"
import "../components/share-entry-card";  // <share-entry-card> emits "stop-share"
import { define, View, History } from "@calpoly/mustang";
import { html, css } from "lit";
import { customElement, state } from "lit/decorators.js";

import { Model, User, DataShare as DataShareString } from "../model";
import { Msg } from "../messages";

@customElement("share-progress-view")
export class ShareProgressView extends View<Model, Msg> {
  static uses = define({});

  @state() private currentUser?: User;

  constructor() {
    super("truewalk:model");
  }

  override connectedCallback() {
    super.connectedCallback();
    this.dispatchMessage(["user/load", {}]);
  }

  protected updated(_changed: Map<string, any>) {
    super.updated(_changed);
    if (this.model.currentUser && this.model.currentUser !== this.currentUser) {
      this.currentUser = this.model.currentUser;
    }
  }

  // Fired when <share-form-card> does “@share-submit”
  private handleNewShare(
    e: CustomEvent<{
      withUserId: string;
      mode: "temporary" | "indefinite";
      expiresAt?: string;
    }>
  ) {
    const shareData = e.detail;
    if (!this.currentUser) return;

    // Build the object that matches Msg["share/save"]
    const shareObject = {
      withUserId: shareData.withUserId,
      mode: shareData.mode,
      sharedAt: new Date(),
      expiresAt:
        shareData.mode === "temporary" && shareData.expiresAt
          ? new Date(shareData.expiresAt)
          : undefined,
    };

    this.dispatchMessage([
      "share/save",
      {
        userid: this.currentUser.id,
        share: shareObject,
        onSuccess: () => {
          History.dispatch(this, "history/navigate", { href: "/app/share" });
        },
        onFailure: (err: Error) => {
          console.error("Failed to save share:", err);
          alert("Could not save share (see console).");
        },
      },
    ]);
  }

  // Fired when <share-entry-card> does “@stop-share”
  private handleStopShare(e: CustomEvent<{ withUserId: string }>) {
    const targetId = e.detail.withUserId;
    if (!this.currentUser) return;

    // Dispatch the new "share/stop" message:
    this.dispatchMessage([
      "share/stop",
      {
        userid: this.currentUser.id,
        withUserId: targetId,
        onSuccess: () => {
          // the MVU store is already updated by update()
        },
        onFailure: (err: Error) => {
          console.error("Failed to stop share:", err);
          alert("Could not stop sharing (see console).");
        },
      },
    ]);
  }

  static styles = css`
    :host {
      display: block;
      padding: 70px 1rem 1rem;
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
    return this; // render in light DOM
  }

  override render() {
    if (!this.currentUser) {
      return html`<h2>Loading user…</h2>`;
    }

    // Show the "new share" form at top:
    const formSection = html`
      <share-form-card @share-submit="${this.handleNewShare}"></share-form-card>
    `;

    // If no shares exist, show placeholder text:
    if (!this.currentUser.shares || this.currentUser.shares.length === 0) {
      return html`
        <h1>Share Your Progress</h1>
        ${formSection}
        <h2>You are not sharing with anyone right now.</h2>
      `;
    }

    // Otherwise, list each share‐entry with a "Stop Sharing" button
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
