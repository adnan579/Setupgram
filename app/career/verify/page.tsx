/** @format */
import type { Metadata } from "next";
import VerifyLookup from "./VerifyLookup";

export const metadata: Metadata = {
  title: "Verify a Certificate",
  description:
    "Verify the authenticity of any internship, training, hackathon, or event certificate issued by SetupGram Infotech Solutions.",
};

export default function VerifyPage() {
  return (
    <section className="pt-32 pb-24 px-6 min-h-screen">
      <div className="max-w-xl mx-auto text-center">
        <p className="text-xs text-secondary font-semibold tracking-widest uppercase mb-4">
          Certificate Verification
        </p>
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white">
          Verify a <span className="gradient-text">SetupGram Certificate</span>
        </h1>
        <p className="text-gray-400 mb-10 leading-relaxed">
          Enter the Certificate ID (e.g.{" "}
          <span className="font-mono text-gray-300">SG-INT-2026-4821</span>)
          found on the certificate to confirm its authenticity.
        </p>
        <VerifyLookup />
      </div>
    </section>
  );
}
