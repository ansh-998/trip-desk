// Single source of truth for the lead pipeline and group types.
// The PIPELINE_STAGES array must stay in sync with the `status` check
// constraint on the `leads` table (see 0001_schema.sql).
export const PIPELINE_STAGES = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'VIBE_CHECK_SENT',
  'CONFIRMED',
  'NOT_A_FIT',
] as const

export type PipelineStage = (typeof PIPELINE_STAGES)[number]

export const GROUP_TYPES = ['solo', 'friends', 'couple', 'family'] as const
export type GroupType = (typeof GROUP_TYPES)[number]

export const BRAND_COLORS = {
  rust: '#D55D27',
  yellow: '#FFFE00',
  ink: '#1C1B1A',
  olive: '#45471D',
  sand: '#D1B788',
  cream: '#FFFBF5',
} as const
