export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
  updated_at: string;
};

export type EntitlementStatus = "active" | "inactive" | "refunded";

export type Entitlement = {
  id: string;
  user_id: string;
  product_key: string;
  status: EntitlementStatus;
  stripe_customer_id: string | null;
  stripe_checkout_session_id: string | null;
  purchased_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ChallengeProfile = {
  id: string;
  user_id: string;
  selected_service: string | null;
  city_or_market: string | null;
  starting_budget: string | null;
  experience_level: string | null;
  available_hours: string | null;
  primary_goal: string | null;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
};

export type DayStatus = "locked" | "available" | "in_progress" | "completed";

export type ChallengeProgress = {
  id: string;
  user_id: string;
  day_number: number;
  status: DayStatus;
  started_at: string | null;
  completed_at: string | null;
  responses: Json;
  created_at: string;
  updated_at: string;
};

export type AiConversation = {
  id: string;
  user_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
};

export type AiUsage = {
  user_id: string;
  message_count: number;
  updated_at: string;
};

export type AnalyticsEventRow = {
  id: string;
  event_name: string;
  user_id: string | null;
  properties: Json;
  created_at: string;
};

export type StripeWebhookEvent = {
  id: string;
  stripe_event_id: string;
  event_type: string;
  processed_at: string;
};

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Profile, "id">>;
        Relationships: [];
      };
      entitlements: {
        Row: Entitlement;
        Insert: Omit<Entitlement, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Entitlement, "id">>;
        Relationships: [];
      };
      challenge_profiles: {
        Row: ChallengeProfile;
        Insert: {
          id?: string;
          user_id: string;
          selected_service?: string | null;
          city_or_market?: string | null;
          starting_budget?: string | null;
          experience_level?: string | null;
          available_hours?: string | null;
          primary_goal?: string | null;
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<ChallengeProfile, "id">>;
        Relationships: [];
      };
      challenge_progress: {
        Row: ChallengeProgress;
        Insert: {
          id?: string;
          user_id: string;
          day_number: number;
          status?: DayStatus;
          started_at?: string | null;
          completed_at?: string | null;
          responses?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<ChallengeProgress, "id">>;
        Relationships: [];
      };
      ai_conversations: {
        Row: AiConversation;
        Insert: Omit<AiConversation, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<AiConversation, "id">>;
        Relationships: [];
      };
      ai_usage: {
        Row: AiUsage;
        Insert: AiUsage;
        Update: Partial<Omit<AiUsage, "user_id">>;
        Relationships: [];
      };
      analytics_events: {
        Row: AnalyticsEventRow;
        Insert: Omit<AnalyticsEventRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<AnalyticsEventRow, "id">>;
        Relationships: [];
      };
      stripe_webhook_events: {
        Row: StripeWebhookEvent;
        Insert: Omit<StripeWebhookEvent, "id" | "processed_at"> & {
          id?: string;
          processed_at?: string;
        };
        Update: Partial<Omit<StripeWebhookEvent, "id">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
