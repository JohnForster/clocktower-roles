import { useState } from 'react'
import './App.css'
import { ScriptSelector } from './components/ScriptSelector'
import { FlashcardGame } from './components/FlashcardGame'

function App() {
  const [selectedScript, setSelectedScript] = useState<string | null>(null)
  const [includeTravellers, setIncludeTravellers] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)

  return (
    <div className="app">
      <header className="app-header">
        <h1>Blood on the Clocktower Flashcards</h1>
      </header>
      
      <main className="app-main">
        {!gameStarted ? (
          <ScriptSelector
            selectedScript={selectedScript}
            onScriptSelect={setSelectedScript}
            includeTravellers={includeTravellers}
            onToggleTravellers={setIncludeTravellers}
            onContinue={() => setGameStarted(true)}
          />
        ) : (
          <div className="game-container">
            <button 
              className="back-button"
              onClick={() => {
                setGameStarted(false)
                setSelectedScript(null)
              }}
            >
              ← Back to Script Selection
            </button>
            <FlashcardGame 
              selectedScript={selectedScript!} 
              includeTravellers={includeTravellers}
            />
          </div>
        )}
      </main>
    </div>
  )
}

export default App