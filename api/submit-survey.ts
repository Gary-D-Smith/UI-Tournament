import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const data = req.body

    // Validate required fields
    if (!data.firstName || !data.lastName || !data.completeRankingTable) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase environment variables are not set')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Insert survey data into Supabase
    // Supabase automatically converts JavaScript objects to JSONB
    const { error } = await supabase
      .from('survey_results')
      .insert({
        first_name: data.firstName,
        last_name: data.lastName,
        timestamp: data.timestamp,
        round1_results: data.round1,
        tournament_results: data.tournamentResults,
        final_ranking: data.finalRanking,
        complete_ranking_table: data.completeRankingTable,
        summary: data.summary,
      })

    if (error) {
      console.error('Supabase error:', error)
      throw error
    }

    return res.status(200).json({ 
      success: true,
      message: 'Survey submitted successfully' 
    })
  } catch (error) {
    console.error('Error submitting survey:', error)
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

