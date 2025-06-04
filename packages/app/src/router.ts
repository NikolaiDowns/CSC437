// packages/app/src/router.ts

import { html, TemplateResult } from "lit";
import "./views/home-view";
import "./views/track-progress-view";
import "./views/share-progress-view";

export interface AppRoute {
  path: string;
  view?: (params?: any) => TemplateResult;
  redirect?: string;
}

/** 
 * If no token, send user to login.html?redirect=… 
 * Otherwise, return the original viewTemplate. 
 */
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
      console.log("Rendering /app (unprotected; home-view)");
      // No auth required for home-view:
      return html`<home-view></home-view>`;
    },
  },
  {
    path: "/app/track",
    view: () => {
      console.log("Rendering /app/track (protected)");
      return requiresAuth(html`<track-progress-view></track-progress-view>`);
    },
  },
  {
    path: "/app/share",
    view: () => {
      console.log("Rendering /app/share (protected)");
      return requiresAuth(html`<share-progress-view></share-progress-view>`);
    },
  },

  // Catch‐all 404:
  { path: "/(.*)", view: () => html`<h1>404 Not Found</h1>` },
];
