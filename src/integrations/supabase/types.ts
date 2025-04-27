export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      found_items: {
        Row: {
          claimed_at: string | null
          claimed_by: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          image: string | null
          location: string | null
          organization: string | null
          organization_type: string | null
        }
        Insert: {
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          image?: string | null
          location?: string | null
          organization?: string | null
          organization_type?: string | null
        }
        Update: {
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          image?: string | null
          location?: string | null
          organization?: string | null
          organization_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "found_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lost_items: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          image: string | null
          lost_date: string | null
          organization: string | null
          organization_type: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          image?: string | null
          lost_date?: string | null
          organization?: string | null
          organization_type?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          image?: string | null
          lost_date?: string | null
          organization?: string | null
          organization_type?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          branch: string | null
          class_name: string | null
          class_roll_no: string | null
          college_class_roll_no: string | null
          college_name: string | null
          college_section: string | null
          company_name: string | null
          created_at: string | null
          dob: string | null
          email: string | null
          employee_id: string | null
          gender: string | null
          id: string
          locality: string | null
          name: string | null
          occupation: string | null
          parents_phone: string | null
          phone_number: string | null
          profile_picture: string | null
          school_name: string | null
          section: string | null
          student_type: string | null
          university_roll_no: string | null
        }
        Insert: {
          branch?: string | null
          class_name?: string | null
          class_roll_no?: string | null
          college_class_roll_no?: string | null
          college_name?: string | null
          college_section?: string | null
          company_name?: string | null
          created_at?: string | null
          dob?: string | null
          email?: string | null
          employee_id?: string | null
          gender?: string | null
          id: string
          locality?: string | null
          name?: string | null
          occupation?: string | null
          parents_phone?: string | null
          phone_number?: string | null
          profile_picture?: string | null
          school_name?: string | null
          section?: string | null
          student_type?: string | null
          university_roll_no?: string | null
        }
        Update: {
          branch?: string | null
          class_name?: string | null
          class_roll_no?: string | null
          college_class_roll_no?: string | null
          college_name?: string | null
          college_section?: string | null
          company_name?: string | null
          created_at?: string | null
          dob?: string | null
          email?: string | null
          employee_id?: string | null
          gender?: string | null
          id?: string
          locality?: string | null
          name?: string | null
          occupation?: string | null
          parents_phone?: string | null
          phone_number?: string | null
          profile_picture?: string | null
          school_name?: string | null
          section?: string | null
          student_type?: string | null
          university_roll_no?: string | null
        }
        Relationships: []
      }
      user_settings: {
        Row: {
          allow_analytics: boolean | null
          allow_cookies: boolean | null
          allow_marketing: boolean | null
          auto_logout_minutes: number | null
          border_radius: string
          created_at: string | null
          date_format: string
          density: string
          font_size: string
          id: string
          language: string
          sidebar_behavior: string
          theme_mode: string
          time_format: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          allow_analytics?: boolean | null
          allow_cookies?: boolean | null
          allow_marketing?: boolean | null
          auto_logout_minutes?: number | null
          border_radius?: string
          created_at?: string | null
          date_format?: string
          density?: string
          font_size?: string
          id?: string
          language?: string
          sidebar_behavior?: string
          theme_mode?: string
          time_format?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          allow_analytics?: boolean | null
          allow_cookies?: boolean | null
          allow_marketing?: boolean | null
          auto_logout_minutes?: number | null
          border_radius?: string
          created_at?: string | null
          date_format?: string
          density?: string
          font_size?: string
          id?: string
          language?: string
          sidebar_behavior?: string
          theme_mode?: string
          time_format?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
