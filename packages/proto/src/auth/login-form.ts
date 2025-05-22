import { html, css, LitElement } from "lit";
import { property, state } from "lit/decorators.js";

interface LoginFormData {
  username?: string;
  password?: string;
}

export class LoginFormElement extends LitElement {
  @state()
  private formData: LoginFormData = {};

  @property({ type: String })
  api = "";

  @property({ type: String })
  redirect = "/";

  @state()
  private error = "";

  static styles = css`
    form { display: flex; flex-direction: column; gap: 1rem; }
    .error { color: red; font-size: 0.9rem; }
  `;

  private handleChange(e: Event) {
    const target = e.target as HTMLInputElement;
    const { name, value } = target;
    this.formData = { ...this.formData, [name]: value };
  }

  private handleSubmit(e: Event) {
    e.preventDefault();
    const { username, password } = this.formData;
    if (!(username && password && this.api)) return;

    fetch(this.api, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) throw new Error("Login failed");
        return res.json();
      })
      .then((data: { token: string }) => {
        const event = new CustomEvent("auth:message", {
          bubbles: true,
          composed: true,
          detail: ["auth/signin", { token: data.token, redirect: this.redirect }]
        });
        this.dispatchEvent(event);
      })
      .catch(err => {
        this.error = err.message;
      });
  }

  override render() {
    return html`
      <form @change=${this.handleChange} @submit=${this.handleSubmit}>
        <slot></slot>
        <button type="submit" ?disabled=${!(this.formData.username && this.formData.password)}>
          Login
        </button>
        <p class="error">${this.error}</p>
      </form>
    `;
  }
}