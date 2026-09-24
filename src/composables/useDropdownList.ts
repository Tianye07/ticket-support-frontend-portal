import { BackendTicketEnums } from '../services/api/ticket';
import { formatEnumLabel } from '../utils';

export default function useDropdownList() {

  const getTicketPriorities = () =>
    Object.values(BackendTicketEnums.TICKET_PRIORITY).map((value) => ({
      label: formatEnumLabel(value),
      value,
    }));

  const getTicketStatuses = () =>
    Object.values(BackendTicketEnums.TICKET_STATUS).map((value) => ({
      label: formatEnumLabel(value),
      value,
    }));

  return {
    getTicketPriorities,
    getTicketStatuses,
  };
}
