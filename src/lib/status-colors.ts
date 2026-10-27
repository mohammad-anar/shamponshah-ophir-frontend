/**
 * Centralized Status Color System
 * Maps domain statuses (Orders, Payments, Disputes, Milestones, Levels)
 * strictly to semantic tokens.
 */

export interface StatusBadgeStyle {
  bg: string;
  text: string;
  border: string;
  dot: string;
}

export const STATUS_STYLES: Record<string, StatusBadgeStyle> = {
  // Active / Confirmed / Success
  ACTIVE: {
    bg: "bg-success-soft",
    text: "text-success",
    border: "border-success/30",
    dot: "bg-success-solid",
  },
  COMPLETED: {
    bg: "bg-success-soft",
    text: "text-success",
    border: "border-success/30",
    dot: "bg-success-solid",
  },
  DELIVERED: {
    bg: "bg-info-soft",
    text: "text-info",
    border: "border-info/30",
    dot: "bg-info-solid",
  },
  RELEASED: {
    bg: "bg-success-soft",
    text: "text-success",
    border: "border-success/30",
    dot: "bg-success-solid",
  },
  PAID: {
    bg: "bg-success-soft",
    text: "text-success",
    border: "border-success/30",
    dot: "bg-success-solid",
  },
  APPROVED: {
    bg: "bg-success-soft",
    text: "text-success",
    border: "border-success/30",
    dot: "bg-success-solid",
  },
  VERIFIED: {
    bg: "bg-success-soft",
    text: "text-success",
    border: "border-success/30",
    dot: "bg-success-solid",
  },

  // Vault / Escrow / In Progress / Brand Notice
  VAULT_HELD: {
    bg: "bg-brand-soft",
    text: "text-brand",
    border: "border-border-brand/40",
    dot: "bg-brand",
  },
  IN_PROGRESS: {
    bg: "bg-brand-soft",
    text: "text-brand",
    border: "border-border-brand/40",
    dot: "bg-brand",
  },
  OPEN: {
    bg: "bg-brand-soft",
    text: "text-brand",
    border: "border-border-brand/40",
    dot: "bg-brand",
  },
  LEVEL_TOP_RATED: {
    bg: "bg-brand-soft",
    text: "text-brand",
    border: "border-border-brand/50",
    dot: "bg-brand",
  },
  LEVEL_TWO: {
    bg: "bg-info-soft",
    text: "text-info",
    border: "border-info/40",
    dot: "bg-info",
  },
  LEVEL_ONE: {
    bg: "bg-surface-sunken",
    text: "text-foreground-secondary",
    border: "border-border-strong",
    dot: "bg-foreground-muted",
  },

  // Pending / Warning
  PENDING: {
    bg: "bg-warning-soft",
    text: "text-warning",
    border: "border-warning/30",
    dot: "bg-warning-solid",
  },
  PENDING_PAYMENT: {
    bg: "bg-warning-soft",
    text: "text-warning",
    border: "border-warning/30",
    dot: "bg-warning-solid",
  },
  UNDER_REVIEW: {
    bg: "bg-warning-soft",
    text: "text-warning",
    border: "border-warning/30",
    dot: "bg-warning-solid",
  },
  IN_REVISION: {
    bg: "bg-warning-soft",
    text: "text-warning",
    border: "border-warning/30",
    dot: "bg-warning-solid",
  },
  LOCKED: {
    bg: "bg-surface-sunken",
    text: "text-foreground-muted",
    border: "border-border",
    dot: "bg-foreground-disabled",
  },

  // Danger / Dispute / Cancelled
  CANCELLED: {
    bg: "bg-danger-soft",
    text: "text-danger",
    border: "border-danger/30",
    dot: "bg-danger-solid",
  },
  REFUNDED: {
    bg: "bg-danger-soft",
    text: "text-danger",
    border: "border-danger/30",
    dot: "bg-danger-solid",
  },
  DISPUTED: {
    bg: "bg-danger-soft",
    text: "text-danger",
    border: "border-danger/30",
    dot: "bg-danger-solid",
  },
  SUSPENDED: {
    bg: "bg-danger-soft",
    text: "text-danger",
    border: "border-danger/30",
    dot: "bg-danger-solid",
  },
  REJECTED: {
    bg: "bg-danger-soft",
    text: "text-danger",
    border: "border-danger/30",
    dot: "bg-danger-solid",
  },
};

/**
 * Helper to get status badge classes safely
 */
export function getStatusStyle(status: string | undefined): StatusBadgeStyle {
  if (!status) {
    return {
      bg: "bg-surface-sunken",
      text: "text-foreground-muted",
      border: "border-border",
      dot: "bg-foreground-disabled",
    };
  }
  const key = status.toUpperCase().replace(/\s+/g, "_");
  return (
    STATUS_STYLES[key] || {
      bg: "bg-surface-sunken",
      text: "text-foreground-secondary",
      border: "border-border",
      dot: "bg-foreground-muted",
    }
  );
}
