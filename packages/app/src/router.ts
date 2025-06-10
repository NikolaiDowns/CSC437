// packages/app/src/router.ts

import { html, TemplateResult } from "lit";
import "./views/home-view";
import "./views/track-progress-view";
import "./views/share-progress-view";
import "./views/patient-progress-view";

export interface AppRoute {
  path: string;
  view?: (params?: any) => TemplateResult;
  redirect?: string;
}

function requiresAuth(viewTemplate: TemplateResult): TemplateResult {
  const token = localStorage.getItem("token");
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

  // Root page
  {
    path: "/app",
    view: () => {
      return html`<home-view></home-view>`;
    },
  },

  // Tracking Progress View
  {
    path: "/app/track",
    view: () => {
      return requiresAuth(html`<track-progress-view></track-progress-view>`);
    },
  },

  // Sharing Progress View
  {
    path: "/app/share",
    view: () => {
      return requiresAuth(
        html`<share-progress-view></share-progress-view>`
      );
    },
  },

  // Patient Progress View
  {
    path: "/app/patients",
    view: () => {
      return requiresAuth(
        html`<patient-progress-view></patient-progress-view>`
      );
    },
  },

  // Catch‐all 404:
  { path: "/(.*)", view: () => html`<h1>404 Not Found</h1>` },
];
