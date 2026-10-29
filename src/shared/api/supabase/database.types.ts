// The database's types, as Supabase generates them from the project's schema
// (`supabase gen types typescript`), with the nine identical mirror tables written once as
// `DocumentTable`. After a migration, generate them again and bring this file level with them.

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

/** One learner's document in a mirror table (supabase/migrations). */
interface DocumentTable {
  Row: { data: Json; deleted: boolean; id: string; updated_at: string; user_id: string }
  Insert: { data: Json; deleted?: boolean; id: string; updated_at?: string; user_id?: string }
  Update: { data?: Json; deleted?: boolean; id?: string; updated_at?: string; user_id?: string }
  Relationships: []
}

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.18'
  }
  public: {
    Tables: {
      account_deletions: {
        Row: { purge_after: string; requested_at: string; user_id: string }
        Insert: { purge_after: string; requested_at?: string; user_id: string }
        Update: { purge_after?: string; requested_at?: string; user_id?: string }
        Relationships: []
      }
      content_items: {
        Row: {
          audience: string
          body: Json
          id: string
          kind: string
          meta: Json
          size: number | null
          status: string
          updated_at: string
          version: string
        }
        Insert: {
          audience?: string
          body: Json
          id: string
          kind: string
          meta?: Json
          status?: string
          updated_at?: string
          version: string
        }
        Update: {
          audience?: string
          body?: Json
          id?: string
          kind?: string
          meta?: Json
          status?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      content_drafts: {
        Row: {
          body: Json
          id: string
          kind: string
          meta: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          body: Json
          id: string
          kind: string
          meta?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: { body?: Json; meta?: Json; updated_at?: string; updated_by?: string | null }
        Relationships: []
      }
      content_versions: {
        Row: {
          body: Json
          id: string
          kind: string
          meta: Json
          published_at: string
          version: string
        }
        Insert: {
          body: Json
          id: string
          kind: string
          meta: Json
          published_at?: string
          version: string
        }
        Update: {
          body?: Json
          id?: string
          kind?: string
          meta?: Json
          published_at?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: 'content_versions_kind_id_fkey'
            columns: ['kind', 'id']
            isOneToOne: false
            referencedRelation: 'content_items'
            referencedColumns: ['kind', 'id']
          },
        ]
      }
      public_items: {
        Row: {
          author_id: string
          author_name: string
          body: Json
          hidden: boolean
          id: string
          kind: string
          meta: Json
          published_at: string
          saves: number
          size: number | null
          source_id: string
          title: string
          updated_at: string
          version: string
        }
        Insert: {
          author_id?: string
          author_name: string
          body: Json
          hidden?: boolean
          id?: string
          kind?: string
          meta?: Json
          published_at?: string
          saves?: number
          source_id: string
          title: string
          updated_at?: string
          version: string
        }
        Update: {
          author_name?: string
          body?: Json
          meta?: Json
          title?: string
          version?: string
        }
        Relationships: []
      }
      public_reports: {
        Row: {
          item_id: string
          note: string
          reason: string
          reported_at: string
          reporter_id: string
        }
        Insert: {
          item_id: string
          note?: string
          reason: string
          reported_at?: string
          reporter_id?: string
        }
        Update: { note?: string; reason?: string }
        Relationships: [
          {
            foreignKeyName: 'public_reports_item_id_fkey'
            columns: ['item_id']
            isOneToOne: false
            referencedRelation: 'public_items'
            referencedColumns: ['id']
          },
        ]
      }
      public_saves: {
        Row: { item_id: string; saved_at: string; user_id: string }
        Insert: { item_id: string; saved_at?: string; user_id: string }
        Update: { saved_at?: string }
        Relationships: [
          {
            foreignKeyName: 'public_saves_item_id_fkey'
            columns: ['item_id']
            isOneToOne: false
            referencedRelation: 'public_items'
            referencedColumns: ['id']
          },
        ]
      }
      publish_blocks: {
        Row: { blocked_at: string; user_id: string }
        Insert: { blocked_at?: string; user_id: string }
        Update: { blocked_at?: string }
        Relationships: []
      }
      admin_log: {
        Row: {
          action: string
          admin_id: string | null
          at: string
          detail: Json
          id: number
          target: string
        }
        Insert: {
          action: string
          admin_id?: string | null
          at?: string
          detail?: Json
          target?: string
        }
        Update: { action?: string; detail?: Json; target?: string }
        Relationships: []
      }
      error_reports: {
        Row: {
          agent: string
          at: string
          build: string
          id: string
          message: string
          path: string
          stack: string
          user_id: string | null
        }
        Insert: {
          agent?: string
          at?: string
          build?: string
          id?: string
          message: string
          path?: string
          stack?: string
          user_id?: string | null
        }
        Update: never
        Relationships: []
      }
      feature_switches: {
        Row: { groups: string[]; key: string; label: string; state: string; updated_at: string }
        Insert: {
          groups?: string[]
          key: string
          label: string
          state?: string
          updated_at?: string
        }
        Update: {
          groups?: string[]
          key?: string
          label?: string
          state?: string
          updated_at?: string
        }
        Relationships: []
      }
      group_members: {
        Row: { added_at: string; group_id: string; user_id: string }
        Insert: { added_at?: string; group_id: string; user_id: string }
        Update: { added_at?: string }
        Relationships: [
          {
            foreignKeyName: 'group_members_group_id_fkey'
            columns: ['group_id']
            isOneToOne: false
            referencedRelation: 'groups'
            referencedColumns: ['id']
          },
        ]
      }
      groups: {
        Row: { created_at: string; id: string; name: string }
        Insert: { created_at?: string; id?: string; name: string }
        Update: { name?: string }
        Relationships: []
      }
      diagram_inversions: DocumentTable
      library: DocumentTable
      patterns: DocumentTable
      pieces: DocumentTable
      profiles: DocumentTable
      progress: DocumentTable
      settings: DocumentTable
      takes: DocumentTable
      views: DocumentTable
    }
    Views: { [_ in never]: never }
    Functions: {
      invoke_purge_account: { Args: never; Returns: undefined }
      hide_public_item: { Args: { p_hidden: boolean; p_item: string }; Returns: undefined }
      is_admin: { Args: never; Returns: boolean }
      is_content_editor: { Args: never; Returns: boolean }
      my_features: { Args: never; Returns: string[] }
      publish_content: {
        Args: { p_from_version?: string; p_id: string; p_kind: string; p_version: string }
        Returns: undefined
      }
      is_publish_blocked: { Args: never; Returns: boolean }
      save_public_item: { Args: { p_item: string }; Returns: number }
      push_documents: { Args: { p_rows: Json; p_table: string }; Returns: Json }
    }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

/** The tables that hold a learner's documents: what a sync pulls and pushes. */
export type DocumentTableName = {
  [
    Name in keyof Database['public']['Tables']
  ]: Database['public']['Tables'][Name] extends DocumentTable ? Name : never
}[keyof Database['public']['Tables']]
