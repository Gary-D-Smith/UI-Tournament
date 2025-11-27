import { useState, useEffect } from 'react'
import { TournamentMatch, TournamentRound, TournamentResult } from '../types'

const TOTAL_UIS = 32

// Combined design filenames in order (alphabetically sorted)
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

function getDesignImage(uiId: number): string {
  if (uiId < 1 || uiId > TOTAL_UIS) return ''
  return `/Designs/Combined/${COMBINED_DESIGNS[uiId - 1]}`
}

function getDesignName(uiId: number): string {
  if (uiId < 1 || uiId > TOTAL_UIS) return ''
  return COMBINED_DESIGNS[uiId - 1].replace('.png', '')
}

// Fisher-Yates shuffle for randomization
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Simple pairing function for single-elimination
function pairUp(uiIds: number[]): TournamentMatch[] {
  const shuffled = shuffleArray([...uiIds])
  const matches: TournamentMatch[] = []
  for (let i = 0; i < shuffled.length; i += 2) {
    if (i + 1 < shuffled.length) {
      matches.push({
        id: matches.length + 1,
        left: shuffled[i],
        right: shuffled[i + 1],
      })
    } else {
      // Handle odd number with bye
      matches.push({
        id: matches.length + 1,
        left: shuffled[i],
        right: shuffled[i], // Bye
      })
    }
  }
  return matches
}

interface Round2Props {
  onComplete: (results: TournamentResult[]) => void
}

type BracketType = 'winners' | 'round1LosersRanking'

interface TournamentState {
  winnersBracket: number[]  // Designs still in winners bracket
  eliminatedDesigns: number[]  // Designs that have been eliminated (for final ranking only)
  round1Losers: number[]  // Designs that lost in Round 1 (for ranking)
  currentRound: number
  currentBracket: BracketType
  currentMatchIndex: number
  allMatches: TournamentMatch[]
  rounds: TournamentRound[]
}

