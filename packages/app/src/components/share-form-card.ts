// packages/app/src/components/share-form-card.ts

import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Form } from "@calpoly/mustang";

@customElement("share-form-card")
export class ShareFormCard extends LitElement {
  // Local reactive state to hold form‐field values:
  @state() private withUserId = "";
  @state() private mode: "temporary" | "indefinite" = "indefinite";
  @state() private expiresAt: string = "";

  static styles = css`
    :host {
      display: block;
      margin-bottom: 1rem;
    }
    .form-card {
      background: var(--color-box, #fff);
      border: 2px solid var(--color-accent, #0353A4);
      border-radius: 8px;
      padding: 1rem;
      max-width: 500px;
      margin: 0 auto 1rem auto;
      box-sizing: border-box;
      aspect-ratio: 20 / 1; /* wide, short rectangle */
      display: flex;
      align-items: center;
      justify-content: center;
    }
    form {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 0.5rem;
      align-items: end;
    }
    label {
      display: flex;
      flex-direction: column;
      font-weight: bold;
      font-size: 0.9rem;
    }
    input,
    select {
      padding: 0.3rem;
      font-size: 1rem;
      margin-top: 0.2rem;
    }
    button {
      padding: 0.5rem 1rem;
      font-size: 1rem;
      background: var(--color-accent, #0353A4);
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background: var(--color-primary, #182d3b);
    }
  `;

  private handleFieldChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.name === "withUserId") {
      this.withUserId = target.value;
    } else if (target.name === "mode") {
      this.mode = target.value as "temporary" | "indefinite";
    } else if (target.name === "expiresAt") {
      this.expiresAt = target.value;
    }
  }

  private submitForm(e: Event) {
    e.preventDefault();
    const trimmedId = this.withUserId.trim();
    if (!trimmedId) {
      return alert("Please enter a valid User ID.");
    }
    // Fire a custom event with the payload
    this.dispatchEvent(
      new CustomEvent("share-submit", {
        detail: {
          withUserId: trimmedId,
          mode: this.mode,
          expiresAt: this.mode === "temporary" && this.expiresAt
            ? this.expiresAt
            : undefined,
        },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="form-card">
        <form @submit="${this.submitForm}">
          <label>
            Share with ID:
            <input
              name="withUserId"
              type="text"
              .value="${this.withUserId}"
              @input="${this.handleFieldChange}"
              required
            />
          </label>

          <label>
            Mode:
            <select
              name="mode"
              .value="${this.mode}"
              @change="${this.handleFieldChange}"
            >
              <option value="indefinite">Indefinite</option>
              <option value="temporary">Temporary</option>
            </select>
          </label>

          <label>
            Expires (if temp):
            <input
              name="expiresAt"
              type="date"
              .value="${this.expiresAt}"
              @change="${this.handleFieldChange}"
              ?disabled="${this.mode !== 'temporary'}"
            />
          </label>

          <button type="submit">Submit</button>
        </form>
      </div>
    `;
  }
}
