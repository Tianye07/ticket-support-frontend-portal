const TICKET_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in_progress',
  RESOLVED: 'resolved',
} as const;

type TICKET_STATUS = typeof TICKET_STATUS[keyof typeof TICKET_STATUS];

const TICKET_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

type TICKET_PRIORITY = typeof TICKET_PRIORITY[keyof typeof TICKET_PRIORITY];

export { TICKET_STATUS, TICKET_PRIORITY };
