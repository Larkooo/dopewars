import React from "react";

export function PaperFlywheel() {
  return (
    <div className="docs-flywheel">
      <svg
        viewBox="0 0 500 320"
        xmlns="http://www.w3.org/2000/svg"
        className="docs-flywheel__svg"
      >
        {/* Central PAPER node */}
        <circle cx="250" cy="160" r="40" fill="rgba(234, 179, 8, 0.2)" stroke="rgb(234, 179, 8)" strokeWidth="2" />
        <text x="250" y="155" textAnchor="middle" fill="rgb(234, 179, 8)" fontSize="14" fontWeight="600">$PAPER</text>
        <text x="250" y="172" textAnchor="middle" fill="rgba(156, 163, 175, 1)" fontSize="10">Token</text>

        {/* Players node (left) */}
        <rect x="20" y="130" width="110" height="60" rx="8" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
        <text x="75" y="155" textAnchor="middle" fill="rgba(255, 255, 255, 0.9)" fontSize="12" fontWeight="600">Players</text>
        <text x="75" y="172" textAnchor="middle" fill="rgba(156, 163, 175, 1)" fontSize="10">USD entry fee</text>

        {/* Burn node (top) */}
        <rect x="195" y="20" width="110" height="60" rx="8" fill="rgba(239, 68, 68, 0.1)" stroke="rgba(239, 68, 68, 0.5)" strokeWidth="1" />
        <text x="250" y="45" textAnchor="middle" fill="rgba(239, 68, 68, 0.9)" fontSize="12" fontWeight="600">Burn (70%)</text>
        <text x="250" y="62" textAnchor="middle" fill="rgba(156, 163, 175, 1)" fontSize="10">Buy + burn PAPER</text>

        {/* VRGDA node (right) */}
        <rect x="370" y="80" width="110" height="60" rx="8" fill="rgba(239, 68, 68, 0.1)" stroke="rgba(239, 68, 68, 0.5)" strokeWidth="1" />
        <text x="425" y="105" textAnchor="middle" fill="rgba(239, 68, 68, 0.9)" fontSize="12" fontWeight="600">VRGDA Burn</text>
        <text x="425" y="122" textAnchor="middle" fill="rgba(156, 163, 175, 1)" fontSize="10">Buy items</text>

        {/* Rewards node (bottom right) */}
        <rect x="370" y="190" width="110" height="60" rx="8" fill="rgba(34, 197, 94, 0.1)" stroke="rgba(34, 197, 94, 0.5)" strokeWidth="1" />
        <text x="425" y="215" textAnchor="middle" fill="rgba(34, 197, 94, 0.9)" fontSize="12" fontWeight="600">Rewards</text>
        <text x="425" y="232" textAnchor="middle" fill="rgba(156, 163, 175, 1)" fontSize="10">Earn PAPER</text>

        {/* Dev node (bottom left) */}
        <rect x="20" y="240" width="110" height="60" rx="8" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1" />
        <text x="75" y="265" textAnchor="middle" fill="rgba(156, 163, 175, 1)" fontSize="12" fontWeight="600">Developer (30%)</text>
        <text x="75" y="282" textAnchor="middle" fill="rgba(156, 163, 175, 1)" fontSize="10">Revenue</text>

        {/* Arrows */}
        {/* Players → Burn (70%) */}
        <path d="M 130 140 Q 160 80 195 50" fill="none" stroke="rgba(239, 68, 68, 0.6)" strokeWidth="1.5" markerEnd="url(#arrowRed)" />

        {/* Players → Dev (30%) */}
        <path d="M 75 190 L 75 240" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" markerEnd="url(#arrowGray)" />

        {/* Burn → PAPER (supply shrinks) */}
        <path d="M 250 80 L 250 120" fill="none" stroke="rgba(239, 68, 68, 0.6)" strokeWidth="1.5" markerEnd="url(#arrowRed)" />

        {/* PAPER → Rewards (earn) */}
        <path d="M 290 165 Q 340 180 370 210" fill="none" stroke="rgba(34, 197, 94, 0.6)" strokeWidth="1.5" markerEnd="url(#arrowGreen)" />

        {/* Rewards → PAPER (via VRGDA) */}
        <path d="M 425 190 L 425 140" fill="none" stroke="rgba(239, 68, 68, 0.6)" strokeWidth="1.5" markerEnd="url(#arrowRed)" />

        {/* VRGDA → items (builds) */}
        <path d="M 370 110 L 290 140" fill="none" stroke="rgba(234, 179, 8, 0.6)" strokeWidth="1.5" markerEnd="url(#arrowYellow)" />

        {/* Arrow markers */}
        <defs>
          <marker id="arrowRed" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M 0 0 L 8 3 L 0 6 Z" fill="rgba(239, 68, 68, 0.6)" />
          </marker>
          <marker id="arrowGreen" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M 0 0 L 8 3 L 0 6 Z" fill="rgba(34, 197, 94, 0.6)" />
          </marker>
          <marker id="arrowYellow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M 0 0 L 8 3 L 0 6 Z" fill="rgba(234, 179, 8, 0.6)" />
          </marker>
          <marker id="arrowGray" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <path d="M 0 0 L 8 3 L 0 6 Z" fill="rgba(255, 255, 255, 0.3)" />
          </marker>
        </defs>
      </svg>

      <div className="docs-flywheel__legend">
        <div className="docs-flywheel__legend-item">
          <span style={{ color: "rgba(239, 68, 68, 0.9)" }}>Red arrows</span> = PAPER burned (removed from circulation)
        </div>
        <div className="docs-flywheel__legend-item">
          <span style={{ color: "rgba(34, 197, 94, 0.9)" }}>Green arrow</span> = PAPER earned (issued to players)
        </div>
        <div className="docs-flywheel__legend-item">
          <span style={{ color: "rgba(234, 179, 8, 0.9)" }}>Yellow arrow</span> = Permanent items acquired
        </div>
      </div>
    </div>
  );
}
