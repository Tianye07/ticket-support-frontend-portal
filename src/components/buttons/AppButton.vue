<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    label?: string;
    buttonType?: 'primary' | 'outlined' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    type?: 'button' | 'submit' | 'reset';
    block?: boolean;
    disabled?: boolean;
    loading?: boolean;
  }>(),
  {
    buttonType: 'primary',
    size: 'md',
    type: 'button',
    block: false,
    disabled: false,
    loading: false,
  }
);

const emit = defineEmits<{ click: [event: MouseEvent] }>();

const colorClasses = computed(() => {
  const classes = {
    primary: 'tw:bg-primary tw:text-white tw:hover:bg-primary-hover',
    outlined: 'tw:border tw:border-slate-300 tw:bg-white tw:text-slate-700 tw:hover:bg-slate-50',
    danger: 'tw:bg-red-600 tw:text-white tw:hover:bg-red-700',
  };

  return classes[props.buttonType];
});

const sizeClasses = computed(() => {
  const classes = {
    sm: 'tw:h-8 tw:px-3 tw:text-xs',
    md: 'tw:h-10 tw:px-4 tw:text-sm',
    lg: 'tw:h-12 tw:px-5 tw:text-base',
  };

  return classes[props.size];
});
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'tw:inline-flex tw:items-center tw:justify-center tw:gap-2 tw:rounded-lg tw:font-semibold tw:transition-colors',
      'tw:focus-visible:outline-2 tw:focus-visible:outline-offset-2 tw:focus-visible:outline-primary',
      'tw:disabled:cursor-not-allowed tw:disabled:opacity-60',
      colorClasses,
      sizeClasses,
      { 'tw:w-full': block },
    ]"
    @click="emit('click', $event)"
  >
    <span
      v-if="loading"
      class="tw:size-4 tw:animate-spin tw:rounded-full tw:border-2 tw:border-current tw:border-t-transparent"
      aria-hidden="true"
    />
    <slot name="prepend" />
    <slot>{{ label }}</slot>
    <slot name="append" />
  </button>
</template>
