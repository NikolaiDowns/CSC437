import { LitElement, html } from 'lit';
import { customElement }    from 'lit/decorators.js';

@customElement('home-view')
export class HomeView extends LitElement {
  // opt out of Shadow DOM
  protected createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="container">
        <div class="row">
          <a href="/app/purchasing" class="box middle picture-link">
            <img
              data-light="/images/handle.png"
              data-dark="/images/handle_inv3.jpg"
              src="/images/handle.png"
              alt="Purchasing"
            />
            <span class="overlay-text">Purchasing</span>
          </a>
          <a href="/app/track" class="box middle picture-link">
            <img
              data-light="/images/Track Progress.jpg"
              data-dark="/images/Track Progress_inv3.jpg"
              src="/images/Track Progress.jpg"
              alt="Track Progress"
            />
            <span class="overlay-text">Track Progress</span>
          </a>
        </div>

        <div class="box bottom">
          <img src="/icons/walkhard.svg" alt="True Walk logo" class="box-icon" />
          "Sometimes the smallest step in the right direction ends up being the biggest step of your life"
        </div>

        <div class="box mission">
          <a href="/app/mission">Our Mission</a>
        </div>
      </div>
    `;
  }
}
