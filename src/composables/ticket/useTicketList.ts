import {
  BackendTicket,
  BackendTicketApi,
  BackendTicketEnums,
  BackendTicketRequest,
} from '../../services/api/ticket';
import { getErrorMessage } from '../../utils';
import { reactive, ref, shallowRef } from 'vue';

export default function useTicketList() {

  const list = shallowRef<BackendTicket.Ticket[]>([]);

  const isLoading = ref(false);
  const errorMessage = ref('');

  const searchCriteria = reactive({
    title: '',
    priority: '' as BackendTicketEnums.TICKET_PRIORITY | '',
    status: '' as BackendTicketEnums.TICKET_STATUS | '',
  });

  async function getListing() {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      const requestParams = new BackendTicketRequest.GetTicketListingRequestParams();
      requestParams.title = searchCriteria.title || undefined;
      requestParams.priority = searchCriteria.priority || undefined;
      requestParams.status = searchCriteria.status || undefined;

      const response = await BackendTicketApi.getTicketListing(requestParams);
      list.value = response.data;

      return response;
    } catch (error: any) {
      errorMessage.value = getErrorMessage(error);
    } finally {
      isLoading.value = false;
    }
  }

  function resetSearchCriteria() {
    Object.assign(searchCriteria, { title: '', priority: '', status: '' });
  }

  return {
    list,
    isLoading,
    errorMessage,
    searchCriteria,
    getListing,
    resetSearchCriteria,
  };
}
