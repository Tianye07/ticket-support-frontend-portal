<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useDropdownList, useTicket } from '../../../composables';
import { formatDateTime } from '../../../utils';
import AppButton from '../../../components/buttons/AppButton.vue';
import AppTextField from '../../../components/input-fields/AppTextField.vue';
import AppSelect from '../../../components/input-fields/AppSelect.vue';

const props = defineProps<{
  id?: string;
}>();

const emit = defineEmits(['creation:succeed', 'update:succeed', 'delete:succeed', 'click:back']);

const {
  ticketFormData,
  ticketDetails,
  isLoading,
  isSubmitting,
  errorMessage,
  formErrors,
  getTicketDetails,
  createNewTicket,
  updateTicket,
  deleteTicket,
} = useTicket();

const { getTicketPriorities, getTicketStatuses } = useDropdownList();

const isEditMode = computed(() => !!props.id);

const onSubmit = async () => {
  const { id } = props;

  if (id) {
    const response = await updateTicket(id);
    if (response) emit('update:succeed');
  } else {
    const response = await createNewTicket();
    if (response) emit('creation:succeed');
  }
};

const onClickDelete = async () => {
  const { id } = props;
  if (!id || !window.confirm('Delete this ticket? This cannot be undone.')) return;

  const response = await deleteTicket(id);
  if (response) emit('delete:succeed');
};

onMounted(async () => {
  const { id } = props;
  if (id) await getTicketDetails(id);
});
</script>

<template>
  <div class="tw:mx-auto tw:max-w-3xl tw:px-4 tw:py-8">
    <button
      type="button"
      class="tw:mb-4 tw:text-sm tw:font-medium tw:text-slate-500 tw:hover:text-slate-900"
      @click="emit('click:back')"
    >
      ← Back to tickets
    </button>

    <div class="tw:mb-6">
      <h1 class="tw:text-2xl tw:font-semibold tw:text-slate-900">
        {{ isEditMode ? 'Ticket details' : 'Create ticket' }}
      </h1>
      <p v-if="ticketDetails" class="tw:mt-1 tw:text-sm tw:text-slate-500">
        #{{ ticketDetails.id }} · Created {{ formatDateTime(ticketDetails.createdAt) }} · Last updated
        {{ formatDateTime(ticketDetails.updatedAt) }}
      </p>
    </div>

    <!-- Loading ticket -->
    <div v-if="isLoading" class="tw:py-12 tw:text-center tw:text-sm tw:text-slate-500">
      Loading ticket…
    </div>

    <!-- Ticket failed to load, e.g. not found -->
    <div
      v-else-if="isEditMode && !ticketDetails"
      role="alert"
      class="tw:rounded-xl tw:border tw:border-red-200 tw:bg-red-50 tw:p-4 tw:text-sm tw:text-red-700"
    >
      {{ errorMessage || 'Ticket could not be loaded.' }}
    </div>

    <form
      v-else
      class="tw:flex tw:flex-col tw:gap-5 tw:rounded-xl tw:border tw:border-slate-200 tw:bg-white tw:p-5 tw:md:p-6"
      @submit.prevent="onSubmit"
    >
      <div
        v-if="errorMessage"
        role="alert"
        class="tw:rounded-lg tw:border tw:border-red-200 tw:bg-red-50 tw:px-4 tw:py-3 tw:text-sm tw:text-red-700"
      >
        {{ errorMessage }}
      </div>

      <AppTextField
        v-model="ticketFormData.title"
        label="Title"
        placeholder="Short summary of the issue"
        maxlength="100"
        is-required
        :error-messages="formErrors.title"
      />

      <div class="tw:grid tw:gap-5 tw:md:grid-cols-3">
        <AppTextField
          v-model="ticketFormData.requesterName"
          label="Requester name"
          placeholder="Who reported this?"
          maxlength="100"
          is-required
          :error-messages="formErrors.requesterName"
        />
        <AppSelect
          v-model="ticketFormData.priority"
          :items="getTicketPriorities()"
          label="Priority"
          is-required
          :error-messages="formErrors.priority"
        />
        <AppSelect
          v-model="ticketFormData.status"
          :items="getTicketStatuses()"
          label="Status"
          is-required
          :error-messages="formErrors.status"
        />
      </div>

      <AppTextField
        v-model="ticketFormData.description"
        label="Description"
        placeholder="Describe the issue in more detail"
        :rows="5"
        maxlength="350"
        counter
        :error-messages="formErrors.description"
      />

      <div class="tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-3 tw:border-t tw:border-slate-200 tw:pt-5">
        <AppButton
          v-if="isEditMode"
          label="Delete"
          button-type="danger"
          :disabled="isSubmitting"
          @click="onClickDelete"
        />
        <div class="tw:ml-auto tw:flex tw:gap-2">
          <AppButton label="Cancel" button-type="outlined" :disabled="isSubmitting" @click="emit('click:back')" />
          <AppButton
            :label="isEditMode ? 'Save changes' : 'Create ticket'"
            type="submit"
            :loading="isSubmitting"
          />
        </div>
      </div>
    </form>
  </div>
</template>
