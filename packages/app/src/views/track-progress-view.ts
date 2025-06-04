// packages/app/src/views/track-progress-view.ts

import "../components/bar-chart";      // <–– MAKE SURE bar-chart is imported so <bar-chart> is defined
import { View } from "@calpoly/mustang";
import { html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Model, User } from "../model";
import { Msg } from "../messages";

@customElement("track-progress-view")
export class TrackProgressView extends View<Model, Msg> {
  @state()
  private currentUser?: User;

  constructor() {
    // ← Must match exactly <mu-store provides="truewalk:model">
    super("truewalk:model");
  }

  // As soon as the view is first attached, dispatch "user/load" to trigger update() → fetch("/api/auth/me"):
  override connectedCallback() {
    super.connectedCallback();
    this.dispatchMessage(["user/load", {}]);
  }

  // Remove the changedProps.has("model") guard—just compare model.currentUser every time:
  protected updated(changedProps: Map<string, any>) {
    super.updated(changedProps);
    // Whenever the store’s model.currentUser becomes non‐undefined and differs from our local state:
    if (this.model.currentUser !== this.currentUser) {
      this.currentUser = this.model.currentUser;
    }
  }

  static styles = css`
    :host {
      display: block;
      padding-top: 70px; /* to clear the fixed header */
    }
  `;

  protected createRenderRoot() {
    return this;
  }

  override render() {
    // Until `this.currentUser.usage` is really set, show a loading message:
    if (!this.currentUser || !this.currentUser.usage) {
      return html`<h2>Loading usage data…</h2>`;
    }

    // Now that we have a full `usage: number[]` array, split it into the eight charts:
    const usage = this.currentUser.usage;
    const SIZES = [24, 24, 7, 7, 31, 31, 12, 12];
    const VARIANTS: ("day" | "week" | "month" | "year")[] = [
      "day",
      "day",
      "week",
      "week",
      "month",
      "month",
      "year",
      "year",
    ];

    let offset = 0;
    // Build each <bar-chart> slot in order:
    const charts = SIZES.map((count, i) => {
      const slice = usage.slice(offset, offset + count);
      offset += count;
      const variant = VARIANTS[i];
      return html`
        <div class="box graph chart-slot">
          <bar-chart .data="${slice}" unit="lbs" variant="${variant}"></bar-chart>
        </div>
      `;
    });

    return html`
      <main class="container">
        <div class="row">${charts.slice(0, 2)}</div>
        <div class="row">${charts.slice(2, 4)}</div>
        <div class="row">${charts.slice(4, 6)}</div>
        <div class="row">${charts.slice(6, 8)}</div>
      </main>
    `;
  }
}
