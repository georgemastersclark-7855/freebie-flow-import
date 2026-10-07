export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      mentorship_admissions_settings: {
        Row: {
          capacity: number
          cash_target_minor: number | null
          cohort_id: string
          currency: string | null
          seat_price_minor: number | null
          updated_at: string
        }
        Insert: {
          capacity?: number
          cash_target_minor?: number | null
          cohort_id: string
          currency?: string | null
          seat_price_minor?: number | null
          updated_at?: string
        }
        Update: {
          capacity?: number
          cash_target_minor?: number | null
          cohort_id?: string
          currency?: string | null
          seat_price_minor?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_admissions_settings_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: true
            referencedRelation: "mentorship_cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_application_form_revisions: {
        Row: {
          cohort_id: string
          config: Json
          form_id: string
          published_at: string
          published_by: string | null
          revision: number
        }
        Insert: {
          cohort_id: string
          config: Json
          form_id: string
          published_at?: string
          published_by?: string | null
          revision: number
        }
        Update: {
          cohort_id?: string
          config?: Json
          form_id?: string
          published_at?: string
          published_by?: string | null
          revision?: number
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_application_form_revisions_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "mentorship_cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_application_form_revisions_form_id_fkey"
            columns: ["form_id"]
            isOneToOne: false
            referencedRelation: "mentorship_application_forms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_application_form_revisions_published_by_fkey"
            columns: ["published_by"]
            isOneToOne: false
            referencedRelation: "mentorship_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      mentorship_application_forms: {
        Row: {
          cohort_id: string
          created_at: string
          draft_config: Json
          draft_version: number
          id: string
          is_open: boolean
          name: string
          published_draft_version: number | null
          published_revision: number | null
          slug: string
          updated_at: string
        }
        Insert: {
          cohort_id: string
          created_at?: string
          draft_config: Json
          draft_version?: number
          id: string
          is_open?: boolean
          name: string
          published_draft_version?: number | null
          published_revision?: number | null
          slug: string
          updated_at?: string
        }
        Update: {
          cohort_id?: string
          created_at?: string
          draft_config?: Json
          draft_version?: number
          id?: string
          is_open?: boolean
          name?: string
          published_draft_version?: number | null
          published_revision?: number | null
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_application_forms_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "mentorship_cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_application_rate_limits: {
        Row: {
          hit_at: string
          key_hash: string
          key_type: string
        }
        Insert: {
          hit_at?: string
          key_hash: string
          key_type: string
        }
        Update: {
          hit_at?: string
          key_hash?: string
          key_type?: string
        }
        Relationships: []
      }
      mentorship_applications: {
        Row: {
          answers: Json
          attribution: Json
          form_id: string
          form_revision: number
          id: string
          lead_id: string
          response_id: string
          submitted_at: string
        }
        Insert: {
          answers: Json
          attribution?: Json
          form_id: string
          form_revision?: number
          id?: string
          lead_id: string
          response_id: string
          submitted_at: string
        }
        Update: {
          answers?: Json
          attribution?: Json
          form_id?: string
          form_revision?: number
          id?: string
          lead_id?: string
          response_id?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_applications_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "mentorship_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_baselines: {
        Row: {
          enrollment_id: string
          file_name: string
          id: string
          mime_type: string | null
          size_bytes: number
          storage_path: string
          updated_at: string
          uploaded_at: string
        }
        Insert: {
          enrollment_id: string
          file_name: string
          id?: string
          mime_type?: string | null
          size_bytes?: number
          storage_path: string
          updated_at?: string
          uploaded_at?: string
        }
        Update: {
          enrollment_id?: string
          file_name?: string
          id?: string
          mime_type?: string | null
          size_bytes?: number
          storage_path?: string
          updated_at?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_baselines_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: true
            referencedRelation: "mentorship_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_booking_events: {
        Row: {
          cohort_id: string
          email: string
          event_type: string
          external_event_id: string
          id: string
          invitee_uri: string
          provider_updated_at: string
          received_at: string
          rescheduled_at: string | null
          rescheduled_to_invitee_uri: string | null
          scheduled_at: string | null
        }
        Insert: {
          cohort_id: string
          email: string
          event_type: string
          external_event_id: string
          id?: string
          invitee_uri: string
          provider_updated_at: string
          received_at?: string
          rescheduled_at?: string | null
          rescheduled_to_invitee_uri?: string | null
          scheduled_at?: string | null
        }
        Update: {
          cohort_id?: string
          email?: string
          event_type?: string
          external_event_id?: string
          id?: string
          invitee_uri?: string
          provider_updated_at?: string
          received_at?: string
          rescheduled_at?: string | null
          rescheduled_to_invitee_uri?: string | null
          scheduled_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_booking_events_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "mentorship_cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_booking_inbox: {
        Row: {
          cohort_id: string
          email: string
          enrollment_id: string | null
          id: string
          invitee_uri: string
          lead_id: string | null
          provider_updated_at: string
          received_at: string
          rescheduled_to_invitee_uri: string | null
          scheduled_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          cohort_id: string
          email: string
          enrollment_id?: string | null
          id?: string
          invitee_uri: string
          lead_id?: string | null
          provider_updated_at: string
          received_at?: string
          rescheduled_to_invitee_uri?: string | null
          scheduled_at?: string | null
          status: string
          updated_at?: string
        }
        Update: {
          cohort_id?: string
          email?: string
          enrollment_id?: string | null
          id?: string
          invitee_uri?: string
          lead_id?: string | null
          provider_updated_at?: string
          received_at?: string
          rescheduled_to_invitee_uri?: string | null
          scheduled_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_booking_inbox_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "mentorship_cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_booking_inbox_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "mentorship_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_booking_inbox_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "mentorship_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_call_attendance: {
        Row: {
          attended: boolean
          call_id: string
          enrollment_id: string
          minutes_attended: number | null
          notes: string | null
          updated_at: string
        }
        Insert: {
          attended?: boolean
          call_id: string
          enrollment_id: string
          minutes_attended?: number | null
          notes?: string | null
          updated_at?: string
        }
        Update: {
          attended?: boolean
          call_id?: string
          enrollment_id?: string
          minutes_attended?: number | null
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_call_attendance_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "mentorship_calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_call_attendance_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "mentorship_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_calls: {
        Row: {
          calendar_url: string | null
          call_type: string
          circle_event_url: string | null
          cohort_id: string
          created_at: string
          ends_at: string | null
          id: string
          starts_at: string
          title: string
          updated_at: string
          week_id: string | null
        }
        Insert: {
          calendar_url?: string | null
          call_type?: string
          circle_event_url?: string | null
          cohort_id: string
          created_at?: string
          ends_at?: string | null
          id?: string
          starts_at: string
          title: string
          updated_at?: string
          week_id?: string | null
        }
        Update: {
          calendar_url?: string | null
          call_type?: string
          circle_event_url?: string | null
          cohort_id?: string
          created_at?: string
          ends_at?: string | null
          id?: string
          starts_at?: string
          title?: string
          updated_at?: string
          week_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_calls_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "mentorship_cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_calls_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "mentorship_weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_check_ins: {
        Row: {
          created_at: string
          enrollment_id: string
          id: string
          notes: string | null
          owner_id: string | null
          reason: string
          resolved_at: string | null
          sent_at: string | null
          status: string
          submission_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          enrollment_id: string
          id?: string
          notes?: string | null
          owner_id?: string | null
          reason: string
          resolved_at?: string | null
          sent_at?: string | null
          status?: string
          submission_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          enrollment_id?: string
          id?: string
          notes?: string | null
          owner_id?: string | null
          reason?: string
          resolved_at?: string | null
          sent_at?: string | null
          status?: string
          submission_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_check_ins_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "mentorship_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_check_ins_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "mentorship_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "mentorship_check_ins_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "mentorship_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_cohort_records: {
        Row: {
          created_at: string
          id: string
          name: string
          payload: Json
          student_count: number | null
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          payload: Json
          student_count?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          payload?: Json
          student_count?: number | null
        }
        Relationships: []
      }
      mentorship_cohorts: {
        Row: {
          circle_url: string | null
          created_at: string
          current_week: number
          display_name: string
          ends_at: string | null
          id: string
          internal_name: string
          schedule_pattern: Json | null
          schedule_revision: number
          slug: string
          starts_at: string | null
          status: string
          timezone: string
          updated_at: string
        }
        Insert: {
          circle_url?: string | null
          created_at?: string
          current_week?: number
          display_name?: string
          ends_at?: string | null
          id?: string
          internal_name: string
          schedule_pattern?: Json | null
          schedule_revision?: number
          slug: string
          starts_at?: string | null
          status?: string
          timezone?: string
          updated_at?: string
        }
        Update: {
          circle_url?: string | null
          created_at?: string
          current_week?: number
          display_name?: string
          ends_at?: string | null
          id?: string
          internal_name?: string
          schedule_pattern?: Json | null
          schedule_revision?: number
          slug?: string
          starts_at?: string | null
          status?: string
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      mentorship_enrollments: {
        Row: {
          application_id: string | null
          cohort_id: string
          created_at: string
          enrolled_at: string
          id: string
          is_walkthrough: boolean
          onboarding_completed_at: string | null
          shopify_order_id: string | null
          status: Database["public"]["Enums"]["mentorship_enrollment_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          application_id?: string | null
          cohort_id: string
          created_at?: string
          enrolled_at?: string
          id?: string
          is_walkthrough?: boolean
          onboarding_completed_at?: string | null
          shopify_order_id?: string | null
          status?: Database["public"]["Enums"]["mentorship_enrollment_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          application_id?: string | null
          cohort_id?: string
          created_at?: string
          enrolled_at?: string
          id?: string
          is_walkthrough?: boolean
          onboarding_completed_at?: string | null
          shopify_order_id?: string | null
          status?: Database["public"]["Enums"]["mentorship_enrollment_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_enrollments_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "mentorship_cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "mentorship_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      mentorship_events: {
        Row: {
          aggregate_id: string | null
          attempts: number
          created_at: string
          delivered_at: string | null
          event_type: string
          id: string
          last_error: string | null
          payload: Json
        }
        Insert: {
          aggregate_id?: string | null
          attempts?: number
          created_at?: string
          delivered_at?: string | null
          event_type: string
          id?: string
          last_error?: string | null
          payload?: Json
        }
        Update: {
          aggregate_id?: string | null
          attempts?: number
          created_at?: string
          delivered_at?: string | null
          event_type?: string
          id?: string
          last_error?: string | null
          payload?: Json
        }
        Relationships: []
      }
      mentorship_feedback: {
        Row: {
          action_confirmed_at: string | null
          audio_file_name: string | null
          audio_storage_path: string | null
          author_id: string
          created_at: string
          id: string
          next_action: string
          published_at: string | null
          status: Database["public"]["Enums"]["mentorship_feedback_status"]
          student_next_action: string | null
          submission_id: string
          updated_at: string
          video_url: string | null
          viewed_at: string | null
          written_notes: string
        }
        Insert: {
          action_confirmed_at?: string | null
          audio_file_name?: string | null
          audio_storage_path?: string | null
          author_id: string
          created_at?: string
          id?: string
          next_action?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["mentorship_feedback_status"]
          student_next_action?: string | null
          submission_id: string
          updated_at?: string
          video_url?: string | null
          viewed_at?: string | null
          written_notes?: string
        }
        Update: {
          action_confirmed_at?: string | null
          audio_file_name?: string | null
          audio_storage_path?: string | null
          author_id?: string
          created_at?: string
          id?: string
          next_action?: string
          published_at?: string | null
          status?: Database["public"]["Enums"]["mentorship_feedback_status"]
          student_next_action?: string | null
          submission_id?: string
          updated_at?: string
          video_url?: string | null
          viewed_at?: string | null
          written_notes?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_feedback_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "mentorship_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "mentorship_feedback_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: true
            referencedRelation: "mentorship_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_intake_connections: {
        Row: {
          account_label: string
          cohort_id: string
          detail: string
          last_checked_at: string | null
          last_received_at: string | null
          provider: string
          status: string
        }
        Insert: {
          account_label?: string
          cohort_id: string
          detail?: string
          last_checked_at?: string | null
          last_received_at?: string | null
          provider: string
          status?: string
        }
        Update: {
          account_label?: string
          cohort_id?: string
          detail?: string
          last_checked_at?: string | null
          last_received_at?: string | null
          provider?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_intake_connections_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "mentorship_cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_intake_events: {
        Row: {
          cohort_id: string
          external_id: string
          id: string
          lead_id: string
          occurred_at: string
          provider: string
          received_at: string
          source_url: string | null
          summary: string
        }
        Insert: {
          cohort_id: string
          external_id: string
          id?: string
          lead_id: string
          occurred_at: string
          provider: string
          received_at?: string
          source_url?: string | null
          summary: string
        }
        Update: {
          cohort_id?: string
          external_id?: string
          id?: string
          lead_id?: string
          occurred_at?: string
          provider?: string
          received_at?: string
          source_url?: string | null
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_intake_events_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "mentorship_cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_intake_events_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "mentorship_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_lead_activity: {
        Row: {
          actor_id: string | null
          body: string
          created_at: string
          id: string
          kind: string
          lead_id: string
        }
        Insert: {
          actor_id?: string | null
          body: string
          created_at?: string
          id?: string
          kind: string
          lead_id: string
        }
        Update: {
          actor_id?: string | null
          body?: string
          created_at?: string
          id?: string
          kind?: string
          lead_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_lead_activity_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "mentorship_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "mentorship_lead_activity_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "mentorship_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_lead_milestones: {
        Row: {
          cohort_id: string
          evidence: string
          lead_id: string
          milestone: string
          occurred_at: string
        }
        Insert: {
          cohort_id: string
          evidence: string
          lead_id: string
          milestone: string
          occurred_at: string
        }
        Update: {
          cohort_id?: string
          evidence?: string
          lead_id?: string
          milestone?: string
          occurred_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_lead_milestones_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "mentorship_cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_lead_milestones_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "mentorship_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_lead_payments: {
        Row: {
          amount_minor: number
          cohort_id: string
          created_at: string
          created_by: string | null
          currency: string
          id: string
          kind: string
          lead_id: string
          note: string
          paid_on: string
          provider: string
          reference: string
          void_reason: string | null
          voided_at: string | null
        }
        Insert: {
          amount_minor: number
          cohort_id: string
          created_at?: string
          created_by?: string | null
          currency: string
          id?: string
          kind: string
          lead_id: string
          note?: string
          paid_on: string
          provider: string
          reference: string
          void_reason?: string | null
          voided_at?: string | null
        }
        Update: {
          amount_minor?: number
          cohort_id?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          id?: string
          kind?: string
          lead_id?: string
          note?: string
          paid_on?: string
          provider?: string
          reference?: string
          void_reason?: string | null
          voided_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_lead_payments_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "mentorship_cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_lead_payments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "mentorship_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "mentorship_lead_payments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "mentorship_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_leads: {
        Row: {
          application_url: string | null
          cohort_id: string
          created_at: string
          created_by: string | null
          due_on: string | null
          email: string
          email_thread_url: string | null
          enrollment_id: string | null
          first_contact_channel: string
          full_name: string
          goals: string
          id: string
          music_url: string | null
          next_action: string
          owner_id: string | null
          payment_on: string | null
          payment_reference: string
          payment_status: string
          source: string
          source_detail: string
          stage: string
          updated_at: string
        }
        Insert: {
          application_url?: string | null
          cohort_id: string
          created_at?: string
          created_by?: string | null
          due_on?: string | null
          email: string
          email_thread_url?: string | null
          enrollment_id?: string | null
          first_contact_channel?: string
          full_name: string
          goals?: string
          id?: string
          music_url?: string | null
          next_action?: string
          owner_id?: string | null
          payment_on?: string | null
          payment_reference?: string
          payment_status?: string
          source?: string
          source_detail?: string
          stage?: string
          updated_at?: string
        }
        Update: {
          application_url?: string | null
          cohort_id?: string
          created_at?: string
          created_by?: string | null
          due_on?: string | null
          email?: string
          email_thread_url?: string | null
          enrollment_id?: string | null
          first_contact_channel?: string
          full_name?: string
          goals?: string
          id?: string
          music_url?: string | null
          next_action?: string
          owner_id?: string | null
          payment_on?: string | null
          payment_reference?: string
          payment_status?: string
          source?: string
          source_detail?: string
          stage?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_leads_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "mentorship_cohorts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_leads_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "mentorship_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "mentorship_leads_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: true
            referencedRelation: "mentorship_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_leads_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "mentorship_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      mentorship_native_application_routes: {
        Row: {
          cohort_id: string
          created_at: string
          enabled: boolean
          form_id: string
        }
        Insert: {
          cohort_id: string
          created_at?: string
          enabled?: boolean
          form_id: string
        }
        Update: {
          cohort_id?: string
          created_at?: string
          enabled?: boolean
          form_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_native_application_routes_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "mentorship_cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_onboarding_calls: {
        Row: {
          booked_at: string | null
          calendly_invitee_uri: string | null
          calendly_updated_at: string | null
          completed_at: string | null
          enrollment_id: string
          notes: string
          owner_id: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          booked_at?: string | null
          calendly_invitee_uri?: string | null
          calendly_updated_at?: string | null
          completed_at?: string | null
          enrollment_id: string
          notes?: string
          owner_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          booked_at?: string | null
          calendly_invitee_uri?: string | null
          calendly_updated_at?: string | null
          completed_at?: string | null
          enrollment_id?: string
          notes?: string
          owner_id?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_onboarding_calls_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: true
            referencedRelation: "mentorship_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_onboarding_calls_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "mentorship_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "mentorship_onboarding_calls_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "mentorship_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      mentorship_onboarding_progress: {
        Row: {
          completed_at: string | null
          enrollment_id: string
          task_id: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          enrollment_id: string
          task_id: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          enrollment_id?: string
          task_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_onboarding_progress_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "mentorship_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_onboarding_progress_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "mentorship_onboarding_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_onboarding_tasks: {
        Row: {
          action_label: string | null
          action_url: string | null
          cohort_id: string
          created_at: string
          description: string
          id: string
          position: number
          required: boolean
          task_key: string
          title: string
          updated_at: string
        }
        Insert: {
          action_label?: string | null
          action_url?: string | null
          cohort_id: string
          created_at?: string
          description?: string
          id?: string
          position?: number
          required?: boolean
          task_key: string
          title: string
          updated_at?: string
        }
        Update: {
          action_label?: string | null
          action_url?: string | null
          cohort_id?: string
          created_at?: string
          description?: string
          id?: string
          position?: number
          required?: boolean
          task_key?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_onboarding_tasks_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "mentorship_cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          role: Database["public"]["Enums"]["mentorship_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          role?: Database["public"]["Enums"]["mentorship_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          role?: Database["public"]["Enums"]["mentorship_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mentorship_progress_examples: {
        Row: {
          after_file_id: string
          before_file_id: string
          created_at: string
          created_by: string
          enrollment_id: string
          id: string
          title: string
        }
        Insert: {
          after_file_id: string
          before_file_id: string
          created_at?: string
          created_by?: string
          enrollment_id: string
          id?: string
          title: string
        }
        Update: {
          after_file_id?: string
          before_file_id?: string
          created_at?: string
          created_by?: string
          enrollment_id?: string
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_progress_examples_after_file_id_fkey"
            columns: ["after_file_id"]
            isOneToOne: false
            referencedRelation: "mentorship_submission_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_progress_examples_before_file_id_fkey"
            columns: ["before_file_id"]
            isOneToOne: false
            referencedRelation: "mentorship_submission_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_progress_examples_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "mentorship_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "mentorship_progress_examples_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "mentorship_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_resources: {
        Row: {
          cohort_id: string
          created_at: string
          description: string
          duration_label: string | null
          id: string
          position: number
          published: boolean
          resource_key: string
          resource_kind: string
          storage_path: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          cohort_id: string
          created_at?: string
          description?: string
          duration_label?: string | null
          id?: string
          position?: number
          published?: boolean
          resource_key: string
          resource_kind: string
          storage_path?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          cohort_id?: string
          created_at?: string
          description?: string
          duration_label?: string | null
          id?: string
          position?: number
          published?: boolean
          resource_key?: string
          resource_kind?: string
          storage_path?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_resources_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "mentorship_cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_staff_notes: {
        Row: {
          body: string
          call_id: string | null
          created_at: string
          created_by: string
          enrollment_id: string
          id: string
          kind: string
          occurred_on: string
          questionnaire: Json | null
          source_url: string | null
          title: string
          transcript: string
          updated_at: string
        }
        Insert: {
          body?: string
          call_id?: string | null
          created_at?: string
          created_by?: string
          enrollment_id: string
          id?: string
          kind: string
          occurred_on?: string
          questionnaire?: Json | null
          source_url?: string | null
          title: string
          transcript?: string
          updated_at?: string
        }
        Update: {
          body?: string
          call_id?: string | null
          created_at?: string
          created_by?: string
          enrollment_id?: string
          id?: string
          kind?: string
          occurred_on?: string
          questionnaire?: Json | null
          source_url?: string | null
          title?: string
          transcript?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_staff_notes_call_id_fkey"
            columns: ["call_id"]
            isOneToOne: false
            referencedRelation: "mentorship_calls"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_staff_notes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "mentorship_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "mentorship_staff_notes_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "mentorship_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_student_actions: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string
          due_on: string | null
          enrollment_id: string
          id: string
          owner_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string
          due_on?: string | null
          enrollment_id: string
          id?: string
          owner_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string
          due_on?: string | null
          enrollment_id?: string
          id?: string
          owner_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_student_actions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "mentorship_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "mentorship_student_actions_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "mentorship_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_student_actions_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "mentorship_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      mentorship_student_context: {
        Row: {
          current_focus: string
          enrollment_id: string
          goals: string
          updated_at: string
          updated_by: string
        }
        Insert: {
          current_focus?: string
          enrollment_id: string
          goals?: string
          updated_at?: string
          updated_by?: string
        }
        Update: {
          current_focus?: string
          enrollment_id?: string
          goals?: string
          updated_at?: string
          updated_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_student_context_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: true
            referencedRelation: "mentorship_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_student_context_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "mentorship_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      mentorship_student_profiles: {
        Row: {
          artist_name: string | null
          completed_at: string
          daw: string | null
          display_name: string
          enrollment_id: string
          instagram: string | null
          music_url: string | null
          photo_path: string
          updated_at: string
        }
        Insert: {
          artist_name?: string | null
          completed_at?: string
          daw?: string | null
          display_name: string
          enrollment_id: string
          instagram?: string | null
          music_url?: string | null
          photo_path: string
          updated_at?: string
        }
        Update: {
          artist_name?: string | null
          completed_at?: string
          daw?: string | null
          display_name?: string
          enrollment_id?: string
          instagram?: string | null
          music_url?: string | null
          photo_path?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_student_profiles_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: true
            referencedRelation: "mentorship_enrollments"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_submission_files: {
        Row: {
          file_name: string
          id: string
          kind: Database["public"]["Enums"]["mentorship_file_kind"]
          mime_type: string | null
          size_bytes: number
          storage_path: string
          submission_id: string
          uploaded_at: string
          uploader_id: string
        }
        Insert: {
          file_name: string
          id?: string
          kind: Database["public"]["Enums"]["mentorship_file_kind"]
          mime_type?: string | null
          size_bytes?: number
          storage_path: string
          submission_id: string
          uploaded_at?: string
          uploader_id: string
        }
        Update: {
          file_name?: string
          id?: string
          kind?: Database["public"]["Enums"]["mentorship_file_kind"]
          mime_type?: string | null
          size_bytes?: number
          storage_path?: string
          submission_id?: string
          uploaded_at?: string
          uploader_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_submission_files_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "mentorship_submissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_submission_files_uploader_id_fkey"
            columns: ["uploader_id"]
            isOneToOne: false
            referencedRelation: "mentorship_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      mentorship_submissions: {
        Row: {
          created_at: string
          enrollment_id: string
          id: string
          state: Database["public"]["Enums"]["mentorship_submission_state"]
          submitted_at: string | null
          updated_at: string
          week_id: string
        }
        Insert: {
          created_at?: string
          enrollment_id: string
          id?: string
          state?: Database["public"]["Enums"]["mentorship_submission_state"]
          submitted_at?: string | null
          updated_at?: string
          week_id: string
        }
        Update: {
          created_at?: string
          enrollment_id?: string
          id?: string
          state?: Database["public"]["Enums"]["mentorship_submission_state"]
          submitted_at?: string | null
          updated_at?: string
          week_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_submissions_enrollment_id_fkey"
            columns: ["enrollment_id"]
            isOneToOne: false
            referencedRelation: "mentorship_enrollments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentorship_submissions_week_id_fkey"
            columns: ["week_id"]
            isOneToOne: false
            referencedRelation: "mentorship_weeks"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_surgeries: {
        Row: {
          created_at: string
          delivered_at: string | null
          id: string
          notes: string | null
          selected_at: string
          selected_by: string
          submission_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivered_at?: string | null
          id?: string
          notes?: string | null
          selected_at?: string
          selected_by: string
          submission_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivered_at?: string | null
          id?: string
          notes?: string | null
          selected_at?: string
          selected_by?: string
          submission_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_surgeries_selected_by_fkey"
            columns: ["selected_by"]
            isOneToOne: false
            referencedRelation: "mentorship_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "mentorship_surgeries_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: true
            referencedRelation: "mentorship_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_typeform_routes: {
        Row: {
          accepts_from: string
          cohort_id: string
          connected_at: string | null
          enabled: boolean
          field_map: Json
          form_id: string
          form_title: string
          secret_id: string
        }
        Insert: {
          accepts_from?: string
          cohort_id: string
          connected_at?: string | null
          enabled?: boolean
          field_map?: Json
          form_id: string
          form_title?: string
          secret_id: string
        }
        Update: {
          accepts_from?: string
          cohort_id?: string
          connected_at?: string | null
          enabled?: boolean
          field_map?: Json
          form_id?: string
          form_title?: string
          secret_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_typeform_routes_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "mentorship_cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
      mentorship_weeks: {
        Row: {
          brief: string
          cohort_id: string
          created_at: string
          deadline_at: string | null
          id: string
          opens_at: string | null
          required_ideas: number
          short_title: string
          song_required: boolean
          stems_required: boolean
          title: string
          updated_at: string
          week_number: number
        }
        Insert: {
          brief?: string
          cohort_id: string
          created_at?: string
          deadline_at?: string | null
          id?: string
          opens_at?: string | null
          required_ideas?: number
          short_title: string
          song_required?: boolean
          stems_required?: boolean
          title: string
          updated_at?: string
          week_number: number
        }
        Update: {
          brief?: string
          cohort_id?: string
          created_at?: string
          deadline_at?: string | null
          id?: string
          opens_at?: string | null
          required_ideas?: number
          short_title?: string
          song_required?: boolean
          stems_required?: boolean
          title?: string
          updated_at?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_weeks_cohort_id_fkey"
            columns: ["cohort_id"]
            isOneToOne: false
            referencedRelation: "mentorship_cohorts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_manage_mentorship_student: {
        Args: { target_enrollment: string }
        Returns: boolean
      }
      confirm_mentorship_feedback_action: {
        Args: { next_action_text: string; target_feedback_id: string }
        Returns: string
      }
      create_mentorship_application_form: {
        Args: {
          p_cohort_id: string
          p_config: Json
          p_name: string
          p_slug: string
        }
        Returns: Json
      }
      get_mentorship_application_form_revision: {
        Args: { p_form_id: string; p_revision: number }
        Returns: Json
      }
      get_mentorship_typeform_route: {
        Args: { p_form_id: string }
        Returns: Json
      }
      get_public_mentorship_application_form: {
        Args: { p_slug?: string }
        Returns: Json
      }
      ingest_calendly_booking_event: {
        Args: {
          p_cohort_id: string
          p_email: string
          p_event_type: string
          p_external_event_id: string
          p_invitee_uri: string
          p_provider_updated_at: string
          p_rescheduled_at?: string
          p_rescheduled_to_invitee_uri?: string
          p_scheduled_at: string
        }
        Returns: Json
      }
      ingest_mentorship_lead: {
        Args: {
          p_cohort_id: string
          p_external_id: string
          p_lead: Json
          p_occurred_at: string
          p_provider: string
          p_summary: string
        }
        Returns: Json
      }
      ingest_mentorship_typeform: {
        Args: {
          p_answers: Json
          p_form_id: string
          p_lead: Json
          p_response_id: string
          p_submitted_at: string
          p_summary: string
        }
        Returns: Json
      }
      is_mentorship_application_form_admin: { Args: never; Returns: boolean }
      is_mentorship_member: {
        Args: { target_cohort_id: string }
        Returns: boolean
      }
      is_mentorship_staff: { Args: never; Returns: boolean }
      mark_mentorship_feedback_viewed: {
        Args: { target_feedback_id: string }
        Returns: string
      }
      mentorship_student_avatar_can_read: {
        Args: { object_name: string }
        Returns: boolean
      }
      mentorship_student_avatar_can_upload: {
        Args: { object_name: string }
        Returns: boolean
      }
      mentorship_student_avatar_metadata_is_allowed: {
        Args: { object_metadata: Json; object_name: string }
        Returns: boolean
      }
      mentorship_submission_object_is_released: {
        Args: { object_name: string }
        Returns: boolean
      }
      mentorship_week_is_released: {
        Args: { target_week_id: string }
        Returns: boolean
      }
      open_mentorship_walkthrough: { Args: never; Returns: string }
      owns_mentorship_enrollment: {
        Args: { target_enrollment_id: string }
        Returns: boolean
      }
      prepare_mentorship_typeform: {
        Args: {
          p_cohort_id: string
          p_field_map: Json
          p_form_id: string
          p_form_title: string
        }
        Returns: Json
      }
      publish_mentorship_application_form: {
        Args: { p_expected_version: number; p_form_id: string }
        Returns: Json
      }
      publish_mentorship_walkthrough_feedback: {
        Args: {
          action_text: string
          audio_name?: string
          audio_path?: string
          notes: string
          target_submission_id: string
          video_link?: string
        }
        Returns: Json
      }
      record_mentorship_payment: {
        Args: {
          p_amount_minor: number
          p_currency: string
          p_kind: string
          p_lead_id: string
          p_note?: string
          p_paid_on: string
          p_provider: string
          p_reference: string
        }
        Returns: {
          amount_minor: number
          cohort_id: string
          created_at: string
          created_by: string | null
          currency: string
          id: string
          kind: string
          lead_id: string
          note: string
          paid_on: string
          provider: string
          reference: string
          void_reason: string | null
          voided_at: string | null
        }
        SetofOptions: {
          from: "*"
          to: "mentorship_lead_payments"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      reset_mentorship_walkthrough: {
        Args: { target_enrollment_id: string }
        Returns: undefined
      }
      save_mentorship_application_form: {
        Args: {
          p_config: Json
          p_expected_version: number
          p_form_id: string
          p_name: string
        }
        Returns: Json
      }
      save_mentorship_schedule: {
        Args: {
          p_calls: Json
          p_cohort_id: string
          p_expected: Json
          p_pattern: Json
          p_revision: number
          p_weeks: Json
        }
        Returns: undefined
      }
      save_mentorship_student_profile: {
        Args: {
          artist_name_value?: string
          daw_value?: string
          display_name_value: string
          instagram_value?: string
          music_url_value?: string
          photo_path_value?: string
          target_enrollment_id: string
        }
        Returns: {
          artist_name: string | null
          completed_at: string
          daw: string | null
          display_name: string
          enrollment_id: string
          instagram: string | null
          music_url: string | null
          photo_path: string
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "mentorship_student_profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      set_mentorship_application_form_open: {
        Args: { p_form_id: string; p_open: boolean }
        Returns: Json
      }
      start_mentorship_submission: {
        Args: { target_submission_id: string }
        Returns: Database["public"]["Enums"]["mentorship_submission_state"]
      }
      submit_mentorship_application: {
        Args: {
          p_answers: Json
          p_attribution: Json
          p_email_hash: string
          p_form_id: string
          p_form_revision?: number
          p_ip_hash: string
          p_lead: Json
          p_submission_id: string
        }
        Returns: Json
      }
      submit_mentorship_week: {
        Args: { target_submission_id: string }
        Returns: string
      }
      sync_mentorship_booking_for_enrollment: {
        Args: { p_enrollment_id: string }
        Returns: undefined
      }
      validate_mentorship_application_form_config: {
        Args: { p_config: Json }
        Returns: undefined
      }
      void_mentorship_payment: {
        Args: { p_payment_id: string; p_reason: string }
        Returns: undefined
      }
    }
    Enums: {
      mentorship_enrollment_status: "active" | "completed" | "inactive"
      mentorship_feedback_status: "draft" | "published"
      mentorship_file_kind: "idea" | "song" | "stems"
      mentorship_role: "student" | "coach" | "admin"
      mentorship_submission_state:
        | "not_started"
        | "in_progress"
        | "submitted"
        | "late"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      mentorship_enrollment_status: ["active", "completed", "inactive"],
      mentorship_feedback_status: ["draft", "published"],
      mentorship_file_kind: ["idea", "song", "stems"],
      mentorship_role: ["student", "coach", "admin"],
      mentorship_submission_state: [
        "not_started",
        "in_progress",
        "submitted",
        "late",
      ],
    },
  },
} as const
