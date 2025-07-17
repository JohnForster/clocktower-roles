import React, { useState, useEffect } from "react";
import { getAvailableScripts } from "../utils/dataLoader";

interface ScriptSelectorProps {
  selectedScript: string | null;
  onScriptSelect: (script: string) => void;
  includeTravellers: boolean;
  onToggleTravellers: (include: boolean) => void;
  onContinue: () => void;
}

export const ScriptSelector: React.FC<ScriptSelectorProps> = ({
  selectedScript,
  onScriptSelect,
  includeTravellers,
  onToggleTravellers,
  onContinue,
}) => {
  const [scripts, setScripts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScripts = async () => {
      try {
        const availableScripts = await getAvailableScripts();
        setScripts(availableScripts);
      } catch (error) {
        console.error("Failed to load scripts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadScripts();
  }, []);

  // Handle script selection changes
  const handleScriptSelect = (script: string) => {
    onScriptSelect(script);
    // Auto-enable travellers when Travellers script is selected
    if (script === "Travellers") {
      onToggleTravellers(true);
    }
  };

  // Focus on the main scripts you mentioned
  const priorityScripts = [
    "Trouble Brewing",
    "Bad Moon Rising",
    "Sects and Violets",
    "The Carousel",
    "Base 3",
  ];

  const orderedScripts = [
    ...priorityScripts.filter((script) => scripts.includes(script)),
    ...scripts.filter(
      (script) => !priorityScripts.includes(script) && script !== "Travellers" && script !== "All"
    ),
    "Travellers", // Add Travellers before "All"
    "All", // Always put "All" at the end
  ].filter((script) => scripts.includes(script));

  if (loading) {
    return <div>Loading scripts...</div>;
  }

  return (
    <div className="script-selector">
      <h2>Select a Script</h2>
      <div className="script-options">
        <select
          value={selectedScript || ""}
          onChange={(e) => handleScriptSelect(e.target.value)}
          className="script-dropdown"
        >
          <option value="">Choose a script...</option>
          {orderedScripts.map((script) => (
            <option key={script} value={script}>
              {script}
            </option>
          ))}
        </select>

        <div className="traveller-toggle">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={includeTravellers}
              onChange={(e) => onToggleTravellers(e.target.checked)}
              className="traveller-checkbox"
              disabled={selectedScript === "Travellers"}
            />
            Include Travellers
          </label>
        </div>

        {selectedScript && (
          <button className="continue-button" onClick={onContinue}>
            Continue
          </button>
        )}
      </div>
    </div>
  );
};
