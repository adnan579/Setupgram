/** @format */

// Client logos for the "Trusted by" strip on the home page.
//
// Intentionally EMPTY. Add a client only with their permission to display their logo.
// Put the logo file in /public/clients/ (SVG or PNG, ideally white/monochrome so it reads on
// the dark background) and list it here. While this list is empty the strip is not shown.

export type ClientLogo = {
  name: string;
  logo: string; // e.g. "/clients/acme.svg"
  width?: number;
  height?: number;
};

export const clients: ClientLogo[] = [
  // { name: "Acme Co.", logo: "/clients/acme.svg", width: 120, height: 40 },
];
