// Generado por `supabase gen types typescript --linked`. No editar a mano.
// Re-generar después de cada migration que cambie el schema.

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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      agentes: {
        Row: {
          activo: boolean
          bio: string | null
          created_at: string
          email: string
          foto_url: string | null
          id: string
          matricula: string | null
          nombre: string
          telefono: string | null
          updated_at: string
          user_id: string | null
          whatsapp: string | null
        }
        Insert: {
          activo?: boolean
          bio?: string | null
          created_at?: string
          email: string
          foto_url?: string | null
          id?: string
          matricula?: string | null
          nombre: string
          telefono?: string | null
          updated_at?: string
          user_id?: string | null
          whatsapp?: string | null
        }
        Update: {
          activo?: boolean
          bio?: string | null
          created_at?: string
          email?: string
          foto_url?: string | null
          id?: string
          matricula?: string | null
          nombre?: string
          telefono?: string | null
          updated_at?: string
          user_id?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      interacciones: {
        Row: {
          agente_id: string
          contenido: string | null
          created_at: string
          id: string
          lead_id: string
          tipo: Database["public"]["Enums"]["tipo_interaccion"]
        }
        Insert: {
          agente_id: string
          contenido?: string | null
          created_at?: string
          id?: string
          lead_id: string
          tipo: Database["public"]["Enums"]["tipo_interaccion"]
        }
        Update: {
          agente_id?: string
          contenido?: string | null
          created_at?: string
          id?: string
          lead_id?: string
          tipo?: Database["public"]["Enums"]["tipo_interaccion"]
        }
        Relationships: [
          {
            foreignKeyName: "interacciones_agente_id_fkey"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "agentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interacciones_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          agente_asignado_id: string | null
          canal: Database["public"]["Enums"]["canal_lead"]
          created_at: string
          email: string
          estado: Database["public"]["Enums"]["estado_lead"]
          id: string
          mensaje: string | null
          nombre: string
          propiedad_id: string | null
          telefono: string | null
          updated_at: string
        }
        Insert: {
          agente_asignado_id?: string | null
          canal?: Database["public"]["Enums"]["canal_lead"]
          created_at?: string
          email: string
          estado?: Database["public"]["Enums"]["estado_lead"]
          id?: string
          mensaje?: string | null
          nombre: string
          propiedad_id?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Update: {
          agente_asignado_id?: string | null
          canal?: Database["public"]["Enums"]["canal_lead"]
          created_at?: string
          email?: string
          estado?: Database["public"]["Enums"]["estado_lead"]
          id?: string
          mensaje?: string | null
          nombre?: string
          propiedad_id?: string | null
          telefono?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_agente_asignado_id_fkey"
            columns: ["agente_asignado_id"]
            isOneToOne: false
            referencedRelation: "agentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_propiedad_id_fkey"
            columns: ["propiedad_id"]
            isOneToOne: false
            referencedRelation: "propiedades"
            referencedColumns: ["id"]
          },
        ]
      }
      propiedades: {
        Row: {
          abl_incluido: boolean
          agente_id: string
          ambientes: number | null
          antiguedad: number | null
          apto_credito: boolean
          banos: number | null
          created_at: string
          descripcion: string | null
          destacada: boolean
          direccion: string
          dormitorios: number | null
          estado: Database["public"]["Enums"]["estado_propiedad"]
          expensas: number | null
          expensas_moneda: Database["public"]["Enums"]["moneda"] | null
          features: Json
          fotos: Json
          id: string
          m2_cubiertos: number | null
          m2_terraza: number | null
          m2_totales: number | null
          moneda: Database["public"]["Enums"]["moneda"]
          operacion: Database["public"]["Enums"]["operacion"]
          precio: number
          slug: string
          tipo: Database["public"]["Enums"]["tipo_propiedad"]
          titulo: string
          ubicacion: unknown
          updated_at: string
          zona_id: string
        }
        Insert: {
          abl_incluido?: boolean
          agente_id: string
          ambientes?: number | null
          antiguedad?: number | null
          apto_credito?: boolean
          banos?: number | null
          created_at?: string
          descripcion?: string | null
          destacada?: boolean
          direccion: string
          dormitorios?: number | null
          estado?: Database["public"]["Enums"]["estado_propiedad"]
          expensas?: number | null
          expensas_moneda?: Database["public"]["Enums"]["moneda"] | null
          features?: Json
          fotos?: Json
          id?: string
          m2_cubiertos?: number | null
          m2_terraza?: number | null
          m2_totales?: number | null
          moneda: Database["public"]["Enums"]["moneda"]
          operacion: Database["public"]["Enums"]["operacion"]
          precio: number
          slug: string
          tipo: Database["public"]["Enums"]["tipo_propiedad"]
          titulo: string
          ubicacion?: unknown
          updated_at?: string
          zona_id: string
        }
        Update: {
          abl_incluido?: boolean
          agente_id?: string
          ambientes?: number | null
          antiguedad?: number | null
          apto_credito?: boolean
          banos?: number | null
          created_at?: string
          descripcion?: string | null
          destacada?: boolean
          direccion?: string
          dormitorios?: number | null
          estado?: Database["public"]["Enums"]["estado_propiedad"]
          expensas?: number | null
          expensas_moneda?: Database["public"]["Enums"]["moneda"] | null
          features?: Json
          fotos?: Json
          id?: string
          m2_cubiertos?: number | null
          m2_terraza?: number | null
          m2_totales?: number | null
          moneda?: Database["public"]["Enums"]["moneda"]
          operacion?: Database["public"]["Enums"]["operacion"]
          precio?: number
          slug?: string
          tipo?: Database["public"]["Enums"]["tipo_propiedad"]
          titulo?: string
          ubicacion?: unknown
          updated_at?: string
          zona_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "propiedades_agente_id_fkey"
            columns: ["agente_id"]
            isOneToOne: false
            referencedRelation: "agentes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "propiedades_zona_id_fkey"
            columns: ["zona_id"]
            isOneToOne: false
            referencedRelation: "zonas"
            referencedColumns: ["id"]
          },
        ]
      }
      tasaciones: {
        Row: {
          agente_asignado_id: string | null
          ambientes: number | null
          comentarios: string | null
          created_at: string
          direccion: string | null
          email: string
          estado: Database["public"]["Enums"]["estado_tasacion"]
          id: string
          m2: number | null
          nombre: string
          telefono: string | null
          tipo: Database["public"]["Enums"]["tipo_propiedad_tasacion"] | null
          updated_at: string
          valor_estimado: number | null
        }
        Insert: {
          agente_asignado_id?: string | null
          ambientes?: number | null
          comentarios?: string | null
          created_at?: string
          direccion?: string | null
          email: string
          estado?: Database["public"]["Enums"]["estado_tasacion"]
          id?: string
          m2?: number | null
          nombre: string
          telefono?: string | null
          tipo?: Database["public"]["Enums"]["tipo_propiedad_tasacion"] | null
          updated_at?: string
          valor_estimado?: number | null
        }
        Update: {
          agente_asignado_id?: string | null
          ambientes?: number | null
          comentarios?: string | null
          created_at?: string
          direccion?: string | null
          email?: string
          estado?: Database["public"]["Enums"]["estado_tasacion"]
          id?: string
          m2?: number | null
          nombre?: string
          telefono?: string | null
          tipo?: Database["public"]["Enums"]["tipo_propiedad_tasacion"] | null
          updated_at?: string
          valor_estimado?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tasaciones_agente_asignado_id_fkey"
            columns: ["agente_asignado_id"]
            isOneToOne: false
            referencedRelation: "agentes"
            referencedColumns: ["id"]
          },
        ]
      }
      zonas: {
        Row: {
          created_at: string
          foto_url: string | null
          id: string
          nombre: string
          orden: number
          region: Database["public"]["Enums"]["region_zona"]
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          foto_url?: string | null
          id?: string
          nombre: string
          orden?: number
          region: Database["public"]["Enums"]["region_zona"]
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          foto_url?: string | null
          id?: string
          nombre?: string
          orden?: number
          region?: Database["public"]["Enums"]["region_zona"]
          slug?: string
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
      canal_lead: "web" | "whatsapp" | "telefono" | "presencial" | "otro"
      estado_lead:
        | "nuevo"
        | "contactado"
        | "calificado"
        | "descartado"
        | "convertido"
      estado_propiedad:
        | "borrador"
        | "activa"
        | "reservada"
        | "cerrada"
        | "despublicada"
      estado_tasacion: "solicitada" | "en_proceso" | "completada" | "descartada"
      moneda: "USD" | "ARS"
      operacion: "venta" | "alquiler" | "alquiler_temporario"
      region_zona:
        | "capital_federal"
        | "gba_norte"
        | "gba_oeste"
        | "gba_sur"
        | "costa_atlantica"
        | "otros"
      tipo_interaccion: "llamada" | "whatsapp" | "email" | "visita" | "nota"
      tipo_propiedad:
        | "departamento"
        | "casa"
        | "ph"
        | "terreno"
        | "local"
        | "oficina"
        | "cochera"
        | "emprendimiento"
      tipo_propiedad_tasacion:
        | "departamento"
        | "casa"
        | "ph"
        | "terreno"
        | "local"
        | "oficina"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      canal_lead: ["web", "whatsapp", "telefono", "presencial", "otro"],
      estado_lead: [
        "nuevo",
        "contactado",
        "calificado",
        "descartado",
        "convertido",
      ],
      estado_propiedad: [
        "borrador",
        "activa",
        "reservada",
        "cerrada",
        "despublicada",
      ],
      estado_tasacion: ["solicitada", "en_proceso", "completada", "descartada"],
      moneda: ["USD", "ARS"],
      operacion: ["venta", "alquiler", "alquiler_temporario"],
      region_zona: [
        "capital_federal",
        "gba_norte",
        "gba_oeste",
        "gba_sur",
        "costa_atlantica",
        "otros",
      ],
      tipo_interaccion: ["llamada", "whatsapp", "email", "visita", "nota"],
      tipo_propiedad: [
        "departamento",
        "casa",
        "ph",
        "terreno",
        "local",
        "oficina",
        "cochera",
        "emprendimiento",
      ],
      tipo_propiedad_tasacion: [
        "departamento",
        "casa",
        "ph",
        "terreno",
        "local",
        "oficina",
      ],
    },
  },
} as const
