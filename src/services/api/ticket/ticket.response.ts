import type { BackendTicket } from '.';
import type { ApiBackend } from '..';

type BaseResponse = ApiBackend.SuccessResponse<BackendTicket.Ticket>;

export type GetTicketListingResponse = ApiBackend.SuccessResponse<BackendTicket.Ticket[]>;

export type CreateTicketResponse = BaseResponse;

export type GetTicketDetailsResponse = BaseResponse;

export type UpdateTicketResponse = BaseResponse;

export type DeleteTicketResponse = ApiBackend.SuccessResponse<null>;
