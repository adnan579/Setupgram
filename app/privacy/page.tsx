/** @format */

import type { Metadata } from "next";
import Link from "next/link";
import LegalPage from "../../components/LegalPage";
import CookieSettingsButton from "../../components/CookieSettingsButton";
import { siteConfig } from "../../lib/siteConfig";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How SetupGram Infotech Solutions collects, uses and protects personal information.",
  alternates: { canonical: "/privacy" },
};

// NOTE FOR THE SITE OWNER: this policy was written from what the website actually does
// (forms, chatbot, analytics, hosting). Have a lawyer review it before relying on it, and
// update LEGAL_LAST_UPDATED in lib/siteConfig.ts whenever you change it.

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro={`${siteConfig.legalName} ("SetupGram", "we", "us") runs the website ${siteConfig.url}. This policy explains what personal information we collect through the site, why, who we share it with, and the choices you have.`}
    >
      <section>
        <h2>1. Information we collect</h2>
        <ul>
          <li>
            <strong>Contact form:</strong> your name, email address, phone number (optional), the
            service you are interested in, your estimated budget and timeline (optional) and your
            message.
          </li>
          <li>
            <strong>Job applications:</strong> your name, email address, phone number (optional),
            LinkedIn profile (optional), your resume file and any cover message.
          </li>
          <li>
            <strong>AI chat assistant (&ldquo;Bizzua&rdquo;):</strong> the messages you type into
            the chat window. Please do not share sensitive personal information in the chat.
          </li>
          <li>
            <strong>Technical data:</strong> your IP address, which we use briefly to limit spam and
            repeated form submissions, and standard server logs kept by our hosting provider.
          </li>
          <li>
            <strong>Analytics (only if you accept):</strong> Google Analytics and Google Tag Manager
            collect information such as pages viewed, approximate location, device and browser, using
            cookies. See section 5.
          </li>
        </ul>
      </section>

      <section>
        <h2>2. How we use it</h2>
        <ul>
          <li>To reply to your enquiry and prepare a proposal or quote.</li>
          <li>To review job applications and contact applicants.</li>
          <li>To answer your questions through the chat assistant.</li>
          <li>To keep the site secure and prevent spam or abuse.</li>
          <li>If you accept analytics cookies, to understand how the site is used and improve it.</li>
        </ul>
        <p>We do not sell your personal information.</p>
      </section>

      <section>
        <h2>3. Who we share it with</h2>
        <p>
          We use trusted service providers to run the site. They process data only to provide their
          service to us:
        </p>
        <ul>
          <li>Vercel: website hosting and aggregate performance measurement.</li>
          <li>MongoDB Atlas: database where enquiries and applications are stored.</li>
          <li>Resend: sends us an email notification when you submit a form.</li>
          <li>Cloudinary: stores uploaded resumes and images.</li>
          <li>Google: the Gemini API that generates chat assistant replies, and (only if you accept) Google Analytics and Tag Manager.</li>
        </ul>
        <p>
          Some of these providers process data outside India. We may also disclose information where
          the law requires it.
        </p>
      </section>

      <section>
        <h2>4. How long we keep it</h2>
        <p>
          We keep enquiries and job applications only as long as needed for the purpose they were
          sent for, and then delete or anonymise them. You can ask us to delete your information
          sooner at any time (see section 6). Chat messages are sent to Google to generate a reply and
          are not stored in our database.
        </p>
      </section>

      <section id="cookies">
        <h2>5. Cookies and analytics</h2>
        <p>
          The site itself works without analytics cookies. Google Analytics and Google Tag Manager
          are switched off until you click <strong>Accept</strong> on the cookie notice. If you click
          <strong> Decline</strong>, they are never loaded and any analytics cookies already set are
          removed. Your choice is remembered in your browser. We also use Vercel Analytics and Speed
          Insights, which measure aggregate page performance and do not use advertising cookies.
        </p>
        <p>
          You can change your choice at any time:{" "}
          <CookieSettingsButton className="text-primary underline underline-offset-2" />.
        </p>
      </section>

      <section>
        <h2>6. Your rights</h2>
        <p>
          Subject to applicable law (including India&apos;s Digital Personal Data Protection Act,
          2023, and, where it applies to you, the GDPR), you can ask us to give you access to the
          personal information we hold about you, correct it, delete it, or stop using it, and you
          can withdraw consent you have given. Email us at{" "}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> and we will respond within a
          reasonable time. If you are not satisfied, you may also contact the relevant data
          protection authority.
        </p>
      </section>

      <section>
        <h2>7. Security</h2>
        <p>
          We use encrypted connections (HTTPS), restrict admin access and apply rate limits to our
          forms. No online service can be completely secure, so please share only what you are
          comfortable sending.
        </p>
      </section>

      <section>
        <h2>8. Children</h2>
        <p>The site is intended for businesses and adults. We do not knowingly collect information from children.</p>
      </section>

      <section>
        <h2>9. Changes to this policy</h2>
        <p>
          We may update this policy. The &ldquo;Last updated&rdquo; date above shows when it last
          changed. See also our <Link href="/terms">Terms of Service</Link>.
        </p>
      </section>

      <section>
        <h2>10. Contact</h2>
        <p>
          {siteConfig.legalName}, India. Email: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </p>
      </section>
    </LegalPage>
  );
}
