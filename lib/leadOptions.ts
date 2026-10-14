/** @format */

// Options for the optional "budget" and "timeline" questions on the contact form.
// Used by the form, validated by the API, and shown in the admin Leads table.
// Edit the labels here (e.g. to change currency) - keep the `value`s stable, they are stored.

export const BUDGET_OPTIONS = [
  { value: "under-50k", label: "Under ₹50,000" },
  { value: "50k-2l", label: "₹50,000 – ₹2 lakh" },
  { value: "2l-5l", label: "₹2 – ₹5 lakh" },
  { value: "5l-plus", label: "₹5 lakh and above" },
  { value: "not-sure", label: "Not sure yet" },
] as const;

export const TIMELINE_OPTIONS = [
  { value: "asap", label: "As soon as possible" },
  { value: "1-month", label: "Within 1 month" },
  { value: "1-3-months", label: "1 – 3 months" },
  { value: "3-plus-months", label: "3+ months" },
  { value: "flexible", label: "Flexible / just exploring" },
] as const;

type Option = { value: string; label: string };

/** Returns the value if it is one of the allowed options, otherwise "" (blocks arbitrary input). */
export function pickOption(options: readonly Option[], value: unknown): string {
  return typeof value === "string" && options.some((o) => o.value === value) ? value : "";
}

/** Human-readable label for a stored value ("" if unknown / empty). */
export function optionLabel(options: readonly Option[], value: string | undefined): string {
  return options.find((o) => o.value === value)?.label ?? "";
}
