export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'ACTIVE'
  | 'DELIVERED'
  | 'REVISION_REQUESTED'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'DISPUTED'
  | 'COMPLETED_WITH_PARTIAL_REFUND'
  | 'REFUNDED';

export type ActorRole = 'CLIENT' | 'VENDOR' | 'ADMIN' | 'SYSTEM';

export interface StateTransitionRule {
  from: OrderStatus;
  to: OrderStatus;
  allowedRoles: ActorRole[];
  description: string;
}

export const ORDER_STATE_MACHINE_TABLE: StateTransitionRule[] = [
  {
    from: 'PENDING_PAYMENT',
    to: 'ACTIVE',
    allowedRoles: ['CLIENT', 'SYSTEM', 'ADMIN'],
    description: 'Order payment funded in escrow vault',
  },
  {
    from: 'PENDING_PAYMENT',
    to: 'CANCELLED',
    allowedRoles: ['CLIENT', 'ADMIN', 'SYSTEM'],
    description: 'Order cancelled before payment was deposited',
  },
  {
    from: 'ACTIVE',
    to: 'DELIVERED',
    allowedRoles: ['VENDOR', 'ADMIN'],
    description: 'Vendor marked order as delivered with proof/deliverables',
  },
  {
    from: 'ACTIVE',
    to: 'CANCELLED',
    allowedRoles: ['ADMIN', 'CLIENT'],
    description: 'Active order cancelled and refunded to client',
  },
  {
    from: 'ACTIVE',
    to: 'DISPUTED',
    allowedRoles: ['CLIENT', 'VENDOR', 'ADMIN'],
    description: 'Dispute opened during active order progress',
  },
  {
    from: 'DELIVERED',
    to: 'COMPLETED',
    allowedRoles: ['CLIENT', 'SYSTEM', 'ADMIN'],
    description: 'Client approved deliverables, order completed and sent to clearing',
  },
  {
    from: 'DELIVERED',
    to: 'REVISION_REQUESTED',
    allowedRoles: ['CLIENT', 'ADMIN'],
    description: 'Client requested revisions on delivered work',
  },
  {
    from: 'DELIVERED',
    to: 'DISPUTED',
    allowedRoles: ['CLIENT', 'ADMIN'],
    description: 'Dispute opened over delivery',
  },
  {
    from: 'REVISION_REQUESTED',
    to: 'DELIVERED',
    allowedRoles: ['VENDOR', 'ADMIN'],
    description: 'Vendor re-delivered work after completing requested revisions',
  },
  {
    from: 'REVISION_REQUESTED',
    to: 'DISPUTED',
    allowedRoles: ['CLIENT', 'VENDOR', 'ADMIN'],
    description: 'Dispute opened over unresolved revision requests',
  },
  {
    from: 'DISPUTED',
    to: 'COMPLETED',
    allowedRoles: ['ADMIN'],
    description: 'Admin resolved dispute in vendor favor (funds released to vendor)',
  },
  {
    from: 'DISPUTED',
    to: 'REFUNDED',
    allowedRoles: ['ADMIN', 'VENDOR'],
    description: 'Admin or Vendor resolved dispute in client favor (funds refunded to client)',
  },
  {
    from: 'DISPUTED',
    to: 'COMPLETED_WITH_PARTIAL_REFUND',
    allowedRoles: ['ADMIN', 'VENDOR'],
    description: 'Admin or Vendor resolved dispute with partial payout and partial refund',
  },
  {
    from: 'DISPUTED',
    to: 'CANCELLED',
    allowedRoles: ['ADMIN', 'VENDOR'],
    description: 'Admin or Vendor cancelled order during dispute review',
  },
  {
    from: 'ACTIVE',
    to: 'COMPLETED_WITH_PARTIAL_REFUND',
    allowedRoles: ['VENDOR', 'ADMIN'],
    description: 'Vendor or Admin accepted partial refund agreement on active order',
  },
  {
    from: 'DELIVERED',
    to: 'COMPLETED_WITH_PARTIAL_REFUND',
    allowedRoles: ['VENDOR', 'ADMIN'],
    description: 'Vendor or Admin accepted partial refund settlement on delivered order',
  },
  {
    from: 'REVISION_REQUESTED',
    to: 'COMPLETED_WITH_PARTIAL_REFUND',
    allowedRoles: ['VENDOR', 'ADMIN'],
    description: 'Vendor or Admin accepted partial refund during revisions',
  },
  {
    from: 'DELIVERED',
    to: 'CANCELLED',
    allowedRoles: ['VENDOR', 'ADMIN'],
    description: 'Vendor accepted cancellation or Admin cancelled delivered order',
  },
  {
    from: 'REVISION_REQUESTED',
    to: 'CANCELLED',
    allowedRoles: ['VENDOR', 'ADMIN'],
    description: 'Vendor accepted cancellation or Admin cancelled during revisions',
  },
];

export function canTransitionOrder(
  currentStatus: OrderStatus,
  targetStatus: OrderStatus,
  role: ActorRole,
): boolean {
  if (currentStatus === targetStatus) return true;
  const rule = ORDER_STATE_MACHINE_TABLE.find(
    (r) => r.from === currentStatus && r.to === targetStatus,
  );
  return !!rule && rule.allowedRoles.includes(role);
}

export function getAvailableTransitions(
  currentStatus: OrderStatus,
  role: ActorRole,
): StateTransitionRule[] {
  return ORDER_STATE_MACHINE_TABLE.filter(
    (rule) => rule.from === currentStatus && rule.allowedRoles.includes(role),
  );
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, { label: string; color: string; bg: string; border: string }> = {
  PENDING_PAYMENT: { label: 'Pending Payment', color: 'text-warning', bg: 'bg-warning-solid text-on-brand/10', border: 'border-warning/30' },
  ACTIVE: { label: 'Active (Escrow Locked)', color: 'text-info', bg: 'bg-info-solid text-foreground/10', border: 'border-info/30' },
  DELIVERED: { label: 'Delivered', color: 'text-info', bg: 'bg-brand text-on-brand/10', border: 'border-border-brand/30' },
  REVISION_REQUESTED: { label: 'Revision Requested', color: 'text-warning', bg: 'bg-warning-soft', border: 'border-warning/30' },
  COMPLETED: { label: 'Completed (Clearing)', color: 'text-success', bg: 'bg-success-solid text-foreground/10', border: 'border-success/30/30' },
  CANCELLED: { label: 'Cancelled', color: 'text-foreground-muted', bg: 'bg-surface-sunken/10', border: 'border-border-strong/30' },
  DISPUTED: { label: 'Disputed', color: 'text-danger', bg: 'bg-danger-solid text-foreground/10', border: 'border-danger/30' },
  COMPLETED_WITH_PARTIAL_REFUND: { label: 'Partial Refund Settlement', color: 'text-warning', bg: 'bg-warning-soft', border: 'border-warning/30' },
  REFUNDED: { label: 'Refunded', color: 'text-danger', bg: 'bg-danger-solid text-foreground/10', border: 'border-danger/30' },
};
