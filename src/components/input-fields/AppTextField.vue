<script setup lang="ts">
import { computed, useId } from 'vue';

const props = withDefaults(
  defineProps<{
    label?: string;
    placeholder?: string;
    type?: string;
    isRequired?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    maxlength?: number | string;
    counter?: boolean;
    // Renders a <textarea> with this many rows instead of an <input>
    rows?: number;
    errorMessages?: string | readonly string[] | null;
  }>(),
  {
    type: 'text',
    isRequired: false,
    disabled: false,
    readonly: false,
    counter: false,
  }
);

const model = defineModel<string | null>();

const id = useId();

const errorMessage = computed(() => {
  const { errorMessages } = props;
  return typeof errorMessages === 'string' ? errorMessages : errorMessages?.[0];
});

const inputClasses = computed(() => [
  'tw:w-full tw:rounded-lg tw:border tw:bg-white tw:px-3 tw:py-2 tw:text-sm tw:outline-none tw:transition',
  'tw:placeholder:text-slate-400 tw:focus:border-primary tw:focus:ring-2 tw:focus:ring-primary/20',
  'tw:disabled:cursor-not-allowed tw:disabled:bg-slate-100 tw:read-only:bg-slate-50',
  errorMessage.value ? 'tw:border-red-500' : 'tw:border-slate-300',
]);
</script>

<template>
  <div class="tw:flex tw:flex-col tw:gap-1.5">
    <label v-if="label" :for="id" class="tw:text-sm tw:font-medium tw:text-slate-700">
      {{ label }}<span v-if="isRequired" class="tw:ml-0.5 tw:text-red-600">*</span>
    </label>

    <textarea
      v-if="rows"
      :id="id"
      v-model="model"
      :rows="rows"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :aria-invalid="!!errorMessage"
      :class="[inputClasses, 'tw:resize-y']"
    />
    <input
      v-else
      :id="id"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :aria-invalid="!!errorMessage"
      :class="inputClasses"
    />

    <div
      v-if="errorMessage || (counter && maxlength)"
      class="tw:flex tw:justify-between tw:gap-2 tw:text-xs"
    >
      <span class="tw:text-red-600">{{ errorMessage }}</span>
      <span v-if="counter && maxlength" class="tw:text-slate-500">
        {{ model?.length ?? 0 }}/{{ maxlength }}
      </span>
    </div>
  </div>
</template>
