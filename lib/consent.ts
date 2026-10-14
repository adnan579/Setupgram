/** @format */

"use client";

import { useEffect, useState } from "react";

// Visitor's choice about analytics cookies (Google Tag Manager / Google Analytics).
// Nothing from Google loads until the choice is "granted".
//
// The choice is kept in localStorage (so it persists across visits). If storage is blocked
// (private mode, strict browser settings) it falls back to memory for the current page session.

export type ConsentChoice = "granted" | "denied" | "unset";

const STORAGE_KEY = "sg_analytics_consent";
const CHANGE_EVENT = "sg-consent-change";

let memoryChoice: ConsentChoice = "unset";

export function readConsent(): ConsentChoice {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    if (value === "granted" || value === "denied") return value;
    return memoryChoice === "unset" ? "unset" : memoryChoice;
  } catch {
    return memoryChoice;
  }
}

/** Deletes Google Analytics / Tag Manager cookies (on this host and its parent domain). */
function clearAnalyticsCookies() {
  const names = document.cookie
    .split(";")
    .map((c) => c.split("=")[0].trim())
    .filter((n) => /^(_ga|_gid|_gat|_gcl_)/.test(n));
  const host = window.location.hostname;
  const domains = [host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const name of names) {
    for (const domain of domains) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`;
    }
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  }
}

function publish(choice: ConsentChoice) {
  window.dispatchEvent(new CustomEvent<ConsentChoice>(CHANGE_EVENT, { detail: choice }));
}

export function writeConsent(choice: "granted" | "denied") {
  memoryChoice = choice;
  try {
    window.localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    /* storage blocked: memory fallback above keeps the choice for this session */
  }
  if (choice === "denied") clearAnalyticsCookies();
  publish(choice);
}

/** Forgets the choice so the banner is shown again (used by the footer "Cookie settings" link). */
export function resetConsent() {
  memoryChoice = "unset";
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  publish("unset");
}

/**
 * Current choice. Returns null until the browser has been checked, so server-rendered HTML
 * and the first client render match (avoids a hydration mismatch and a banner flash).
 */
export function useConsent(): ConsentChoice | null {
  const [choice, setChoice] = useState<ConsentChoice | null>(null);

  useEffect(() => {
    setChoice(readConsent());
    const onChange = (e: Event) => setChoice((e as CustomEvent<ConsentChoice>).detail);
    const onStorage = () => setChoice(readConsent());
    window.addEventListener(CHANGE_EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  return choice;
}
