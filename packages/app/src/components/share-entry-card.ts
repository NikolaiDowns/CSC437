// packages/app/src/components/share-entry-card.ts

import { LitElement, html, css } from "lit";
import { customElement, property } from "lit/decorators.js";

// shape of shareInfo (same as before)
interface DataShare {
  withUserId: string;
  mode: "temporary" | "indefinite";
  sharedAt: string;    // ISO date string
  expiresAt?: string;  // ISO date string
}

@customElement("share-entry-card")
export class ShareEntryCard extends LitElement {
  /** The DataShare record for this entry */
  @property({ type: Object }) dataShareinfo!: DataShare;

  static styles = css`
    :host {
      display: block;
      margin-bottom: 1rem;
    }
    .entry-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: var(--color-box, #fff);
      border: 2px solid var(--color-accent, #0353A4);
      border-radius: 8px;
      padding: 0.5rem 1rem;
      box-sizing: border-box;

      /* same width/height style as form-card */
      aspect-ratio: 20 / 1;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .entry-card:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-color: var(--color-primary, #182d3b);
    }
    .info {
      display: flex;
      flex-direction: column;
      color: var(--color-primary, #182d3b);
      font-size: 1rem;
      font-weight: 500;
    }
    .info .until {
      font-size: 0.9rem;
      color: var(--color-secondary, #0353A4);
    }
    button {
      padding: 0.4rem 0.8rem;
      font-size: 0.9rem;
      background: #e74c3c;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      flex-shrink: 0;
    }
    button:hover {
      background: #c0392b;
    }
  `;

  private handleStopClick() {
    // Fire an event so parent can remove this share
    this.dispatchEvent(
      new CustomEvent("stop-share", {
        detail: {
          withUserId: this.dataShareinfo.withUserId,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const info = this.dataShareinfo;
    // Determine text: “Shared Until: …” or “Expired on: …”
    let statusText: string;
    if (info.mode === "temporary" && info.expiresAt) {
      const expires = new Date(info.expiresAt);
      if (expires.getTime() < Date.now()) {
        statusText = `Expired on ${expires.toLocaleDateString()}`;
      } else {
        statusText = `Shared Until: ${expires.toLocaleDateString()}`;
      }
    } else {
      statusText = "Shared Until: Indefinite";
    }

    return html`
      <div class="entry-card">
        <div class="info">
          <span class="username">${info.withUserId}</span>
          <span class="until">${statusText}</span>
        </div>
        <button @click="${this.handleStopClick}">Stop Sharing</button>
      </div>
    `;
  }
}
