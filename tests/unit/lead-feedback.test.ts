import { describe, it, expect } from 'vitest'
import { shouldRelaunch, canRelaunch, isEngaged, MAX_RELAUNCHES } from '../../server/utils/leadFeedback'

const TS = '2026-06-15T20:00:00Z'

describe('leadFeedback — feedback loop particulier (REQ-06)', () => {
  it('isEngaged : un lead débloqué (unlocked_at) est engagé, claim OU free-grant', () => {
    // claim Premium
    expect(isEngaged({ status: 'claimed', unlocked_at: TS, customer_decision: 'pending' })).toBe(true)
    // free-grant : status 'new' mais unlocked_at posé
    expect(isEngaged({ status: 'new', unlocked_at: TS, customer_decision: 'pending' })).toBe(true)
    // pas débloqué
    expect(isEngaged({ status: 'new', unlocked_at: null, customer_decision: 'pending' })).toBe(false)
    // remis au marché → plus engagé
    expect(isEngaged({ status: 'lost', unlocked_at: TS, customer_decision: 'refused' })).toBe(false)
  })

  it('aucun pro engagé → pas de remise au marché', () => {
    expect(shouldRelaunch([])).toBe(false)
    expect(shouldRelaunch([{ status: 'new', unlocked_at: null, customer_decision: 'pending' }])).toBe(false)
  })

  it('tous les pros engagés refusés → remise au marché (free-grant inclus)', () => {
    expect(shouldRelaunch([
      { status: 'claimed', unlocked_at: TS, customer_decision: 'refused' },
      { status: 'new', unlocked_at: TS, customer_decision: 'refused' },
    ])).toBe(true)
  })

  it('un seul pro engagé encore en attente → pas de remise', () => {
    expect(shouldRelaunch([
      { status: 'claimed', unlocked_at: TS, customer_decision: 'refused' },
      { status: 'claimed', unlocked_at: TS, customer_decision: 'pending' },
    ])).toBe(false)
  })

  it('un pro retenu (selected) → jamais de remise même si les autres sont refusés', () => {
    expect(shouldRelaunch([
      { status: 'claimed', unlocked_at: TS, customer_decision: 'refused' },
      { status: 'claimed', unlocked_at: TS, customer_decision: 'selected' },
    ])).toBe(false)
  })

  it('les leads remis au marché (lost) ne comptent pas dans la décision', () => {
    expect(shouldRelaunch([
      { status: 'lost', unlocked_at: TS, customer_decision: 'refused' },
      { status: 'lost', unlocked_at: TS, customer_decision: 'refused' },
      { status: 'new', unlocked_at: TS, customer_decision: 'pending' },
    ])).toBe(false)
  })

  it('canRelaunch : borne anti-spam à MAX_RELAUNCHES', () => {
    expect(canRelaunch(0)).toBe(true)
    expect(canRelaunch(MAX_RELAUNCHES - 1)).toBe(true)
    expect(canRelaunch(MAX_RELAUNCHES)).toBe(false)
  })
})
