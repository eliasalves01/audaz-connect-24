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
      estoque_revendedor: {
        Row: {
          codigo_peca: string
          cor: string | null
          created_at: string
          data_compra: string
          data_venda: string | null
          id: string
          observacoes: string | null
          preco_compra: number
          preco_venda: number | null
          produto_id: string
          revendedor_id: string
          status: string
          updated_at: string
        }
        Insert: {
          codigo_peca: string
          cor?: string | null
          created_at?: string
          data_compra: string
          data_venda?: string | null
          id?: string
          observacoes?: string | null
          preco_compra: number
          preco_venda?: number | null
          produto_id: string
          revendedor_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          codigo_peca?: string
          cor?: string | null
          created_at?: string
          data_compra?: string
          data_venda?: string | null
          id?: string
          observacoes?: string | null
          preco_compra?: number
          preco_venda?: number | null
          produto_id?: string
          revendedor_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "estoque_revendedor_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "estoque_revendedor_revendedor_id_fkey"
            columns: ["revendedor_id"]
            isOneToOne: false
            referencedRelation: "revendedores"
            referencedColumns: ["id"]
          },
        ]
      }
      itens_pedido: {
        Row: {
          created_at: string
          id: string
          pedido_id: string
          preco_unitario: number
          produto_id: string
          quantidade: number
          subtotal: number
        }
        Insert: {
          created_at?: string
          id?: string
          pedido_id: string
          preco_unitario: number
          produto_id: string
          quantidade?: number
          subtotal: number
        }
        Update: {
          created_at?: string
          id?: string
          pedido_id?: string
          preco_unitario?: number
          produto_id?: string
          quantidade?: number
          subtotal?: number
        }
        Relationships: [
          {
            foreignKeyName: "itens_pedido_pedido_id_fkey"
            columns: ["pedido_id"]
            isOneToOne: false
            referencedRelation: "pedidos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itens_pedido_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      pedidos: {
        Row: {
          created_at: string
          data_entrega: string | null
          data_pedido: string
          id: string
          numero_pedido: string
          observacoes: string | null
          revendedor_id: string
          status: string
          total_itens: number
          updated_at: string
          valor_total: number
        }
        Insert: {
          created_at?: string
          data_entrega?: string | null
          data_pedido?: string
          id?: string
          numero_pedido: string
          observacoes?: string | null
          revendedor_id: string
          status?: string
          total_itens?: number
          updated_at?: string
          valor_total?: number
        }
        Update: {
          created_at?: string
          data_entrega?: string | null
          data_pedido?: string
          id?: string
          numero_pedido?: string
          observacoes?: string | null
          revendedor_id?: string
          status?: string
          total_itens?: number
          updated_at?: string
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "pedidos_revendedor_id_fkey"
            columns: ["revendedor_id"]
            isOneToOne: false
            referencedRelation: "revendedores"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          ativo: boolean
          categoria: string
          codigo: string
          created_at: string
          id: string
          imagem_url: string | null
          nome: string
          preco: number
          tamanho: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          categoria: string
          codigo: string
          created_at?: string
          id?: string
          imagem_url?: string | null
          nome: string
          preco: number
          tamanho?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          categoria?: string
          codigo?: string
          created_at?: string
          id?: string
          imagem_url?: string | null
          nome?: string
          preco?: number
          tamanho?: string | null
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
      profiles: {
        Row: {
          created_at: string | null
          id: string
          revendedor_id: string | null
          role: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          revendedor_id?: string | null
          role?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          revendedor_id?: string | null
          role?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_revendedor_id_fkey"
            columns: ["revendedor_id"]
            isOneToOne: false
            referencedRelation: "revendedores"
            referencedColumns: ["id"]
          },
        ]
      }
      revendedores: {
        Row: {
          ativo: boolean
          created_at: string
          email: string
          endereco: string | null
          id: string
          nome: string
          telefone: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          email: string
          endereco?: string | null
          id?: string
          nome: string
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          email?: string
          endereco?: string | null
          id?: string
          nome?: string
          telefone?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

// Helper types for better type inference
export type Produto = Tables<'produtos'>
export type Revendedor = Tables<'revendedores'>
export type EstoqueRevendedor = Tables<'estoque_revendedor'>
export type Pedido = Tables<'pedidos'>
export type ItemPedido = Tables<'itens_pedido'>
export type Profile = Tables<'profiles'>

export type ProdutoInsert = TablesInsert<'produtos'>
export type RevendedorInsert = TablesInsert<'revendedores'>
export type EstoqueRevendedorInsert = TablesInsert<'estoque_revendedor'>
export type PedidoInsert = TablesInsert<'pedidos'>
export type ItemPedidoInsert = TablesInsert<'itens_pedido'>
export type ProfileInsert = TablesInsert<'profiles'>

export type ProdutoUpdate = TablesUpdate<'produtos'>
export type RevendedorUpdate = TablesUpdate<'revendedores'>
export type EstoqueRevendedorUpdate = TablesUpdate<'estoque_revendedor'>
export type PedidoUpdate = TablesUpdate<'pedidos'>
export type ItemPedidoUpdate = TablesUpdate<'itens_pedido'>
export type ProfileUpdate = TablesUpdate<'profiles'>