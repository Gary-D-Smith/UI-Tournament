import { useState } from 'react'
import { Round1Response, ComponentType } from '../types'

const COMPONENT_TYPES: ComponentType[] = ['addButton', 'background', 'checkStyle', 'checkboxType', 'title']

// Map component types to display names and image filenames
const COMPONENT_CONFIG: Record<ComponentType, { displayName: string; imageA: string; imageB: string }> = {
  addButton: {
    displayName: 'Add Button',
    imageA: '/Designs/Components/Add Button A.png',
    imageB: '/Designs/Components/Add Button B.png',
  },
  background: {
    displayName: 'Background',
    imageA: '/Designs/Components/Background A.png',
    imageB: '/Designs/Components/Background B.png',
  },
  checkStyle: {
    displayName: 'Check Style',
    imageA: '/Designs/Components/Check Style A.png',
    imageB: '/Designs/Components/Check Style B.png',
  },
  checkboxType: {
    displayName: 'Checkbox Type',
    imageA: '/Designs/Components/Checkbox Type A.png',
    imageB: '/Designs/Components/Checkbox Type B.png',
  },
  title: {
    displayName: 'Title',
    imageA: '/Designs/Components/Title A.png',
    imageB: '/Designs/Components/Title B.png',
  },
}

interface Round1Props {
  onComplete: (results: Round1Response[]) => void
}

export default function Round1({ onComplete }: Round1Props) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hoveredVersion, setHoveredVersion] = useState<'A' | 'B' | null>(null)
  const [selections, setSelections] = useState<Record<ComponentType, 'A' | 'B' | null>>({
    addButton: null,
    background: null,
    checkStyle: null,
    checkboxType: null,
    title: null,
  })

  const currentComponent = COMPONENT_TYPES[currentIndex]
  const isComplete = currentIndex === COMPONENT_TYPES.length - 1 && selections[currentComponent] !== null

  const handleSelect = (choice: 'A' | 'B') => {
    const newSelections = { ...selections, [currentComponent]: choice }
    setSelections(newSelections)

    if (currentIndex < COMPONENT_TYPES.length - 1) {
      setTimeout(() => {
        setCurrentIndex(currentIndex + 1)
      }, 300)
    }
  }

  const handleNext = () => {
    if (currentIndex < COMPONENT_TYPES.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handleComplete = () => {
    const results: Round1Response[] = COMPONENT_TYPES.map(componentType => ({
      componentType,
      selected: selections[componentType]!,
    }))
    onComplete(results)
  }

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8 min-h-[700px]">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Round 1: Component Selection</h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-gray-900 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / COMPONENT_TYPES.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          Select your preferred version for:{' '}
          <span className="text-gray-900">{COMPONENT_CONFIG[currentComponent].displayName}</span>
        </h3>
        <p className="text-gray-500">Choose between version A or B</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <button
          onClick={() => handleSelect('A')}
          onMouseEnter={() => setHoveredVersion('A')}
          onMouseLeave={() => setHoveredVersion(null)}
          className={`p-4 rounded-lg transition-all duration-300 relative ${
            selections[currentComponent] === 'A'
              ? 'border-4 border-gray-900 bg-gray-100'
              : hoveredVersion === 'A'
              ? 'border-4 border-green-500'
              : 'border-0'
          }`}
        >
          <div className="text-xl font-bold text-gray-700 mb-3">Version A</div>
          <div className="w-full h-96 rounded overflow-hidden bg-white">
            <div
              className={`w-full h-full transition-transform duration-300 ${
                hoveredVersion === 'A' ? 'scale-105' : hoveredVersion === 'B' ? 'scale-95' : ''
              }`}
            >
              <img
                src={COMPONENT_CONFIG[currentComponent].imageA}
                alt={`${COMPONENT_CONFIG[currentComponent].displayName} A`}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </button>

        <button
          onClick={() => handleSelect('B')}
          onMouseEnter={() => setHoveredVersion('B')}
          onMouseLeave={() => setHoveredVersion(null)}
          className={`p-4 rounded-lg transition-all duration-300 relative ${
            selections[currentComponent] === 'B'
              ? 'border-4 border-gray-900 bg-gray-100'
              : hoveredVersion === 'B'
              ? 'border-4 border-green-500'
              : 'border-0'
          }`}
        >
          <div className="text-xl font-bold text-gray-700 mb-3">Version B</div>
          <div className="w-full h-96 rounded overflow-hidden bg-white">
            <div
              className={`w-full h-full transition-transform duration-300 ${
                hoveredVersion === 'B' ? 'scale-105' : hoveredVersion === 'A' ? 'scale-95' : ''
              }`}
            >
              <img
                src={COMPONENT_CONFIG[currentComponent].imageB}
                alt={`${COMPONENT_CONFIG[currentComponent].displayName} B`}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </button>
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-400 transition-colors"
        >
          Previous
        </button>

        {isComplete ? (
          <button
            onClick={handleComplete}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Complete Round 1
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={selections[currentComponent] === null}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </div>
  )
}

