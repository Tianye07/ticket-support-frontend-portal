import {
  BackendTicket,
  BackendTicketApi,
  BackendTicketEnums,
  BackendTicketRequest,
} from '../../services/api/ticket';
import { getErrorMessage } from '../../utils';
import { reactive, ref, shallowRef } from 'vue';

export default function useTicket() {

  const loadDefaultFormData = () => ({
    id: '',
    title: '',
    description: '',
    priority: BackendTicketEnums.TICKET_PRIORITY.LOW as BackendTicketEnums.TICKET_PRIORITY,
    status: BackendTicketEnums.TICKET_STATUS.OPEN as BackendTicketEnums.TICKET_STATUS,
    requesterName: '',
  });

  const ticketFormData = reactive(loadDefaultFormData());

  const ticketDetails = shallowRef<BackendTicket.Ticket | null>(null);

  const isLoading = ref(false);
  const isSubmitting = ref(false);
  const errorMessage = ref('');
  // Laravel validation errors, keyed by field name, e.g. { requesterName: ['...'] }
  const formErrors = ref<Record<string, string[]>>({});

  function handleError(error: any) {
    formErrors.value = error?.response?.data?.errors ?? {};
    // Field errors are shown under each field, so only show the banner for other errors
    errorMessage.value = Object.keys(formErrors.value).length ? '' : getErrorMessage(error);
  }

  function clearErrors() {
    formErrors.value = {};
    errorMessage.value = '';
  }

  const createNewTicket = async () => {
    try {
      isSubmitting.value = true;
      clearErrors();

      const requestBody = new BackendTicketRequest.CreateTicketRequestBody();
      requestBody.title = ticketFormData.title;
      requestBody.description = ticketFormData.description;
      requestBody.priority = ticketFormData.priority;
      requestBody.status = ticketFormData.status;
      requestBody.requesterName = ticketFormData.requesterName;

      const response = await BackendTicketApi.postCreateTicket(requestBody);

      return response;
    } catch (error: any) {
      handleError(error);
    } finally {
      isSubmitting.value = false;
    }
  };

  const getTicketDetails = async (
    id: string,
  ) => {
    try {
      isLoading.value = true;
      clearErrors();

      const response = await BackendTicketApi.getTicketDetails(id);
      ticketDetails.value = response.data;
      setFormData(response.data);

      return response;
    } catch (error: any) {
      handleError(error);
    } finally {
      isLoading.value = false;
    }
  };

  const updateTicket = async (
    id: string,
  ) => {
    try {
      isSubmitting.value = true;
      clearErrors();

      const requestBody = new BackendTicketRequest.UpdateTicketRequestBody();
      requestBody.title = ticketFormData.title;
      requestBody.description = ticketFormData.description;
      requestBody.priority = ticketFormData.priority;
      requestBody.status = ticketFormData.status;
      requestBody.requesterName = ticketFormData.requesterName;

      const response = await BackendTicketApi.putUpdateTicket(id, requestBody);
      ticketDetails.value = response.data;

      return response;
    } catch (error: any) {
      handleError(error);
    } finally {
      isSubmitting.value = false;
    }
  };

  const deleteTicket = async (
    id: string,
  ) => {
    try {
      isSubmitting.value = true;
      clearErrors();

      const response = await BackendTicketApi.deleteTicket(id);

      return response;
    } catch (error: any) {
      handleError(error);
    } finally {
      isSubmitting.value = false;
    }
  };

  function setFormData(data: BackendTicket.Ticket) {
    Object.assign(ticketFormData, {
      id: data.id,
      title: data.title,
      description: data.description ?? '',
      priority: data.priority,
      status: data.status,
      requesterName: data.requesterName,
    });
  }

  function resetForm() {
    Object.assign(ticketFormData, loadDefaultFormData());
  }

  function reset() {
    resetForm();
    clearErrors();
  }

  return {
    ticketFormData,
    ticketDetails,
    isLoading,
    isSubmitting,
    errorMessage,
    formErrors,
    getTicketDetails,
    updateTicket,
    createNewTicket,
    deleteTicket,
    reset,
  };
}
