<script setup lang="ts">
import { onMounted } from 'vue';
import router from '../router';
import { useDropdownList, useTicketList } from '../composables';
import { formatDateTime, formatEnumLabel } from '../utils';
import AppButton from '../components/buttons/AppButton.vue';
import AppTextField from '../components/input-fields/AppTextField.vue';
import AppSelect from '../components/input-fields/AppSelect.vue';

defineOptions({
  name: 'HomeView',
});

const { list, isLoading, errorMessage, searchCriteria, getListing, resetSearchCriteria } =
  useTicketList();

const { getTicketPriorities, getTicketStatuses } = useDropdownList();

const priorityClasses: Record<string, string> = {
  low: 'tw:bg-slate-100 tw:text-slate-700',
  medium: 'tw:bg-amber-100 tw:text-amber-800',
  high: 'tw:bg-red-100 tw:text-red-700',
};

const statusClasses: Record<string, string> = {
  open: 'tw:bg-blue-100 tw:text-blue-700',
  in_progress: 'tw:bg-amber-100 tw:text-amber-800',
  resolved: 'tw:bg-green-100 tw:text-green-700',
};

const onClickCreate = async () => {
  await router.push({ name: 'TicketCreation' });
};

const onClickTicket = async (id: string) => {
  await router.push({ name: 'TicketDetails', params: { id } });
};

const onClickReset = async () => {
  resetSearchCriteria();
  await getListing();
};

onMounted(async () => {
  await getListing();
});
</script>

<template>
  <div class="tw:mx-auto tw:max-w-5xl tw:px-4 tw:py-8">
    <div class="tw:mb-6 tw:flex tw:flex-wrap tw:items-end tw:justify-between tw:gap-4">
      <div>
        <h1 class="tw:text-2xl tw:font-semibold tw:text-slate-900">Gamuda Ticket Support Portal</h1>
        <p class="tw:mt-1 tw:text-sm tw:text-slate-500">View and manage support tickets.</p>
      </div>
      <AppButton label="Create ticket" @click="onClickCreate" />
    </div>

    <!-- Filters -->
    <form
      class="tw:mb-6 tw:grid tw:gap-3 tw:rounded-xl tw:border tw:border-slate-200 tw:bg-white tw:p-4 tw:md:grid-cols-[1fr_12rem_12rem_auto] tw:md:items-end"
      @submit.prevent="getListing"
    >
      <AppTextField v-model="searchCriteria.title" label="Search" placeholder="Search by title" />
      <AppSelect
        v-model="searchCriteria.priority"
        :items="getTicketPriorities()"
        label="Priority"
        placeholder="All priorities"
        clearable
      />
      <AppSelect
        v-model="searchCriteria.status"
        :items="getTicketStatuses()"
        label="Status"
        placeholder="All statuses"
        clearable
      />
      <div class="tw:flex tw:gap-2">
        <AppButton label="Search" type="submit" :loading="isLoading" />
        <AppButton label="Reset" button-type="outlined" @click="onClickReset" />
      </div>
    </form>

    <!-- Error -->
    <div
      v-if="errorMessage"
      role="alert"
      class="tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-3 tw:rounded-xl tw:border tw:border-red-200 tw:bg-red-50 tw:p-4 tw:text-sm tw:text-red-700"
    >
      {{ errorMessage }}
      <AppButton label="Retry" button-type="outlined" size="sm" @click="getListing" />
    </div>

    <!-- Loading -->
    <div v-else-if="isLoading && !list.length" class="tw:py-12 tw:text-center tw:text-sm tw:text-slate-500">
      Loading tickets…
    </div>

    <!-- Empty -->
    <div
      v-else-if="!list.length"
      class="tw:rounded-xl tw:border tw:border-dashed tw:border-slate-300 tw:bg-white tw:py-12 tw:text-center"
    >
      <p class="tw:font-medium tw:text-slate-900">No tickets found</p>
      <p class="tw:mt-1 tw:text-sm tw:text-slate-500">Try changing the filters, or create a new ticket.</p>
    </div>

    <!-- List -->
    <ul v-else class="tw:flex tw:flex-col tw:gap-3">
      <li v-for="ticket in list" :key="ticket.id">
        <div
          class="tw:cursor-pointer tw:rounded-xl tw:border tw:border-slate-200 tw:bg-white tw:p-4 tw:transition tw:hover:border-primary tw:hover:shadow-sm"
          @click="onClickTicket(ticket.id)"
        >
          <div class="tw:flex tw:flex-wrap tw:items-start tw:justify-between tw:gap-3">
            <div class="tw:min-w-0 tw:flex-1">
              <div class="tw:truncate tw:font-semibold tw:text-slate-900">{{ ticket.title }}</div>
              <div class="tw:mt-1 tw:text-sm tw:text-slate-500">
                #{{ ticket.id }} · {{ ticket.requesterName }} · {{ formatDateTime(ticket.createdAt) }}
              </div>
            </div>
            <div class="tw:flex tw:gap-2">
              <span
                :class="['tw:rounded-full tw:px-2.5 tw:py-0.5 tw:text-xs tw:font-medium', priorityClasses[ticket.priority]]"
              >
                {{ formatEnumLabel(ticket.priority) }}
              </span>
              <span
                :class="['tw:rounded-full tw:px-2.5 tw:py-0.5 tw:text-xs tw:font-medium', statusClasses[ticket.status]]"
              >
                {{ formatEnumLabel(ticket.status) }}
              </span>
            </div>
          </div>
          <p v-if="ticket.description" class="tw:mt-2 tw:line-clamp-2 tw:text-sm tw:text-slate-600">
            {{ ticket.description }}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
