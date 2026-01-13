/**
 * Modern game info panel with visual design
 */
export default function GameInfo({ 
  mode, 
  gameStatus, 
  isMyTurn, 
  turn, 
  movesInTurn, 
  isUnbalanced, 
  playerColor, 
  onResign, 
  waiting, 
  isSpectator, 
  onCopyLink, 
  winnerInfo, 
  moveHistory, 
  opponentNames,
  // Draw offer props
  drawOffer,
  drawOfferSent,
  onOfferDraw,
  onAcceptDraw,
  onDeclineDraw
}) {
  const turnColor = turn === "w" ? (opponentNames?.white || "White") : (opponentNames?.black || "Black");
  const playerColorName = playerColor === "w" ? (opponentNames?.white || "White") : (opponentNames?.black || "Black");
  const hasMovesPlayed = moveHistory && moveHistory.length > 0;
  
  return (
    <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl shadow-xl p-3 md:p-4 space-y-3 border border-slate-700/50 overflow-hidden">
      {/* Spectator Badge */}
      {isSpectator && (
        <div className="bg-indigo-500/20 border border-indigo-500/40 rounded-xl p-3 backdrop-blur-sm space-y-2">
          <div className="text-indigo-300 font-semibold text-center flex items-center justify-center gap-2 text-sm">
            👁️ Spectating
          </div>
          <div className="flex justify-between items-center text-xs text-indigo-200">
            <span className="flex items-center gap-1">⚪ {opponentNames?.white || 'White'}</span>
            <span className="text-indigo-500 font-bold">VS</span>
            <span className="flex items-center gap-1">⚫ {opponentNames?.black || 'Black'}</span>
          </div>
        </div>
      )}
      
      {/* Waiting for Opponent Indicator */}
      {waiting && !isSpectator && (
        <div className="bg-amber-500/20 border border-amber-500/40 rounded-xl p-3 backdrop-blur-sm">
          <div className="text-amber-300 font-semibold mb-2 text-center text-sm">⏳ Waiting for opponent...</div>
          <div className="text-xs text-amber-200 mb-3 text-center">Share the game link with your friend</div>
          <button
            onClick={() => {
              if (onCopyLink) onCopyLink();
            }}
            className="w-full py-2 px-4 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold text-sm rounded-lg transition-all shadow-lg border border-amber-500/30"
          >
            📋 Copy Game Link
          </button>
        </div>
      )}

      {/* Incoming Draw Offer */}
      {drawOffer && !isSpectator && (
        <div className="bg-blue-500/20 border border-blue-500/40 rounded-xl p-3 backdrop-blur-sm">
          <div className="text-blue-300 font-semibold mb-2 text-center text-sm">🤝 Draw Offered</div>
          <div className="text-xs text-blue-200 mb-3 text-center">Your opponent offers a draw</div>
          <div className="flex gap-2">
            <button
              onClick={onAcceptDraw}
              className="flex-1 py-2 px-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold text-sm rounded-lg transition-all shadow-lg border border-green-500/30"
            >
              ✓ Accept
            </button>
            <button
              onClick={onDeclineDraw}
              className="flex-1 py-2 px-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold text-sm rounded-lg transition-all shadow-lg border border-red-500/30"
            >
              ✗ Decline
            </button>
          </div>
        </div>
      )}
      
      {/* Game Mode Badge */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">Game Mode</span>
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-500/50">
          {mode === "friend" ? "Playing Friend" : mode === "online" ? "Online" : "VS Bot"}
        </span>
      </div>

      {/* Variant Badge */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-300">Variant</span>
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${isUnbalanced ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50' : 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/50'}`}>
          {isUnbalanced ? "Unbalanced" : "Balanced"}
        </span>
      </div>

      {/* Your Color */}
      {(mode === "friend" || mode === "online") && !isSpectator && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">You are</span>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${playerColor === "w" ? 'bg-slate-200 text-slate-900 border border-slate-300' : 'bg-slate-900 text-white border border-slate-600'}`}>
            {playerColor === "w" ? "⚪" : "⚫"} {playerColorName}
          </span>
        </div>
      )}

      {/* Turn Indicator */}
      <div className="pt-3 border-t border-slate-700/50">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-300">Current Turn</span>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${turn === "w" ? 'bg-slate-100 border-2 border-slate-400 shadow-lg' : 'bg-slate-900 border-2 border-slate-400 shadow-lg'}`}></div>
            <span className="text-sm font-semibold text-slate-100">{turnColor}</span>
          </div>
        </div>
        
        {isUnbalanced && (
          <div className="mt-2 text-center">
            <span className="text-xs font-medium text-indigo-400">
              Move {movesInTurn !== undefined ? `${movesInTurn}/2` : "1/1"}
            </span>
          </div>
        )}
      </div>

      {/* Status */}
      <div className="pt-3 border-t border-slate-700/50">
        <div className={`text-center py-2 px-3 rounded-lg font-semibold text-sm ${
          (winnerInfo && winnerInfo.winner) ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50" :
          gameStatus?.includes("Checkmate") ? "bg-red-500/20 text-red-300 border border-red-500/50" :
          gameStatus?.includes("Check") ? "bg-amber-500/20 text-amber-300 border border-amber-500/50" :
          gameStatus?.includes("Draw") ? "bg-slate-700/50 text-slate-300 border border-slate-600/50" :
          winnerInfo ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/50" :
          "bg-slate-700/50 text-slate-300 border border-slate-600/50"
        }`}>
          {winnerInfo
            ? (winnerInfo.winner 
                ? `🏆 ${winnerInfo.winner.charAt(0).toUpperCase() + winnerInfo.winner.slice(1)} won by ${winnerInfo.reason}` 
                : (winnerInfo.reason === 'draw' ? '🤝 Draw' : `🤝 Draw by ${winnerInfo.reason}`))
            : gameStatus || '♟️ Game in progress'}
        </div>
      </div>

      {/* Turn Status */}
      {!gameStatus && !winnerInfo && !isSpectator && (
        <div className="pt-3 border-t border-slate-700/50">
          <div className={`text-center py-2 px-3 rounded-lg font-semibold text-sm ${
            isMyTurn ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50" : "bg-slate-700/50 text-slate-300 border border-slate-600/50"
          }`}>
            {isMyTurn ? "✨ Your Turn" : "⏳ Opponent's Turn"}
          </div>
        </div>
      )}

      {/* Action Buttons - desktop only */}
      {mode && !gameStatus && !isSpectator && (
        <div className="hidden lg:flex gap-2 mt-2">
          {/* Draw Button - only for online mode */}
          {mode === 'friend' && (
            <button
              onClick={onOfferDraw}
              disabled={winnerInfo || waiting || !hasMovesPlayed || drawOfferSent || drawOffer}
              className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-all shadow-lg border border-blue-500/30 disabled:border-slate-600"
            >
              {drawOfferSent ? '⏳ Sent' : '🤝 Draw'}
            </button>
          )}
          {/* Resign Button */}
          <button
            onClick={onResign}
            disabled={winnerInfo || (mode === 'friend' && waiting) || !hasMovesPlayed}
            className={`${mode === 'friend' ? 'flex-1' : 'w-full'} py-2 px-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-all shadow-lg border border-red-500/30 disabled:border-slate-600`}
          >
            🏳️ Resign
          </button>
        </div>
      )}
    </div>
  );
}
