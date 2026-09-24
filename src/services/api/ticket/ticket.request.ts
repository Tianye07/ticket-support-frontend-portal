import type { BackendTicketEnums } from '.';

export class GetTicketListingRequestParams {
  title?: string;
  priority?: BackendTicketEnums.TICKET_PRIORITY;
  status?: BackendTicketEnums.TICKET_STATUS;
}

export class CreateTicketRequestBody {
  title: string = '';
  description?: string;
  priority: BackendTicketEnums.TICKET_PRIORITY = 'low';
  status: BackendTicketEnums.TICKET_STATUS = 'open';
  requesterName: string = '';
}

export class UpdateTicketRequestBody extends CreateTicketRequestBody {}
