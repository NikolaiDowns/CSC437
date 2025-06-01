// packages/app/src/views/track-progress-view.ts
import { css, html, LitElement } from 'lit';
import { customElement }         from 'lit/decorators.js';
import '../components/bar-chart.js';         // your existing bar-chart component
import '../components/track-progress.js';    // your existing loader logic

@customElement('track-progress-view')
export class TrackProgressView extends LitElement {
  // 1) render into light DOM so global CSS applies
  protected createRenderRoot() { return this; }

  static styles = css`
    :host { display: block; padding-top: 70px; }
    /* copy the .container, .row, .box, .graph, etc. from your global styles */
  `;

  render() {
    return html`
      <main class="container">
        <!-- Daily Usage -->
        <div class="row">
          <div class="box graph"><bar-chart id="daily-left"></bar-chart></div>
          <div class="box graph"><bar-chart id="daily-right"></bar-chart></div>
        </div>
        <!-- Weekly… Monthly… Yearly… exactly as in your old HTML -->
      </main>
    `;
  }
}
