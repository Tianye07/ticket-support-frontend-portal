import type { BackendTicketRequest, BackendTicketResponse } from '.';
import { http } from '../../http/http.helper';

const MODULE_PREFIX = 'tickets';

/**
 * @method GET
 * @url /api/app/app/tickets
 */
export async function getTicketListing(params?: BackendTicketRequest.GetTicketListingRequestParams) {
  const response = await http.get<BackendTicketResponse.GetTicketListingResponse>(`/${MODULE_PREFIX}`, { params });
  return response.data;
}

/**
 * @method POST
 * @url /api/app/tickets
 */
export async function postCreateTicket(data: BackendTicketRequest.CreateTicketRequestBody) {
  const response = await http.post<BackendTicketResponse.CreateTicketResponse>(`/${MODULE_PREFIX}`, data);
  return response.data;
}

/**
 * @method GET
 * @url /api/app/tickets/{id}
 */
export async function getTicketDetails(id: string) {
  const response = await http.get<BackendTicketResponse.GetTicketDetailsResponse>(`/${MODULE_PREFIX}/${id}`);
  return response.data;
}

/**
 * @method PUT
 * @url /api/app/tickets/{id}
 */
export async function putUpdateTicket(id: string, data: BackendTicketRequest.UpdateTicketRequestBody) {
  const response = await http.put<BackendTicketResponse.UpdateTicketResponse>(`/${MODULE_PREFIX}/${id}`, data);
  return response.data;
}

/**
 * @method DELETE
 * @url /api/app/tickets/{id}
 */
export async function deleteTicket(id: string) {
  const response = await http.delete<BackendTicketResponse.DeleteTicketResponse>(`/${MODULE_PREFIX}/${id}`);
  return response.data;
}
