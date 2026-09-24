<script setup lang="ts">
import router from '../../router';
import { useRoute } from 'vue-router';

// Components
import TicketForm from './components/TicketForm.vue';

const route = useRoute();
const ticketId = route.params?.id as string;

const onClickBack = async () => {
  await router.push({ name: 'Home' });
};

const onSuccessUpdate = async () => {
  await router.push({ name: 'Home' });
};

const onSuccessDelete = async () => {
  await router.push({ name: 'Home' });
};
</script>

<template>
  <TicketForm
    :id="ticketId"
    @update:succeed="onSuccessUpdate"
    @delete:succeed="onSuccessDelete"
    @click:back="onClickBack"
  />
</template>
