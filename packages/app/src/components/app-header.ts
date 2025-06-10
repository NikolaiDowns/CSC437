// packages/app/src/components/app-header.ts

import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Observer, Events } from "@calpoly/mustang";
import "./options-menu"; // ← Import the <options-menu> we just created

@customElement("app-header")
export class AppHeader extends LitElement {
  // Check if signed‐in
  @state() private authenticated = false;
  @state() private username: string | null = null;
  private authObserver!: Observer<any>;

  // Use styles.css
  protected createRenderRoot() {
    return this;
  }

  static styles = css`
    header.toolbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem;
      background-color: var(--color-background, whitesmoke);
      border-bottom: 1px solid #ddd;
      box-sizing: border-box;
      z-index: 1000;
    }

    .toolbar-left {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .toolbar-left img {
      width: 32px;
      height: 32px;
    }

    .toolbar-left a {
      color: #0353A4;           /* WalkHard blue */
      text-decoration: none;    /* remove underline */
      font-size: 1.25rem;
      font-weight: 700;
      cursor: default;          /* not a pointer */
    }
    .toolbar-left a:hover,
    .toolbar-left a:active,
    .toolbar-left a:focus {
      color: #0353A4;
      text-decoration: none;
      cursor: default;
    }

    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: nowrap;
    }

    .greeting {
      font-weight: 600;
      color: var(--color-primary, #182d3b);
      white-space: nowrap;
    }

    .toolbar-right a {
      background: none;
      border: none;
      padding: 0.25rem 0.5rem;
      font: inherit;
      cursor: pointer;
      text-decoration: none;
      color: var(--link-color, #007bff);
      white-space: nowrap;
    }
    .toolbar-right a:hover {
      text-decoration: underline;
    }

    .spacer {
      height: 60px;
      width: 100%;
      flex-shrink: 0;
    }
  `;

  constructor() {
    super();
    this.authObserver = new Observer(this, "truewalk:auth");
  }

  connectedCallback() {
    super.connectedCallback();

    // If localStorage has username+token, treat as already signed in
    const storedUsername = localStorage.getItem("username");
    const storedToken = localStorage.getItem("token");
    if (storedUsername && storedToken) {
      this.authenticated = true;
      this.username = storedUsername;
    }

    // Pick up any sign‐in changes
    this.authObserver.observe((authState: any) => {
      if (authState.user?.authenticated) {
        this.authenticated = true;
        this.username = authState.user.username || this.username;
      }
    });
  }

  // Redirect to login.html
  private goLogin() {
    const here = window.location.pathname;
    window.location.href = `/login.html?redirect=${encodeURIComponent(here)}`;
  }

  // Redirect to signup.html
  private goSignup() {
    const here = window.location.pathname;
    window.location.href = `/signup.html?redirect=${encodeURIComponent(here)}`;
  }

  // Handle “Sign Out”
  private doSignOut(e: MouseEvent) {
    // Relay the event into Mustang’s Auth context:
    Events.relay(e, "auth:message", ["auth/signout"]);
    // Clear localStorage so next reload shows logged‐out state:
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.reload();
  }

  // Handle “Dark mode” toggle
  private toggleTheme() {
    const isDark = document.documentElement.classList.toggle("dark");
    const btn = this.renderRoot.querySelector<HTMLButtonElement>(".theme-toggle");
    if (btn) {
      btn.textContent = isDark ? "Light mode" : "Dark mode";
      btn.setAttribute(
        "aria-label",
        isDark ? "Toggle light mode" : "Toggle dark mode"
      );
    }
    document.querySelectorAll<HTMLElement>("[data-light][data-dark]").forEach((el) => {
      if (el.tagName.toLowerCase() === "img") {
        el.setAttribute("src", isDark ? el.dataset.dark! : el.dataset.light!);
      } else {
        el.style.backgroundImage = `url(${isDark ? el.dataset.dark! : el.dataset.light!})`;
      }
    });
  }

  render() {
    return html`
      <header class="toolbar">
        <div class="toolbar-left">
          <!-- Keep the SVG icon; turn “TRUE WALK” text into a link back to /app -->
          <img src="/icons/walkhard.svg" alt="True Walk logo" class="box-icon-small" />
          <strong>TRUE WALK</strong>
        </div>

        <div class="toolbar-right">
          ${this.authenticated
            ? html`<span class="greeting">Hello, ${this.username}</span>`
            : html`
                <button @click=${this.goSignup}>Sign Up</button>
                <button @click=${this.goLogin}>Login</button>
              `}
          <options-menu
            @option-signout=${(e: Event) => this.doSignOut(e as MouseEvent)}
            @option-toggle-theme=${() => this.toggleTheme()}
          ></options-menu>
          <a href="/app/share">Share Progress</a>
          <a href="/app/patients">Patient Progress</a>
          <a href="/pricing.html">Pricing</a>
          <a href="/contact.html">Contact Us</a>
          <a href="/about.html">About Us</a>
          
        </div>
      </header>
      <!-- Spacer so that page content is pushed below the fixed header -->
      <div class="spacer"></div>
    `;
  }
}
