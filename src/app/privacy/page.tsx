import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/landing/legal-page-layout";
import { PRODUCT } from "@/config/product";

export const metadata: Metadata = {
  title: "Privacy Policy | FIRST $500",
  description: "Privacy Policy for the FIRST $500 7-Day Challenge.",
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="September 16, 2026">
      <p>
        This Privacy Policy describes how FIRST $500 (&ldquo;we,&rdquo;
        &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, and protects
        your information when you use {PRODUCT.name} (the &ldquo;Service&rdquo;).
      </p>

      <h2>1. Information We Collect</h2>
      <h3>Account information</h3>
      <p>
        When you sign up, we collect your email address, name (if provided), and
        authentication credentials managed through Supabase Auth.
      </p>
      <h3>Challenge data</h3>
      <p>
        We store your challenge progress, saved deliverables (offers, pricing,
        prospect lists, etc.), onboarding responses, and AI coach conversation
        history to provide the Service.
      </p>
      <h3>Payment information</h3>
      <p>
        Payments are processed by Stripe. We do not store full credit card
        numbers. Stripe may collect billing details according to their privacy
        policy.
      </p>
      <h3>Usage data</h3>
      <p>
        We may collect basic usage information such as pages visited, feature
        interactions, and device/browser type to improve the Service.
      </p>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>Provide and maintain the Service</li>
        <li>Process payments and verify entitlements</li>
        <li>Personalize your dashboard and AI coach responses</li>
        <li>Send transactional emails (account, purchase, password reset)</li>
        <li>Improve the Service and fix issues</li>
        <li>Comply with legal obligations</li>
      </ul>

      <h2>3. AI Coach Data</h2>
      <p>
        Messages you send to the AI coach are processed by third-party AI
        providers (such as OpenAI) to generate responses. Do not share sensitive
        personal information you would not want processed by these providers.
        Conversation history is stored to maintain context within your account.
      </p>

      <h2>4. Third-Party Services</h2>
      <p>We use trusted third parties to operate the Service, including:</p>
      <ul>
        <li>Supabase — authentication and database</li>
        <li>Stripe — payment processing</li>
        <li>OpenAI — AI coaching features</li>
        <li>Vercel — hosting and deployment</li>
      </ul>
      <p>
        These providers process data according to their own privacy policies and
        our agreements with them.
      </p>

      <h2>5. Data Retention</h2>
      <p>
        We retain your account and challenge data for as long as your account
        is active or as needed to provide the Service. You may request account
        deletion by contacting support.
      </p>

      <h2>6. Security</h2>
      <p>
        We implement reasonable technical and organizational measures to protect
        your data. No method of transmission or storage is 100% secure, and we
        cannot guarantee absolute security.
      </p>

      <h2>7. Your Rights</h2>
      <p>
        Depending on your location, you may have rights to access, correct,
        delete, or export your personal data. Contact us to exercise these
        rights. We will respond within a reasonable timeframe.
      </p>

      <h2>8. Cookies</h2>
      <p>
        We use essential cookies for authentication and session management.
        These are required for the Service to function.
      </p>

      <h2>9. Children</h2>
      <p>
        The Service is not intended for users under 18. We do not knowingly
        collect information from children.
      </p>

      <h2>10. Changes</h2>
      <p>
        We may update this Privacy Policy from time to time. Changes will be
        posted on this page with an updated date.
      </p>

      <h2>11. Contact</h2>
      <p>
        Privacy questions? Contact us at the support email provided during
        checkout.
      </p>
    </LegalPageLayout>
  );
}
