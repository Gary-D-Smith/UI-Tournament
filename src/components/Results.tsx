import { useState } from 'react'
import { Round1Response, TournamentResult } from '../types'

const COMBINED_DESIGNS = [
  'AAAAA.png', 'AAAAB.png', 'AAABA.png', 'AAABB.png',
  'AABAA.png', 'AABAB.png', 'AABBA.png', 'AABBB.png',
  'ABAAA.png', 'ABAAB.png', 'ABABA.png', 'ABABB.png',
  'ABBAA.png', 'ABBAB.png', 'ABBBA.png', 'ABBBB.png',
  'BAAAA.png', 'BAAAB.png', 'BAABA.png', 'BAABB.png',
  'BABAA.png', 'BABAB.png', 'BABBA.png', 'BABBB.png',
  'BBAAA.png', 'BBAAB.png', 'BBABA.png', 'BBABB.png',
  'BBBAA.png', 'BBBAB.png', 'BBBBA.png', 'BBBBB.png',
]

function getDesignName(uiId: number): string {
  if (uiId < 1 || uiId > 32) return ''
  return COMBINED_DESIGNS[uiId - 1].replace('.png', '')
}

interface UserInfo {
  firstName: string
  lastName: string
}

interface ResultsProps {
  userInfo: UserInfo
  round1Results: Round1Response[]
  tournamentResults: TournamentResult[]
}

export default function Results({ userInfo, round1Results, tournamentResults }: ResultsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  
  // Sort all results
  const sortedResults = [...tournamentResults].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins
    if (b.winPercentage !== a.winPercentage) return (b.winPercentage || 0) - (a.winPercentage || 0)
    return a.losses - b.losses
  })

  const topUI = sortedResults[0]?.uiId

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmitStatus('idle')

    const finalRanking = sortedResults.map(r => r.uiId)
    const completeRankingTable = sortedResults.map((result, index) => ({
      rank: index + 1,
      uiId: result.uiId,
      designName: getDesignName(result.uiId),
      wins: result.wins,
      losses: result.losses,
      totalMatches: result.totalMatches || 0,
      winPercentage: result.winPercentage || 0,
    }))

    const data = {
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      timestamp: new Date().toISOString(),
      round1: round1Results,
      tournamentResults: tournamentResults,
      finalRanking: finalRanking,
      completeRankingTable: completeRankingTable,
      summary: {
        topUI,
        preferredComponents: round1Results.map(r => ({
          component: r.componentType,
          preferred: r.selected,
        })),
      },
    }

    try {
      const response = await fetch('/api/submit-survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to submit survey')
      }

      setSubmitStatus('success')
    } catch (error) {
      console.error('Error submitting survey:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Survey Complete</h2>
      
      <div className="text-center mb-8">
        <p className="text-lg text-gray-600 mb-4">
          Thank you for completing the survey, {userInfo.firstName}!
        </p>
        <p className="text-gray-500 mb-6">
          Your responses have been recorded. Please click the button below to submit your results.
        </p>
      </div>

      {submitStatus === 'success' && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 text-center font-semibold">
            ✓ Survey submitted successfully! Thank you for your participation.
          </p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-center">
            There was an error submitting your survey. Please try again.
          </p>
        </div>
      )}

      <div className="flex gap-4 justify-center">
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || submitStatus === 'success'}
          className="px-8 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors text-lg"
        >
          {isSubmitting ? 'Submitting...' : submitStatus === 'success' ? 'Submitted ✓' : 'SUBMIT SURVEY'}
        </button>
      </div>
    </div>
  )
}

