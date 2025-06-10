// packages/app/src/components/patient-card.ts

import { html, LitElement, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "../components/bar-chart"; // Ensure <bar-chart> is registered

// The shape of the shareInfo
interface DataShare {
  withUserId: string;
  mode: "temporary" | "indefinite";
  sharedAt: string;   // ISO date string
  expiresAt?: string; // ISO date string or undefined
}

@customElement("patient-card")
export class PatientCard extends LitElement {
  // PUBLIC PROPERTIES

  // Cut array of 156 numbers into eight bar‐chart data sets
  @property({ type: Array }) dataUsage: number[] = [];

  // Datashare object
  @property({ type: Object }) dataShareinfo!: DataShare;

  // LOCAL STATE 

  // State: expanded vs retracted
  @state() private isExpanded = false;

  private toggleExpanded() {
    this.isExpanded = !this.isExpanded;
  }

  // STYLES

  static styles = css`
    :host {
      display: block;
      margin-bottom: 1rem;
    }
    .patient-card {
      display: flex;
      flex-direction: column;
      background: var(--color-box, #fff);
      border: 1px solid var(--color-accent, #0353A4);
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;

      /* Collapsed: wide + short = 8:1 */
      aspect-ratio: 20 / 1;
      transition: aspect-ratio 0.2s ease;
      transition: border-width 0.2s ease;
    }
    .patient-card:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-width: 3px
    }

    /* HEADER (always visible) */
    .patient-header {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0.5rem 1rem;
      background: var(--color-box, #fff);
    }
    .patient-header .arrow-icon {
      width: 1rem;
      height: 1rem;
      margin-right: 0.75rem;
      /* Right‐pointing triangle via SVG mask */
      mask: url("data:image/svg+xml,%3Csvg width='24' height='24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='8,4 16,12 8,20' fill='white'/%3E%3C/svg%3E")
        no-repeat center / contain;
      background-color: var(--color-primary, #182d3b);
      transition: transform 0.2s ease;
    }
    .patient-header .header-text {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      color: var(--color-primary, #182d3b);
    }
    .patient-header .username {
      font-weight: 600;
      font-size: 1.1rem;
    }
    .patient-header .until {
      font-size: 0.9rem;
      color: var(--color-secondary, #0353A4);
    }

    /* When expanded, rotate arrow downward */
    .patient-card.expanded .patient-header .arrow-icon {
      transform: rotate(90deg);
    }

    /* ─── EXPANDED STATE: tall 1:2 ratio, show charts ─────────────────── */
    .patient-card.expanded {
      aspect-ratio: 5 / 3;
    }
    /* Charts container = 7/8 of height */
    .patient-card.expanded .charts-container {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      padding: 0.75rem;
      background: var(--color-box, #fff);
      flex: 1 1 87.5%; /* 7/8 container height */
      overflow-y: hidden;
    }
    /* Header strip = 1/8 of height */
    .patient-card.expanded .patient-header {
      flex: 0 0 12.5%; /* 1/8 container height */
    }

    /* Each chart tile inside charts-container */
    .chart-slot {
      flex: 1 1 calc(50% - 0.5rem);
      min-height: 100px;
    }
    @media (max-width: 600px) {
      .chart-slot {
        flex: 1 1 100%;
      }
    }
  `;

  // ─── HELPER: splits the dataUsage array (length 156) into 8 slices ────────────

  private renderCharts() {
    // Exactly the same SIZES/VARIANTS as track-progress-view:
    const SIZES = [24, 24, 7, 7, 31, 31, 12, 12] as const;
    const VARIANTS: ("day" | "week" | "month" | "year")[] = [
      "day", "day", "week", "week", "month", "month", "year", "year"
    ];

    // Pad or trim usage[] to length 156
    const usage =
      this.dataUsage.length >= 156
        ? this.dataUsage.slice(0, 156)
        : [...this.dataUsage, ...Array(156 - this.dataUsage.length).fill(0)];

    let offset = 0;
    return SIZES.map((count, i) => {
      const slice = usage.slice(offset, offset + count);
      offset += count;
      const variant = VARIANTS[i];
      return html`
        <div class="chart-slot">
          <bar-chart .data="${slice}" unit="lbs" variant="${variant}"></bar-chart>
        </div>
      `;
    });
  }

  render() {
    const info = this.dataShareinfo;
    const untilText =
      info.mode === "temporary" && info.expiresAt
        ? new Date(info.expiresAt).toLocaleDateString()
        : "Indefinite";

    return html`
      <div class="patient-card ${this.isExpanded ? "expanded" : ""}" @click="${this.toggleExpanded}">
        <div class="patient-header">
          <div class="arrow-icon"></div>
          <div class="header-text">
            <span class="username">${info.withUserId}</span>
            <span class="until">Shared Until: ${untilText}</span>
          </div>
        </div>
        ${this.isExpanded
            ? html`<div class="charts-container">${this.renderCharts()}</div>`
            : null}
      </div>
    `;
  }
}
