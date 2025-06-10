// packages/app/src/views/track-progress-view.ts

import "../components/bar-chart";
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
    super("truewalk:model");
  }

  // Once view is attached, fetch("/api/auth/me"):
  override connectedCallback() {
    super.connectedCallback();
    this.dispatchMessage(["user/load", {}]);
  }

  // Whenever the model changes, check if currentUser has changed:
  protected updated(changedProps: Map<string, any>) {
    super.updated(changedProps);
    // Whenever the store’s model.currentUser becomes non‐undefined
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
    // Show a loading message:
    if (!this.currentUser || !this.currentUser.usage) {
      return html`<h2>Loading usage data…</h2>`;
    }

    // Split number[] array into eight charts:
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
