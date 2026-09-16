export const QUICK_ACTIONS = {
  help_me_choose: {
    label: "Help me choose",
    prompt:
      "I'm stuck choosing between service options. Based on my budget, skills, hours, and market, help me pick the best money-maker to focus on for the 7-day challenge. Give me a clear recommendation and why.",
  },
  improve_offer: {
    label: "Improve my offer",
    prompt:
      "Review my current offer and help me make it clearer, more specific, and easier for a local customer to understand and buy. Suggest a stronger offer statement I can use.",
  },
  help_price: {
    label: "Help me price",
    prompt:
      "Help me think through pricing for my service in my market. Suggest a starter price range and how to talk about it without undercharging or scaring customers away.",
  },
  facebook_post: {
    label: "Facebook post",
    prompt:
      "Write a natural, non-spammy Facebook post I can use to introduce my local service to my network. Keep it human, specific to my service, and focused on getting conversations started.",
  },
  customer_dm: {
    label: "Customer DM",
    prompt:
      "Write a friendly direct message I can send to a potential customer to start a conversation about my local service. Keep it short, personal, and not pushy.",
  },
  respond_customer: {
    label: "Respond to customer",
    prompt:
      "Help me reply to a customer who showed interest but hasn't booked yet. Write a natural follow-up message that moves the conversation toward a quote or booking without being aggressive.",
  },
  help_quote: {
    label: "Help me quote",
    prompt:
      "Help me put together a simple quote message for a local customer. Include what to ask, how to present the price, and how to make it easy for them to say yes.",
  },
  next_step: {
    label: "What's my next step?",
    prompt:
      "Based on where I am in the 7-day challenge and my current progress, tell me the single most important next step I should take today to work toward my first $500.",
  },
} as const;

export type QuickActionKey = keyof typeof QUICK_ACTIONS;

export const QUICK_ACTION_KEYS = Object.keys(
  QUICK_ACTIONS
) as QuickActionKey[];
