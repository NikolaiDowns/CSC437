// packages/app/src/chart-lists.ts

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';


@customElement('chart-list')
export class ChartList extends LitElement {
  /** fetch an array of chart config objects */
  @property({ type: String })
  src = '';

  /** Which chart to render */
  @property({ type: Number })
  index = 0;

  /** Fetched array of chart configs */
  @state()
  private charts: Array<{ data: number[]; unit: string; variant: string; [key: string]: any }> = [];

  static styles = css`
  :host {
    display: block;
    width: 100%;
    height: 100%;
  }
  .wrapper {
    display: flex;
    justify-content: center;

    /* These are new: */
    width: 100%;
    height: 100%;
  }
`;

  override connectedCallback() {
    super.connectedCallback();
    if (this.src) {
      fetch(this.src)
        .then(res => {
          if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
          return res.json();
        })
        .then(json => {
          this.charts = Array.isArray(json) ? json : [json];
          console.log(this.charts);
        })
        .catch(err => console.error('Error loading chart data:', err));
    }
  }

  override render() {
    const cfg = this.charts[this.index];
    if (!cfg) {
      return html`<div>Loading chart #${this.index + 1}...</div>`;
    }
    return html`
      <div class="wrapper">
        <bar-chart
          .data=${cfg.data}
          unit=${cfg.unit}
          variant=${cfg.variant}
        ></bar-chart>
      </div>
    `;
  }
}
