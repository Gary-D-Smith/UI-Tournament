import { useState } from 'react'
import Round1 from './components/Round1'
import Round2 from './components/Round2'
import Results from './components/Results'
import NameForm from './components/NameForm'
import { Round1Response, TournamentResult } from './types'

type SurveyPhase = 'intro' | 'name' | 'round1' | 'round2' | 'results'

interface UserInfo {
  firstName: string
  lastName: string
}

function App() {
  const [phase, setPhase] = useState<SurveyPhase>('intro')
  const [userInfo, setUserInfo] = useState<UserInfo>({ firstName: '', lastName: '' })
  const [round1Results, setRound1Results] = useState<Round1Response[]>([])
  const [tournamentResults, setTournamentResults] = useState<TournamentResult[]>([])

  const handleNameSubmit = (firstName: string, lastName: string) => {
    setUserInfo({ firstName, lastName })
    setPhase('round1')
  }

  const handleRound1Complete = (results: Round1Response[]) => {
    setRound1Results(results)
    setPhase('round2')
  }

  const handleRound2Complete = (results: TournamentResult[]) => {
    setTournamentResults(results)
    setPhase('results')
  }

  const handleStart = () => {
    setPhase('name')
  }

  const handleReset = () => {
    setPhase('intro')
    setUserInfo({ firstName: '', lastName: '' })
    setRound1Results([])
    setTournamentResults([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        {phase === 'intro' && (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
              PSY360 Survey Platform
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Welcome to the tournament-style survey. This study consists of two rounds:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
              <li><strong>Round 1:</strong> Select UI version A or B for 5 component designs</li>
              <li><strong>Round 2:</strong> Swiss-style tournament with 32 UI designs</li>
            </ul>
            <p className="text-sm text-gray-500 mb-6">
              Your responses will help us understand UI design preferences. Please take your time and make thoughtful selections.
            </p>
            <button
              onClick={handleStart}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Start Survey
            </button>
          </div>
        )}

        {phase === 'name' && (
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Please Enter Your Information
            </h1>
            <NameForm onSubmit={handleNameSubmit} />
          </div>
        )}

        {phase === 'round1' && (
          <Round1 onComplete={handleRound1Complete} />
        )}

        {phase === 'round2' && (
          <Round2 onComplete={handleRound2Complete} />
        )}

        {phase === 'results' && (
          <Results
            userInfo={userInfo}
            round1Results={round1Results}
            tournamentResults={tournamentResults}
          />
        )}
      </div>
    </div>
  )
}

export default App