export default function Round2({ onComplete }: Round2Props) {
  // Randomize initial UI order
  const [uiIds] = useState<number[]>(() => shuffleArray(Array.from({ length: TOTAL_UIS }, (_, i) => i + 1)))
  const [hoveredDesign, setHoveredDesign] = useState<'left' | 'right' | null>(null)
  const [state, setState] = useState<TournamentState>({
    winnersBracket: [],
    eliminatedDesigns: [],
    round1Losers: [],
    currentRound: 0,
    currentBracket: 'winners',
    currentMatchIndex: 0,
    allMatches: [],
    rounds: [],
  })

  // Initialize first round
  useEffect(() => {
    if (state.rounds.length === 0 && uiIds.length > 0) {
      const firstRoundMatches = pairUp(uiIds)
      const firstRound: TournamentRound = {
        roundNumber: 1,
        matches: firstRoundMatches,
      }
      setState(prevState => ({
        ...prevState,
        winnersBracket: uiIds,
        eliminatedDesigns: [],
        round1Losers: [],
        rounds: [firstRound],
        allMatches: firstRoundMatches,
        currentRound: 0,
        currentMatchIndex: 0,
      }))
    }
  }, [uiIds])

  const currentRoundData = state.rounds[state.currentRound]
  const currentMatch = currentRoundData?.matches[state.currentMatchIndex]

  const handleSelect = (winnerId: number) => {
    if (!currentMatch) return

    const updatedMatch = { ...currentMatch, winner: winnerId }
    const updatedMatches = [...state.allMatches]
    const matchIndex = updatedMatches.findIndex(
      m => m.id === currentMatch.id && m.left === currentMatch.left && m.right === currentMatch.right
    )
    
    if (matchIndex !== -1) {
      updatedMatches[matchIndex] = updatedMatch
    } else {
      updatedMatches.push(updatedMatch)
    }

    // Update the round's matches
    const updatedRounds = [...state.rounds]
    const roundMatchIndex = updatedRounds[state.currentRound].matches.findIndex(
      m => m.id === currentMatch.id && m.left === currentMatch.left && m.right === currentMatch.right
    )
    if (roundMatchIndex !== -1) {
      updatedRounds[state.currentRound].matches[roundMatchIndex] = updatedMatch
    }

    // Update matches immediately
    setHoveredDesign(null)
    setState({
      ...state,
      allMatches: updatedMatches,
      rounds: updatedRounds,
    })

    // Move to next match automatically with delay (like Round 1)
    if (state.currentMatchIndex < currentRoundData.matches.length - 1) {
      setTimeout(() => {
        setState(prevState => ({
          ...prevState,
          currentMatchIndex: prevState.currentMatchIndex + 1,
        }))
      }, 300)
    } else {
      // Round complete, process results
      setTimeout(() => {
        handleRoundComplete(updatedMatches, updatedRounds)
      }, 300)
    }
  }

  const handleNext = () => {
    if (!currentRoundData) return
    if (state.currentMatchIndex < currentRoundData.matches.length - 1) {
      setState({
        ...state,
        currentMatchIndex: state.currentMatchIndex + 1,
      })
    } else {
      // Last match, complete the round
      handleRoundComplete(state.allMatches, state.rounds)
    }
  }

  const handlePrevious = () => {
    if (state.currentMatchIndex > 0) {
      setState({
        ...state,
        currentMatchIndex: state.currentMatchIndex - 1,
      })
    }
  }

  const handleRoundComplete = (matches: TournamentMatch[], rounds: TournamentRound[]) => {
    const currentRoundMatches = rounds[state.currentRound].matches.filter(m => m.winner)
    
    // Determine winners and losers from current round
    const winners = new Set<number>()
    const losers = new Set<number>()
    
    currentRoundMatches.forEach(match => {
      if (match.winner) {
        winners.add(match.winner)
        if (match.left === match.winner) {
          if (match.right !== match.left) losers.add(match.right)
        } else {
          losers.add(match.left)
        }
      }
    })

    const winnerList = Array.from(winners)
    const loserList = Array.from(losers)

    if (state.currentBracket === 'winners') {
      // Winners bracket: winners advance, losers are eliminated
      const newWinnersBracket = winnerList
      const newEliminatedDesigns = [...state.eliminatedDesigns, ...loserList]
      
      // Track Round 1 losers separately
      let newRound1Losers = state.round1Losers
      if (state.currentRound === 0) {
        // This is Round 1, so these losers are Round 1 losers
        newRound1Losers = loserList
      }
      
      if (newWinnersBracket.length === 1) {
        // Tournament complete - champion determined
        // Do one ranking round with Round 1 losers if we have them
        if (newRound1Losers.length > 1) {
          const rankingMatches = pairUp(newRound1Losers)
          const rankingRound: TournamentRound = {
            roundNumber: rounds.length + 1,
            matches: rankingMatches,
          }
          const updatedRoundsWithRanking = [...rounds, rankingRound]
          setState(prevState => ({
            ...prevState,
            winnersBracket: newWinnersBracket,
            eliminatedDesigns: newEliminatedDesigns,
            round1Losers: newRound1Losers,
            currentRound: updatedRoundsWithRanking.length - 1,
            currentBracket: 'round1LosersRanking',
            currentMatchIndex: 0,
            allMatches: matches,
            rounds: updatedRoundsWithRanking,
          }))
          return
        } else {
          // No Round 1 losers to rank, tournament complete
          finalizeResults(matches)
          return
        }
      } else {
        // Continue winners bracket
        const nextRoundMatches = pairUp(newWinnersBracket)
        const nextRoundData: TournamentRound = {
          roundNumber: rounds.length + 1,
          matches: nextRoundMatches,
        }
        const updatedRoundsWithNext = [...rounds, nextRoundData]
        setState(prevState => ({
          ...prevState,
          winnersBracket: newWinnersBracket,
          eliminatedDesigns: newEliminatedDesigns,
          round1Losers: newRound1Losers,
          currentRound: updatedRoundsWithNext.length - 1,
          currentBracket: 'winners',
          currentMatchIndex: 0,
          allMatches: matches,
          rounds: updatedRoundsWithNext,
        }))
        return
      }
    } else if (state.currentBracket === 'round1LosersRanking') {
      // Ranking round for Round 1 losers complete
      finalizeResults(matches)
      return
    }
  }

  const finalizeResults = (matches: TournamentMatch[]) => {
    // Calculate results for all UIs
    const results: TournamentResult[] = uiIds.map(uiId => {
      const wins = matches.filter(m => m.winner === uiId).length
      const losses = matches.filter(m => 
        (m.left === uiId || m.right === uiId) && m.winner && m.winner !== uiId
      ).length
      const totalMatches = wins + losses
      const winPercentage = totalMatches > 0 ? (wins / totalMatches) * 100 : 0

      return {
        uiId,
        wins,
        losses,
        totalMatches,
        winPercentage,
      }
    })

    // Sort by wins (descending), then by win percentage (descending), then by losses (ascending)
    results.sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins
      if (b.winPercentage !== a.winPercentage) return b.winPercentage! - a.winPercentage!
      return a.losses - b.losses
    })

    // Assign final ranks
    results.forEach((result, index) => {
      result.finalRank = index + 1
    })

    onComplete(results)
  }

  if (!currentMatch) {
    // Show loading only if rounds haven't been initialized yet
    if (state.rounds.length === 0) {
      return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-xl text-gray-600">Initializing tournament...</p>
        </div>
      )
    }
    // Otherwise show processing results
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <p className="text-xl text-gray-600">Processing results...</p>
      </div>
    )
  }

  // Handle bye (same UI on both sides)
  const isBye = currentMatch.left === currentMatch.right
  const bracketLabels: Record<BracketType, string> = {
    winners: 'Winners',
    round1LosersRanking: 'Ranking Round 1 Losers',
  }
  const bracketLabel = bracketLabels[state.currentBracket]
  const totalMatches = currentRoundData.matches.length
  const progress = ((state.currentMatchIndex + 1) / totalMatches) * 100

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8 min-h-[700px]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Round 2: Tournament - Round {currentRoundData.roundNumber} ({bracketLabel} Bracket)
        </h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-gray-900 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {isBye ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">{getDesignName(currentMatch.left)} receives a bye this round.</p>
          <button
            onClick={() => handleSelect(currentMatch.left)}
            className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Continue
          </button>
        </div>
      ) : (
        <>
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Select your preferred design
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <button
              onClick={() => handleSelect(currentMatch.left)}
              onMouseEnter={() => setHoveredDesign('left')}
              onMouseLeave={() => setHoveredDesign(null)}
              className={`p-4 rounded-lg transition-all duration-300 relative ${
                currentMatch.winner === currentMatch.left
                  ? 'border-4 border-gray-900 bg-gray-100'
                  : hoveredDesign === 'left'
                  ? 'border-4 border-green-500'
                  : 'border-0'
              }`}
            >
              <div className="text-xl font-bold text-gray-700 mb-3">Left Design</div>
              <div className="w-full h-96 rounded overflow-hidden">
                <div className={`w-full h-full transition-transform duration-300 ${
                  hoveredDesign === 'left' ? 'scale-105' : hoveredDesign === 'right' ? 'scale-95' : ''
                }`}>
                  <img 
                    src={getDesignImage(currentMatch.left)} 
                    alt={`Design ${getDesignName(currentMatch.left)}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </button>

            <button
              onClick={() => handleSelect(currentMatch.right)}
              onMouseEnter={() => setHoveredDesign('right')}
              onMouseLeave={() => setHoveredDesign(null)}
              className={`p-4 rounded-lg transition-all duration-300 relative ${
                currentMatch.winner === currentMatch.right
                  ? 'border-4 border-gray-900 bg-gray-100'
                  : hoveredDesign === 'right'
                  ? 'border-4 border-green-500'
                  : 'border-0'
              }`}
            >
              <div className="text-xl font-bold text-gray-700 mb-3">Right Design</div>
              <div className="w-full h-96 rounded overflow-hidden">
                <div className={`w-full h-full transition-transform duration-300 ${
                  hoveredDesign === 'right' ? 'scale-105' : hoveredDesign === 'left' ? 'scale-95' : ''
                }`}>
                  <img 
                    src={getDesignImage(currentMatch.right)} 
                    alt={`Design ${getDesignName(currentMatch.right)}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            </button>
          </div>
        </>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevious}
          disabled={state.currentMatchIndex === 0}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors"
        >
          Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!currentMatch?.winner}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
        >
          {state.currentMatchIndex < totalMatches - 1 ? 'Next' : 'Complete Round'}
        </button>
      </div>
    </div>
  )
}
