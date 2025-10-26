import { useState } from "react";
import "./App.css";
import { ScriptSelector } from "./components/ScriptSelector";
import { FlashcardGame } from "./components/FlashcardGame";

function App() {
  const [selectedScript, setSelectedScript] = useState<string | null>(null);
  const [includeTravellers, setIncludeTravellers] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [unreleasedUnlocked, setUnreleasedUnlocked] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState<number | null>(null);

  const handleReservedClick = () => {
    // Clear any existing timer
    if (clickTimer) {
      clearTimeout(clickTimer);
    }

    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 4) {
      setUnreleasedUnlocked(true);
      setClickCount(0);
    } else {
      // Reset counter after 2 seconds if not completed
      const timer = window.setTimeout(() => {
        setClickCount(0);
      }, 2000);
      setClickTimer(timer);
    }
  };

  return (
    <div className="app">
        {!gameStarted && (
          <header className="app-header">
            <h1>{unreleasedUnlocked && "⭐️ "}Clocktower Role Revision</h1>
          </header>
        )}

        <main className="app-main">
        {!gameStarted ? (
          <ScriptSelector
            selectedScript={selectedScript}
            onScriptSelect={setSelectedScript}
            includeTravellers={includeTravellers}
            onToggleTravellers={setIncludeTravellers}
            onContinue={() => setGameStarted(true)}
            unreleasedUnlocked={unreleasedUnlocked}
          />
        ) : (
          <div className="game-container">
            <button
              className="back-button"
              onClick={() => {
                setGameStarted(false);
                setSelectedScript(null);
              }}
            >
              ← Back to Script Selection
            </button>
            <FlashcardGame
              selectedScript={selectedScript!}
              includeTravellers={includeTravellers}
              onReturnToSelection={() => {
                setGameStarted(false);
                setSelectedScript(null);
              }}
              unreleasedUnlocked={unreleasedUnlocked}
            />
          </div>
        )}
      </main>
      <footer className="app-footer">
        <div className="footer-content">
          <p>
            Blood on the Clocktower™ © 2019 - 2025 The Pandemonium Institute
            Ltd. All rights{" "}
            <span
              onClick={handleReservedClick}
              style={{ cursor: "default", userSelect: "none" }}
            >
              reserved
            </span>
            .
          </p>
          <p>
            This is an unofficial fan-made study tool. All character names,
            abilities, and artwork are the property of The Pandemonium Institute
            Ltd.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
