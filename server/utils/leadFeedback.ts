// Logique pure du feedback loop particulier (REQ-06), isolée pour être testable.
// Voir server/api/v1/magic-link/[token]/decision.post.ts pour l'orchestration.

export interface LeadDecisionRow {
  status: string // lead_status métier ('new' | 'claimed' | 'lost' | ...)
  unlocked_at: string | null // horodatage de déblocage (free-grant, 72h ou claim)
  customer_decision: string // 'pending' | 'refused' | 'selected'
}

// Un pro est "engagé" sur le projet dès qu'il a DÉBLOQUÉ le lead — quel que soit le
// canal. Dans tous les cas de déblocage (claim Premium, free-grant, déblocage 72h),
// `unlocked_at` est renseigné (cf. leads/[id].get.ts + claim.patch.ts). On garde
// status='claimed' en filet de sécurité. Un lead passé en 'lost' n'est plus engagé.
export function isEngaged(lead: LeadDecisionRow): boolean {
  if (lead.status === 'lost') return false
  return lead.unlocked_at != null || lead.status === 'claimed'
}

// Le projet doit repartir au marché quand il y a au moins un pro engagé
// et que TOUS les pros engagés ont été refusés par le particulier.
// (Si un pro est 'selected', on ne relance pas : le client a trouvé.)
export function shouldRelaunch(leads: LeadDecisionRow[]): boolean {
  const engaged = leads.filter(isEngaged)
  if (engaged.length === 0) return false
  return engaged.every((l) => l.customer_decision === 'refused')
}

// Garde-fou anti-spam : borne le nombre de remises au marché automatiques.
export const MAX_RELAUNCHES = 3

export function canRelaunch(relaunchCount: number): boolean {
  return relaunchCount < MAX_RELAUNCHES
}
