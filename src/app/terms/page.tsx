import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/landing/legal-page-layout";
import { PRODUCT } from "@/config/product";
import { getSupportEmail } from "@/lib/support";

export const metadata: Metadata = {
  title: "Terms of Service | FIRST $500",
  description: "Terms of Service for the FIRST $500 7-Day Challenge.",
};

export default function TermsPage() {
  const supportEmail = getSupportEmail();

  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="September 17, 2026">
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
        use of {PRODUCT.name} (the &ldquo;Service&rdquo;) operated by FIRST
        $500 (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By
        purchasing or using the Service, you agree to these Terms.
      </p>

      <h2>1. The Service</h2>
      <p>
        The Service provides educational content, tools, templates, and an AI
        coaching feature designed to help you build a local service business.
        The Service is for informational and educational purposes only.
      </p>

      <h2>2. Account &amp; Access</h2>
      <p>
        You must create an account to access the challenge. You are responsible
        for maintaining the confidentiality of your login credentials and for all
        activity under your account. Access is granted upon successful payment
        and remains available for the lifetime of the product unless terminated
        as described below.
      </p>

      <h2>3. Payment</h2>
      <p>
        The current launch price is {PRODUCT.displayPrice} (USD), billed as a
        one-time payment. Prices may change for future customers. Payment
        processing is handled by Stripe. By completing checkout, you authorize
        the charge for the listed amount.
      </p>

      <h2>4. Refunds</h2>
      <p>
        Refund requests may be considered on a case-by-case basis within 7 days
        of purchase if you have not substantially completed the challenge
        content. Contact support at{" "}
        <a href={`mailto:${supportEmail}`} className="text-primary underline">
          {supportEmail}
        </a>
        . We
        reserve the right to deny refund requests that appear abusive or
        fraudulent.
      </p>

      <h2>5. Acceptable Use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>Share your account credentials or resell access to the Service</li>
        <li>Copy, redistribute, or publicly share challenge content without permission</li>
        <li>Use the AI coach to generate harmful, illegal, or abusive content</li>
        <li>Attempt to reverse engineer, scrape, or disrupt the Service</li>
      </ul>

      <h2>6. Intellectual Property</h2>
      <p>
        All content, branding, software, and materials in the Service are owned
        by us or our licensors. Your purchase grants a personal, non-transferable
        license to use the Service for your own business-building purposes.
      </p>

      <h2>7. No Professional Advice</h2>
      <p>
        The Service does not provide legal, tax, accounting, or financial
        advice. You are solely responsible for complying with all applicable
        laws, licenses, permits, insurance requirements, and tax obligations
        in your jurisdiction.
      </p>

      <h2>8. Disclaimer of Warranties</h2>
      <p>
        The Service is provided &ldquo;as is&rdquo; without warranties of any
        kind. We do not guarantee specific business results, income, or number
        of customers. See our{" "}
        <a href="/disclaimer" className="text-primary underline">
          Disclaimer
        </a>{" "}
        for additional information.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by law, we shall not be liable for any
        indirect, incidental, special, or consequential damages arising from
        your use of the Service. Our total liability shall not exceed the amount
        you paid for the Service.
      </p>

      <h2>10. Termination</h2>
      <p>
        We may suspend or terminate access if you violate these Terms. You may
        stop using the Service at any time. Sections that by nature should
        survive termination will remain in effect.
      </p>

      <h2>11. Changes</h2>
      <p>
        We may update these Terms from time to time. Continued use after changes
        constitutes acceptance of the updated Terms. Material changes will be
        posted on this page with an updated date.
      </p>

      <h2>12. Contact</h2>
      <p>
        Questions about these Terms? Contact us at{" "}
        <a href={`mailto:${supportEmail}`} className="text-primary underline">
          {supportEmail}
        </a>
        .
      </p>
    </LegalPageLayout>
  );
}
