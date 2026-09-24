<script setup lang="ts">
import router from '../../router';

// Components
import TicketForm from './components/TicketForm.vue';

const onClickBack = async () => {
  await router.push({ name: 'Home' });
};

const onSuccessCreate = async () => {
  await router.push({ name: 'Home' });
};
</script>

<template>
  <TicketForm @creation:succeed="onSuccessCreate" @click:back="onClickBack" />
</template>
