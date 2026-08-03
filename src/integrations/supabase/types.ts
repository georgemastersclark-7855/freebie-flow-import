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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
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
      mentorship_cohorts: {
        Row: {
          circle_url: string | null
          created_at: string
          current_week: number
          display_name: string
          ends_at: string | null
          id: string
          internal_name: string
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
      confirm_mentorship_feedback_action: {
        Args: { next_action_text: string; target_feedback_id: string }
        Returns: string
      }
      is_mentorship_member: {
        Args: { target_cohort_id: string }
        Returns: boolean
      }
      is_mentorship_staff: { Args: never; Returns: boolean }
      mark_mentorship_feedback_viewed: {
        Args: { target_feedback_id: string }
        Returns: string
      }
      owns_mentorship_enrollment: {
        Args: { target_enrollment_id: string }
        Returns: boolean
      }
      start_mentorship_submission: {
        Args: { target_submission_id: string }
        Returns: Database["public"]["Enums"]["mentorship_submission_state"]
      }
      submit_mentorship_week: {
        Args: { target_submission_id: string }
        Returns: string
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
