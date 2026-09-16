export type Resource = {
  id: string;
  title: string;
  category: string;
  content: string;
};

export const RESOURCES: Resource[] = [
  {
    id: "warm-lead",
    title: "Warm Lead Script",
    category: "Outreach",
    content: `Hey [Name]! Hope you're doing well.

I'm starting a local [SERVICE] business here in [CITY] and thought of you. I'm offering [PACKAGE] for [PRICE] while I build up my first customers.

Would you be open to being one of my first jobs? I'd make sure you're completely happy with the work.

No pressure at all — just wanted to reach out!`,
  },
  {
    id: "cold-dm",
    title: "Cold DM Script",
    category: "Outreach",
    content: `Hi [Name] — I noticed [CONTEXT, e.g., your home/property/business] and wanted to reach out.

I run a local [SERVICE] business in [CITY]. I help [IDEAL CUSTOMER] with [CORE RESULT].

If you're ever interested, I'd be happy to share details or give a quick quote. Either way, no worries!`,
  },
  {
    id: "facebook-group",
    title: "Facebook Group Post",
    category: "Outreach",
    content: `Hi everyone! 👋

I'm [YOUR NAME], a local [SERVICE] provider here in [CITY]. I'm building my business and offering [PACKAGE] for [PRICE].

If anyone needs [SERVICE] or knows someone who might, I'd really appreciate a referral. Happy to answer questions in the comments or via DM.

Thanks for reading!`,
  },
  {
    id: "neighborhood-post",
    title: "Neighborhood App Post",
    category: "Outreach",
    content: `Hello neighbors!

I'm [YOUR NAME] and I recently started offering [SERVICE] in [CITY/NEIGHBORHOOD].

I'm offering [PACKAGE] for [PRICE] for my first local customers. If you or someone you know could use this, feel free to message me.

Thanks! — [YOUR NAME]`,
  },
  {
    id: "follow-up-1",
    title: "Follow-Up #1",
    category: "Follow-Up",
    content: `Hey [Name], just following up on my message about [SERVICE]. Totally understand if the timing isn't right — just wanted to check in one more time in case it's helpful.

Happy to answer any questions!`,
  },
  {
    id: "follow-up-2",
    title: "Follow-Up #2",
    category: "Follow-Up",
    content: `Hi [Name] — last follow-up from me! If you ever need [SERVICE] in [CITY], feel free to reach out anytime. Wishing you a great week!`,
  },
  {
    id: "quote-follow-up",
    title: "Quote Follow-Up",
    category: "Follow-Up",
    content: `Hi [Name], wanted to follow up on the quote I sent for [SERVICE]. Do you have any questions about the scope or pricing?

I'm happy to adjust the package if needed. Let me know what works best for you!`,
  },
  {
    id: "review-request",
    title: "Review Request",
    category: "After the Job",
    content: `Hi [Name]! Thanks again for choosing [BUSINESS NAME] for your [SERVICE].

If you were happy with the work, a quick review would mean a lot as I'm building my local business. Here's the link: [REVIEW LINK]

Thanks so much! — [YOUR NAME]`,
  },
  {
    id: "referral-request",
    title: "Referral Request",
    category: "After the Job",
    content: `Hi [Name]! Glad the [SERVICE] turned out well.

If you know anyone else in [CITY] who might need [SERVICE], I'd really appreciate an intro. I'm offering the same great work for friends and referrals.

Thanks again! — [YOUR NAME]`,
  },
  {
    id: "recurring-offer",
    title: "Recurring Service Offer",
    category: "Upsell",
    content: `Hi [Name]! Since you were happy with the [SERVICE], I wanted to mention I offer recurring [FREQUENCY, e.g., monthly/bi-weekly] service at [DISCOUNTED PRICE or PACKAGE].

Many of my customers prefer this so they don't have to think about scheduling. Interested?`,
  },
  {
    id: "quote-template",
    title: "Basic Quote Template",
    category: "Closing",
    content: `QUOTE — [BUSINESS NAME]

Customer: [CUSTOMER NAME]
Service: [SERVICE]
Date: [DATE]

Scope:
- [ITEM 1]
- [ITEM 2]
- [ITEM 3]

Price: $[AMOUNT]
Optional upgrade: [UPGRADE] — +$[AMOUNT]

Notes: [NOTES]

This quote is valid for 7 days. Reply to confirm and we'll get you scheduled!

— [YOUR NAME]
[PHONE/EMAIL]`,
  },
  {
    id: "job-checklist",
    title: "Job-Day Checklist",
    category: "Operations",
    content: `JOB DAY CHECKLIST

Before arrival:
☐ Confirm appointment time with customer
☐ Gather all supplies and equipment
☐ Check route and parking

On site:
☐ Take before photos
☐ Walk through scope with customer
☐ Set expectations on timeline
☐ Complete the work
☐ Take after photos
☐ Walk through results with customer

After the job:
☐ Collect payment
☐ Send thank-you message
☐ Request review (within 24–48 hours)
☐ Ask for referrals
☐ Offer recurring service if applicable
☐ Log job details for your records`,
  },
];

export const DAY6_SCRIPTS = RESOURCES.filter((r) =>
  ["warm-lead", "cold-dm", "facebook-group", "neighborhood-post", "follow-up-1", "follow-up-2", "quote-follow-up", "referral-request"].includes(r.id)
);
