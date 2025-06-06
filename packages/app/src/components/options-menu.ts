// packages/app/src/components/options-menu.ts

import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("options-menu")
export class OptionsMenu extends LitElement {
  // Render into Light DOM so that our embedded <style> actually applies
  protected createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <style>
        .options-container {
          position: relative;
          display: inline-block;
          font-family: 'Open Sans', sans-serif;
          font-weight: 600;
          color: var(--link-color, var(--color-primary));
          cursor: pointer;
          user-select: none;
          padding: 0.25rem 0.5rem;
        }

        /* Show the dropdown menu only on hover */
        .options-container:hover .menu {
          display: block;
        }

        /* Hidden by default */
        .menu {
          display: none;
          position: absolute;
          top: 100%; /* directly beneath “Options” */
          left: 0;
          background-color: var(--color-background, whitesmoke);
          border: 1px solid #ddd;
          border-radius: 4px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          min-width: 140px;
        }

        .menu button {
          display: block;
          width: 100%;
          background: none;
          border: none;
          padding: 0.5rem 0.75rem;
          text-align: left;
          font: inherit;
          color: var(--color-primary, #182d3b);
          cursor: pointer;
          white-space: nowrap;
        }
        .menu button:hover {
          background-color: #f5f5f5;
        }
      </style>

      <div class="options-container">
        <span>Options</span>
        <div class="menu">
          <!-- Dispatch a custom event on click, bubbles/composed so parent can catch it -->
          <button @click=${this._onSignOut}>Sign Out</button>
          <button class="theme-toggle" @click=${this._onToggleTheme}>
            Dark mode
          </button>
        </div>
      </div>
    `;
  }

  private _onSignOut() {
    // Bubble a “option-signout” event so <app-header> can handle it
    this.dispatchEvent(
      new CustomEvent("option-signout", { bubbles: true, composed: true })
    );
  }

  private _onToggleTheme() {
    this.dispatchEvent(
      new CustomEvent("option-toggle-theme", { bubbles: true, composed: true })
    );
  }
}
