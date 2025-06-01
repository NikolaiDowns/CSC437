// packages/app/src/router.ts
import { html, TemplateResult } from "lit";
import "./views/home-view";
import "./views/track-progress-view";

export interface AppRoute {
  path: string;
  view?: (params?: any) => TemplateResult;
  redirect?: string;
}

function requiresAuth(viewTemplate: TemplateResult): TemplateResult {
  const token = localStorage.getItem("token");
  console.log("Auth check – token exists:", !!token);
  if (!token) {
    const currentPath = window.location.pathname;
    window.location.href = `/login.html?redirect=${encodeURIComponent(
      currentPath
    )}`;
    return html`<div><h1>Redirecting to login…</h1></div>`;
  }
  return viewTemplate;
}

export const routes: AppRoute[] = [
  { path: "/", redirect: "/app" },
  {
    path: "/app",
    view: () => {
      console.log("Rendering /app (protected)");
      return requiresAuth(html`<home-view></home-view>`);
    },
  },
  {
    path: "/app/track",
    view: () => {
      console.log("Rendering /app/track (protected)");
      return requiresAuth(
        html`<track-progress-view></track-progress-view>`
      );
    },
  },
  { path: "/(.*)", view: () => html`<h1>404 Not Found</h1>` },
];
