// packages/app/src/views/patient-progress-view.ts

import "../components/patient-card"; // register <patient-card>
import { define, View } from "@calpoly/mustang";
import { html } from "lit";
import { customElement, state } from "lit/decorators.js";

import { Model, User, DataShare } from "../model";  
import { Msg } from "../messages";

interface SharerWithShare extends User {
  shareInfo: {
    withUserId: string;
    mode: "temporary" | "indefinite";
    sharedAt: string;
    expiresAt?: string;
  };
}

@customElement("patient-progress-view")
export class PatientProgressView extends View<Model, Msg> {
  static uses = define({});

  @state() private currentUser?: User;
  @state() private sharers: SharerWithShare[] = [];

  constructor() {
    super("truewalk:model");
  }

  override connectedCallback() {
    super.connectedCallback();
    this.dispatchMessage(["user/load", {}]);
  }

  protected updated(_changed: Map<string, any>) {
    super.updated(_changed);
    if (
      this.model.currentUser &&
      this.model.currentUser !== this.currentUser
    ) {
      this.currentUser = this.model.currentUser;
      this.loadSharers();
    }
  }

  private async loadSharers() {
    if (!this.currentUser?.receives || this.currentUser.receives.length === 0) {
      this.sharers = [];
      return;
    }

    const token = localStorage.getItem("token") || "";
    const promises = this.currentUser.receives.map(
      async (shareRecord: DataShare) => {
        const resp = await fetch(
          `http://localhost:3000/api/users/${encodeURIComponent(
            shareRecord.withUserId
          )}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!resp.ok) {
          console.error(
            `Could not fetch user ${shareRecord.withUserId}: status ${resp.status}`
          );
          return {
            id: shareRecord.withUserId,
            name: "(unknown)",
            tocAccepted: false,
            usage: [],
            shareInfo: { ...shareRecord },
          } as SharerWithShare;
        }
        const thatUser = (await resp.json()) as User;
        return {
          ...thatUser,
          shareInfo: {
            withUserId: shareRecord.withUserId,
            mode: shareRecord.mode,
            sharedAt: shareRecord.sharedAt.toString(),
            expiresAt: shareRecord.expiresAt?.toString(),
          },
        } as SharerWithShare;
      }
    );
    this.sharers = await Promise.all(promises);
  }

  override render() {
    if (!this.currentUser) {
      return html`<h2>Loading profile…</h2>`;
    }
    if (!this.sharers || this.sharers.length === 0) {
      return html`<h2>No patients are currently sharing data with you.</h2>`;
    }
    return html`
      <h1>Patient Data Feed</h1>
      <div>
        ${this.sharers.map(
          (sh) => html`
            <patient-card
              .dataUsage="${sh.usage || []}"
              .dataShareinfo="${sh.shareInfo}"
            ></patient-card>
          `
        )}
      </div>
    `;
  }
}
