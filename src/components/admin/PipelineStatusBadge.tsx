import { Badge, BadgeTone } from '@/components/ui/Badge'
import type { PipelineStage } from '@/lib/constants'

const TONE: Record<PipelineStage, BadgeTone> = {
  NEW: 'yellow',
  CONTACTED: 'sand',
  QUALIFIED: 'olive',
  VIBE_CHECK_SENT: 'sand',
  CONFIRMED: 'olive',
  NOT_A_FIT: 'rust',
}

export function PipelineStatusBadge({ status }: { status: PipelineStage }) {
  return (
    <Badge tone={TONE[status]} className="capitalize">
      {status.toLowerCase().replace(/_/g, ' ')}
    </Badge>
  )
}
