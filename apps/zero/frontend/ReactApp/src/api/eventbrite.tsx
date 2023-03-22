import { ENV } from "src/environments/environment";

export let eventBriteAPIKey = ENV.eventbrite.apiKey;
export let orgId = ENV.eventbrite.orgId;

export let eventBriteAPIHeaders = {
  Authorization: `Bearer ${eventBriteAPIKey}`,
  "Content-Type": "application/json",
};
export let eventBriteAPIReqParams: RequestInit = {
  method: "POST",
  cache: "no-cache",
  headers: eventBriteAPIHeaders,
};


