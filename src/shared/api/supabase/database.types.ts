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
