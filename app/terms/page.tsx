/** @format */

import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "../../components/LegalPage";
import { siteConfig } from "../../lib/siteConfig";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms that apply when you use the SetupGram Infotech Solutions website.",
};

// NOTE FOR THE SITE OWNER: have a lawyer review these terms (especially governing law and
// the jurisdiction of courts) before relying on them. Update LEGAL_LAST_UPDATED in
// lib/siteConfig.ts whenever you change them.

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro={`These terms apply when you use ${siteConfig.url}, operated by ${siteConfig.legalName} ("SetupGram", "we", "us"). By using the site you agree to them.`}
    >
      <section>
        <h2>1. About the site</h2>
        <p>
          The site describes our services (app development, AI chatbots, CRM, digital marketing,
          advertising and consulting), lets you contact us, shows job openings and lets you verify
          certificates we have issued. Information on the site is general and may change without
          notice.
        </p>
      </section>

      <section>
        <h2>2. Enquiries are not contracts</h2>
        <p>
          Sending an enquiry, a proposal request or a message to the chat assistant does not create
          a contract. Any paid project is governed by a separate written agreement or proposal that
          we both accept.
        </p>
      </section>

      <section>
        <h2>3. AI chat assistant</h2>
        <p>
          The chat assistant (&ldquo;Bizzua&rdquo;) is powered by artificial intelligence and can
          make mistakes. Its replies are general information, not professional, legal or financial
          advice, and not a quote or offer. Please confirm anything important with our team.
        </p>
      </section>

      <section>
        <h2>4. Acceptable use</h2>
        <ul>
          <li>Do not submit false, unlawful or harmful content, or content you have no right to share.</li>
          <li>Do not attempt to disrupt, probe or gain unauthorised access to the site or its admin area.</li>
          <li>Do not use automated tools to submit forms or scrape the site in bulk.</li>
        </ul>
      </section>

      <section>
        <h2>5. Job applications and certificates</h2>
        <p>
          Applying for a role does not guarantee an interview or offer. You confirm that the
          information in your application is accurate. Certificate verification pages show records
          we hold; if you believe a record is wrong, contact us.
        </p>
      </section>

      <section>
        <h2>6. Intellectual property</h2>
        <p>
          The site&apos;s design, text, logos and code are owned by SetupGram or its licensors. You
          may view and share links to the site, but may not copy or reuse its content for commercial
          purposes without our written permission.
        </p>
      </section>

      <section>
        <h2>7. Disclaimer and liability</h2>
        <p>
          The site is provided &ldquo;as is&rdquo;. To the extent the law allows, we do not promise
          that it will always be available or error-free, and we are not liable for indirect or
          consequential losses arising from use of the site. Nothing here limits liability that
          cannot be limited by law.
        </p>
      </section>

      <section>
        <h2>8. Privacy</h2>
        <p>
          How we handle personal information is explained in our <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </section>

      <section>
        <h2>9. Governing law</h2>
        <p>
          These terms are governed by the laws of India. Disputes are subject to the courts of
          India, unless the law gives you the right to bring a claim elsewhere.
        </p>
      </section>

      <section>
        <h2>10. Changes and contact</h2>
        <p>
          We may update these terms; the &ldquo;Last updated&rdquo; date shows the latest version.
          Questions: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </p>
      </section>
    </LegalPage>
  );
}
