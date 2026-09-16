import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/landing/legal-page-layout";
import { PRODUCT } from "@/config/product";

export const metadata: Metadata = {
  title: "Disclaimer | FIRST $500",
  description: "Disclaimer for the FIRST $500 7-Day Challenge.",
};

export default function DisclaimerPage() {
  return (
    <LegalPageLayout title="Disclaimer" lastUpdated="September 16, 2026">
      <p>
        Please read this Disclaimer carefully before using {PRODUCT.name} (the
        &ldquo;Service&rdquo;). By accessing or purchasing the Service, you
        acknowledge and agree to the following.
      </p>

      <h2>No Earnings Guarantee</h2>
      <p>
        The Service is designed to help you work toward your first $500 in
        booked revenue from a local service business.{" "}
        <strong>
          We do not guarantee any specific income, revenue, profit, or number
          of customers.
        </strong>{" "}
        Results vary widely based on your effort, skills, market conditions,
        competition, pricing, service quality, and many other factors outside
        our control.
      </p>
      <p>
        Any examples, milestones, or language referencing &ldquo;$500&rdquo; or
        revenue targets are aspirational goals — not promises or projections of
        your personal results. Past results of others (if referenced) are not
        indicative of your future results.
      </p>

      <h2>Educational Purpose Only</h2>
      <p>
        All content in the Service — including lessons, templates, scripts, AI
        coach responses, and tools — is provided for general educational and
        informational purposes only. It is not a substitute for professional
        legal, tax, accounting, financial, or business advice.
      </p>

      <h2>Your Responsibility: Licenses, Permits &amp; Compliance</h2>
      <p>
        Operating a local service business may require licenses, permits,
        business registration, insurance, bonding, tax registration, and other
        compliance steps depending on your location and the services you offer.{" "}
        <strong>
          You are solely responsible for researching, obtaining, and maintaining
          all required licenses, permits, and legal compliance before accepting
          paid work.
        </strong>
      </p>
      <p>
        The Service may remind you to verify local requirements, but we do not
        provide legal advice and cannot confirm what applies to your specific
        situation. Consult qualified professionals in your jurisdiction.
      </p>

      <h2>Business Risk</h2>
      <p>
        Starting and operating a business involves financial risk, including
        the potential loss of time and money invested in equipment, supplies,
        marketing, and operations. You assume all risk associated with your
        business decisions and actions.
      </p>

      <h2>AI Coach Limitations</h2>
      <p>
        The AI coach provides automated suggestions based on the information
        you provide. AI responses may be inaccurate, incomplete, or
        inappropriate for your specific situation. Always use your own judgment
        and verify important decisions with qualified professionals.
      </p>

      <h2>Third-Party Platforms</h2>
      <p>
        The challenge may reference third-party platforms (social media,
        marketplaces, payment processors, etc.). We are not affiliated with or
        endorsed by these platforms unless explicitly stated. You are responsible
        for complying with their terms of service.
      </p>

      <h2>No Endorsement of Services</h2>
      <p>
        References to specific local service types (detailing, pressure
        washing, cleaning, etc.) are examples only. We do not endorse any
        particular service as suitable for you or your market.
      </p>

      <h2>Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, FIRST $500 and its operators
        shall not be liable for any direct or indirect damages arising from
        your use of the Service, including lost profits, lost revenue, business
        interruption, or compliance failures.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this Disclaimer? Contact us at the support email
        provided during checkout.
      </p>
    </LegalPageLayout>
  );
}
