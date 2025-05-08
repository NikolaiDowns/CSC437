// history/chart.js
import { LitElement, html, css } from 'https://unpkg.com/lit@2.7.2/index.js?module';

class BarChart extends LitElement {
  static properties = {
    data:    { type: Array },
    max:     { type: Number },
    unit:    { type: String },
    variant: { type: String }
  };

  constructor() {
    super();
    this.data    = [];
    this.max     = NaN;
    this.unit    = 'lbs';
    this.variant = '';
    this._labels = [];
  }

  connectedCallback() {
    super.connectedCallback();

    if (this.hasAttribute('variant')) {
      this.variant = this.getAttribute('variant');
    }

    // parse data
    const raw = this.getAttribute('data');
    if (raw) {
      try {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) this.data = arr;
      } catch {}
    }

    // parse max & unit
    if (this.hasAttribute('max')) {
      const m = Number(this.getAttribute('max'));
      if (!isNaN(m)) this.max = m;
    }
    if (this.hasAttribute('unit')) {
      this.unit = this.getAttribute('unit');
    }

    // parse custom labels
    const labRaw = this.getAttribute('labels');
    if (labRaw) {
      try {
        const l = JSON.parse(labRaw);
        if (Array.isArray(l) && l.length === this.data.length) {
          this._labels = l;
        }
      } catch {}
    }

    // default labels
    if (!this._labels.length) {
      if (this.variant === 'week' && this.data.length === 7) {
        this._labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
      } else if (this.data.length === 24) {
        this._labels = Array.from({length:24},(_,i)=> {
          const h = i%12===0?12:i%12, ap=i<12?'am':'pm';
          return `${h} ${ap}`;
        });
      } else if (this.variant === 'month' && this.data.length === 31) {
        this._labels = Array.from({length:31},(_,i) => String(i+1));
      } else if (this.variant === 'year' && this.data.length === 12) {
        this._labels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      } else {
        this._labels = this.data.map((_,i) => String(i));
      }
    }
  }

  static styles = css`
    :host {
      display: block;
      position: relative;
      width: 100%; height: 100%;
    }
    .chart {
      position: absolute; inset: 0;
      padding: 16px 48px 32px 16px;
      box-sizing: border-box;
      background: var(--color-box, #fff);
      border-radius: var(--box-radius, 20px);
      overflow: hidden;
    }
    svg.grid {
      position: absolute;
      top: 16px; bottom: 32px;
      left: 16px; right: 48px;
      width: 100%; height: 100%;
    }
    line {
      stroke: var(--axis-color, #ddd);
      stroke-width: 1;
    }
    .bars {
      display: grid;
      position: absolute; top: 16px; bottom: 32px;
      left: 16px; right: 48px;
      align-items: end;
      gap: 2px;
    }
    :host([variant="week"]) .bars { gap: 10px; }
    .bar {
      background: var(--bar-color, #3481eb);
      border-radius: 3px 3px 0 0;
    }
    :host([variant="week"]) .bar {
      border-radius: 6px 6px 0 0;
    }
    .x-axis {
      position: absolute; bottom: 8px;
      left: 16px; right: 48px;
      display: grid;
      font-size: 12px; color: var(--label-color, #888);
      pointer-events: none;
    }
    .x-axis div {
      text-align: center;
      white-space: nowrap;
    }
    .y-axis {
      position: absolute;
      top: 16px; bottom: 32px;
      right: 16px;
      display: flex; flex-direction: column;
      justify-content: space-between;
      align-items: flex-end;
      font-size: 12px; color: var(--label-color, #888);
      pointer-events: none;
    }
    .y-unit {
      position: absolute; top: 4px; right: 16px;
      font-size: 14px; font-weight: bold;
      color: var(--label-color, #888);
    }
  `;

  render() {
    // compute dynamic max & step
    const rawMax = Math.max(...this.data, 0);
    const base   = !isNaN(this.max) ? this.max : rawMax;
    const step   = Math.ceil((base/4)/5)*5;
    const maxVal = step * 4;

    // grid stops
    const stops = [0,1,2,3,4].map(i => ({
      pct: 100 - (i*step)/maxVal * 100,
      val: i*step
    }));

    // grid-template style
    const cols = this.data.length;
    const gridStyle = `grid-template-columns: repeat(${cols},1fr)`;

    // x-axis tick indices
    let showTicks;
    if (this.data.length === 24) {
      showTicks = [0,6,12,18];
    } else if (this.variant === 'month') {
      showTicks = [4,9,14,19,24,29];
    } else if (this.variant === 'year') {
      // show all months
      showTicks = this._labels.map((_,i) => i);
    } else {
      showTicks = this.data.map((_,i) => i);
    }

    return html`
      <div class="chart">
        <svg class="grid">
          ${stops.map(s => html`
            <line x1="0%" y1="${s.pct}%" x2="100%" y2="${s.pct}%"></line>
          `)}
        </svg>

        <div class="bars" style=${gridStyle}>
          ${this.data.map(v => html`
            <div class="bar" style="height:${v/maxVal*100}%"></div>
          `)}
        </div>

        <div class="x-axis" style=${gridStyle}>
          ${this._labels.map((lab,i) => html`
            <div>${ showTicks.includes(i) ? lab : '' }</div>
          `)}
        </div>

        <div class="y-axis">
          ${[...stops].reverse().map(s => html`<span>${s.val}</span>`)}
        </div>
        <div class="y-unit">${this.unit}</div>
      </div>
    `;
  }
}

customElements.define('bar-chart', BarChart);
