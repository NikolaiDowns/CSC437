// packages/app/src/components/app-header.ts
import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";
import { Observer, Auth, Events } from "@calpoly/mustang";

@customElement("app-header")
export class AppHeader extends LitElement {
  // 1) Keep track of whether the user is authenticated and what their username is
  @state()
  private authenticated = false;

  @state()
  private username: string | null = null;

  // 2) We’ll still wire up an Observer in case Mustang publishes an auth change
  //    (e.g., right after login). That way the header updates immediately.
  private authObserver!: Observer<any>;

  static styles = css`
    /* Basic toolbar styling */
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.5rem 1rem;
      background-color: var(--toolbar-bg, #ffffff);
      border-bottom: 1px solid #ddd;
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
    .toolbar-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .toolbar-right a,
    .toolbar-right button {
      background: none;
      border: none;
      padding: 0.25rem 0.5rem;
      font: inherit;
      cursor: pointer;
      text-decoration: none;
      color: var(--link-color, #007bff);
    }
    .toolbar-right a:hover,
    .toolbar-right button:hover {
      text-decoration: underline;
    }
    .spacer {
      flex: 1 1 auto;
    }
  `;

  constructor() {
    super();
    // 3) Listen for Mustang’s Auth changes. If the user “signed in” via Events.relay(),
    //    this callback will fire immediately with the new authState. We still pass
    //    just (this, "truewalk:auth") because that is how Observer works today.
    this.authObserver = new Observer(this, "truewalk:auth");
  }

  connectedCallback() {
    super.connectedCallback();

    // 4) First, check localStorage right now. If we have a saved username (and token),
    //    assume the user is already authenticated and show “Hello, <username>” immediately.
    const storedUsername = localStorage.getItem("username");
    const storedToken = localStorage.getItem("token");
    if (storedUsername && storedToken) {
      this.authenticated = true;
      this.username = storedUsername;
    }

    // 5) Also observe Mustang’s Auth context. If we just finished a login flow via
    //    Mustang’s Events.relay(["auth/signin", token]), this callback will update our state.
    //    **But we only override when authState.user.authenticated === true**. We remove the
    //    else‐branch that would wipe out our localStorage‐driven state.
    this.authObserver.observe((authState: any) => {
      if (authState.user?.authenticated) {
        this.authenticated = true;
        this.username = authState.user.username || this.username;
      }
      // If authState.user.authenticated is false, do nothing—keep whatever localStorage said.
    });
  }

  // No manual `.disconnect()` because the current Observer API does not expose it.

  // 6) Navigate to login.html with redirect back to this page
  private goLogin() {
    const here = window.location.pathname;
    window.location.href = `/login.html?redirect=${encodeURIComponent(here)}`;
  }

  // 7) Navigate to signup.html with redirect back to this page
  private goSignup() {
    const here = window.location.pathname;
    window.location.href = `/signup.html?redirect=${encodeURIComponent(here)}`;
  }

  // 8) Signal Mustang’s Auth to sign out, then clear localStorage + reload
  private doSignOut() {
    // Mustang’s Auth.Provider is watching for “auth/signout” events. This triggers it.
    Events.relay(
      new CustomEvent("auth:message", {
        detail: ["auth/signout"],
      }),
      "auth:message"
    );

    // Clear our localStorage so we don’t auto‐login next time.
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    // Reload. After reload, neither localStorage nor Mustang’s Auth will be “authenticated,”
    // so we’ll see the “Sign Up / Login” buttons again.
    window.location.reload();
  }

  // 9) (Optional) Dark/light toggle—kept exactly as in proto
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

  // 10) Opt out of Shadow DOM so global CSS (styles.css) can style this header
  protected createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <header class="toolbar">
        <div class="toolbar-left">
          <img
            src="/icons/walkhard.svg"
            alt="True Walk logo"
            class="box-icon-small"
          />
          <strong>TRUE WALK</strong>
        </div>
        <div class="toolbar-right">
          ${this.authenticated
            ? html`
                <!-- ===== Logged‐in state ===== -->
                <span>Hello, ${this.username}</span>
                <button @click=${this.doSignOut}>Sign Out</button>
              `
            : html`
                <!-- ===== Logged‐out state ===== -->
                <button @click=${this.goSignup}>Sign Up</button>
                <button @click=${this.goLogin}>Login</button>
              `}

          <div class="spacer"></div>

          <!-- Always‐visible navigation links -->
          <a href="/pricing.html">Pricing</a>
          <a href="/contact.html">Contact Us</a>
          <a href="/about.html">About Us</a>
          <a href="/options.html">Options</a>

          <!-- Optional dark/light toggle -->
          <button
            class="theme-toggle"
            aria-label="Toggle dark mode"
            @click=${this.toggleTheme}
          >
            Dark mode
          </button>
        </div>
      </header>
    `;
  }
}
