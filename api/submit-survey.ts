import type { VercelRequest, VercelResponse } from '@vercel/node'

// This API route will work with Supabase or any PostgreSQL database
// For Vercel Postgres, you can use @vercel/postgres instead

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

    // Option 1: Using Supabase (recommended for free tier)
    // Uncomment and configure if using Supabase:
    /*
    import { createClient } from '@supabase/supabase-js'
    
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    )

    const { error } = await supabase
      .from('survey_results')
      .insert({
        first_name: data.firstName,
        last_name: data.lastName,
        timestamp: data.timestamp,
        round1_results: JSON.stringify(data.round1),
        tournament_results: JSON.stringify(data.tournamentResults),
        final_ranking: JSON.stringify(data.finalRanking),
        complete_ranking_table: JSON.stringify(data.completeRankingTable),
        summary: JSON.stringify(data.summary),
      })

    if (error) {
      throw error
    }
    */

    // Option 2: Using Vercel Postgres
    // Uncomment and configure if using Vercel Postgres:
    /*
    import { sql } from '@vercel/postgres'
    
    await sql`
      INSERT INTO survey_results (
        first_name, last_name, timestamp,
        round1_results, tournament_results, final_ranking,
        complete_ranking_table, summary
      ) VALUES (
        ${data.firstName},
        ${data.lastName},
        ${data.timestamp},
        ${JSON.stringify(data.round1)},
        ${JSON.stringify(data.tournamentResults)},
        ${JSON.stringify(data.finalRanking)},
        ${JSON.stringify(data.completeRankingTable)},
        ${JSON.stringify(data.summary)}
      )
    `
    */

    // For now, just log the data (remove this in production)
    console.log('Survey submission received:', {
      firstName: data.firstName,
      lastName: data.lastName,
      timestamp: data.timestamp,
      rankingTableRows: data.completeRankingTable.length,
    })

    // TODO: Replace with actual database insert once database is configured
    // For testing, you can temporarily store in a file or use a simple database

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

