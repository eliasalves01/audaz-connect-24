export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      agendamentos: {
        Row: {
          aluno_id: string
          compareceu: boolean | null
          created_at: string
          data: string
          duracao: number
          horario: string
          id: string
          instrumento: string
          numero_aula: number | null
          observacoes: string | null
          professor_id: string
          serie_id: string | null
          status: Database["public"]["Enums"]["status_aula"]
          tipo: Database["public"]["Enums"]["tipo_aula"]
          total_aulas: number | null
          updated_at: string
          valor: number | null
        }
        Insert: {
          aluno_id: string
          compareceu?: boolean | null
          created_at?: string
          data: string
          duracao?: number
          horario: string
          id?: string
          instrumento: string
          numero_aula?: number | null
          observacoes?: string | null
          professor_id: string
          serie_id?: string | null
          status?: Database["public"]["Enums"]["status_aula"]
          tipo: Database["public"]["Enums"]["tipo_aula"]
          total_aulas?: number | null
          updated_at?: string
          valor?: number | null
        }
        Update: {
          aluno_id?: string
          compareceu?: boolean | null
          created_at?: string
          data?: string
          duracao?: number
          horario?: string
          id?: string
          instrumento?: string
          numero_aula?: number | null
          observacoes?: string | null
          professor_id?: string
          serie_id?: string | null
          status?: Database["public"]["Enums"]["status_aula"]
          tipo?: Database["public"]["Enums"]["tipo_aula"]
          total_aulas?: number | null
          updated_at?: string
          valor?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_aluno_id_fkey"
            columns: ["aluno_id"]
            isOneToOne: false
            referencedRelation: "alunos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "professores"
            referencedColumns: ["id"]
          },
        ]
      }
      alunos: {
        Row: {
          canal_captacao: Database["public"]["Enums"]["canal_captacao"]
          created_at: string
          email: string
          id: string
          idade: number | null
          nome: string
          observacoes: string | null
          responsavel: string | null
          telefone: string
          telefone_responsavel: string | null
          updated_at: string
        }
        Insert: {
          canal_captacao: Database["public"]["Enums"]["canal_captacao"]
          created_at?: string
          email: string
          id?: string
          idade?: number | null
          nome: string
          observacoes?: string | null
          responsavel?: string | null
          telefone: string
          telefone_responsavel?: string | null
          updated_at?: string
        }
        Update: {
          canal_captacao?: Database["public"]["Enums"]["canal_captacao"]
          created_at?: string
          email?: string
          id?: string
          idade?: number | null
          nome?: string
          observacoes?: string | null
          responsavel?: string | null
          telefone?: string
          telefone_responsavel?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      professores: {
        Row: {
          ativo: boolean
          created_at: string
          email: string
          id: string
          instrumento: string
          nome: string
          telefone: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          email: string
          id?: string
          instrumento: string
          nome: string
          telefone: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          email?: string
          id?: string
          instrumento?: string
          nome?: string
          telefone?: string
          updated_at?: string
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
      canal_captacao:
        | "site"
        | "facebook"
        | "google"
        | "presencial"
        | "indicacao"
        | "outro"
      status_aula:
        | "agendado"
        | "fechou"
        | "reagendar"
        | "voltar_contato"
        | "cancelado"
        | "nao_compareceu"
      tipo_aula: "experimental" | "matriculado"
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
      canal_captacao: [
        "site",
        "facebook",
        "google",
        "presencial",
        "indicacao",
        "outro",
      ],
      status_aula: [
        "agendado",
        "fechou",
        "reagendar",
        "voltar_contato",
        "cancelado",
        "nao_compareceu",
      ],
      tipo_aula: ["experimental", "matriculado"],
    },
  },
} as const
