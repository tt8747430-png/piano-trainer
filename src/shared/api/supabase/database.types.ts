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
      is_content_editor: { Args: never; Returns: boolean }
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
