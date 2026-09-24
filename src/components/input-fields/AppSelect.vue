<script setup lang="ts" generic="T extends string">
import { computed, useId } from 'vue';

const props = withDefaults(
  defineProps<{
    items: { label: string; value: T }[];
    label?: string;
    placeholder?: string;
    isRequired?: boolean;
    disabled?: boolean;
    // Lets the placeholder option be selected, e.g. "All" in a filter
    clearable?: boolean;
    errorMessages?: string | readonly string[] | null;
  }>(),
  {
    isRequired: false,
    disabled: false,
    clearable: false,
  }
);

const model = defineModel<T | ''>();

const id = useId();

const errorMessage = computed(() => {
  const { errorMessages } = props;
  return typeof errorMessages === 'string' ? errorMessages : errorMessages?.[0];
});
</script>

<template>
  <div class="tw:flex tw:flex-col tw:gap-1.5">
    <label v-if="label" :for="id" class="tw:text-sm tw:font-medium tw:text-slate-700">
      {{ label }}<span v-if="isRequired" class="tw:ml-0.5 tw:text-red-600">*</span>
    </label>

    <select
      :id="id"
      v-model="model"
      :disabled="disabled"
      :aria-invalid="!!errorMessage"
      :class="[
        'tw:h-10 tw:w-full tw:rounded-lg tw:border tw:bg-white tw:px-3 tw:text-sm tw:outline-none tw:transition',
        'tw:focus:border-primary tw:focus:ring-2 tw:focus:ring-primary/20',
        'tw:disabled:cursor-not-allowed tw:disabled:bg-slate-100',
        errorMessage ? 'tw:border-red-500' : 'tw:border-slate-300',
      ]"
    >
      <option v-if="placeholder" value="" :disabled="!clearable">{{ placeholder }}</option>
      <option v-for="item in items" :key="item.value" :value="item.value">
        {{ item.label }}
      </option>
    </select>

    <span v-if="errorMessage" class="tw:text-xs tw:text-red-600">{{ errorMessage }}</span>
  </div>
</template>
