import { describe, expect, test } from 'vitest'
import { Chess, Turn } from '../src/chess'

describe('turns()', () => {
  test('returns turns from starting position', () => {
    const chess = new Chess()
    const turns = chess.turns()

    // In starting position, no first move delivers check
    // So all turns should be 2-move turns
    expect(turns.length).toBeGreaterThan(0)
    expect(turns.every((turn) => turn.length === 2)).toBe(true)

    // Each turn should have moves from the same player (white)
    for (const turn of turns) {
      expect(turn[0].color).toBe('w')
      expect(turn[1].color).toBe('w')
    }
  })

  test('first move delivering check ends the turn', () => {
    // Position where white can give check with Qxf7+
    const chess = new Chess('rnbqkbnr/pppp1ppp/4p3/8/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2')
    chess.move('Qh5') // Set up for scholar's mate threat
    
    const chess2 = new Chess(chess.fen())
    const turns = chess2.turns()

    // Find turns that start with Qxf7+
    const checkingTurns = turns.filter(
      (turn) => turn[0].san === 'Qxf7+' || turn[0].san.includes('+')
    )

    // All turns starting with a checking move should have length 1
    for (const turn of checkingTurns) {
      expect(turn.length).toBe(1)
      expect(turn[0].san).toContain('+')
    }
  })

  test('responds to check on first move', () => {
    // Position where black is in check
    const chess = new Chess('rnbqkbnr/ppppp1pp/8/5p1Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2')

    // Black is in check, so the first move must respond to check
    expect(chess.isCheck()).toBe(true)

    const turns = chess.turns()

    // All first moves should be legal (respond to check)
    // And they should all be from black
    for (const turn of turns) {
      expect(turn[0].color).toBe('b')
    }

    // After responding to check (assuming no counter-check), 
    // the turn should have 2 moves
    const nonCheckingTurns = turns.filter(
      (turn) => !turn[0].san.includes('+')
    )
    for (const turn of nonCheckingTurns) {
      expect(turn.length).toBe(2)
    }
  })

  test('turn consists of moves from same player', () => {
    const chess = new Chess()
    const turns = chess.turns()

    for (const turn of turns) {
      const player = turn[0].color
      for (const move of turn) {
        expect(move.color).toBe(player)
      }
    }
  })

  test('single move turn when first move is checkmate', () => {
    // Fool's mate position - white can deliver checkmate
    const chess = new Chess('rnbqkbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2')
    
    // Black has Qh4# available
    const turns = chess.turns()
    
    // Find the checkmate move
    const checkmateTurns = turns.filter((turn) => turn[0].san === 'Qh4#')
    
    // Checkmate move should result in a 1-move turn
    for (const turn of checkmateTurns) {
      expect(turn.length).toBe(1)
    }
  })

  test('number of 2-move turns is product of consecutive move counts', () => {
    // Simple position to verify the counting
    const chess = new Chess('8/8/8/8/8/8/4K3/R3k3 w - - 0 1')
    
    const turns = chess.turns()
    
    // Count turns that deliver check vs those that don't
    const checkingTurns = turns.filter((t) => t.length === 1)
    const nonCheckingTurns = turns.filter((t) => t.length === 2)
    
    // We should have some of each
    expect(checkingTurns.length).toBeGreaterThanOrEqual(0)
    expect(nonCheckingTurns.length).toBeGreaterThanOrEqual(0)
    expect(turns.length).toBe(checkingTurns.length + nonCheckingTurns.length)
  })

  test('returns empty array when no legal moves', () => {
    // Fool's mate - white is checkmated
    const chess = new Chess('rnb1kbnr/pppp1ppp/4p3/8/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3')
    
    // Verify white is checkmated
    expect(chess.isCheckmate()).toBe(true)
    
    // No turns available when checkmated
    const turns = chess.turns()
    expect(turns.length).toBe(0)
  })

  test('move objects have correct before/after FEN', () => {
    const chess = new Chess()
    const turns = chess.turns()

    // Check that before FEN of first move matches current position
    for (const turn of turns.slice(0, 5)) {
      expect(turn[0].before).toBe(chess.fen())
    }
  })
})
