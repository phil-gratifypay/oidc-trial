<template>
  <gp-text-field
    v-bind="$attrs"
    data-test="otp-input"
    placeholder="Enter code"
    label="Verification code"
    pattern="[0-9]*"
    :maxlength="lengthNum"
    prepend-inner-icon="uis-lock-open-line"
    autofocus
    v-on="$listeners"
  >
  </gp-text-field>
</template>

<script>
export default {
  props: {
    length: {
      type: [String, Number],
      required: false,
      default: () => 6,
      validator: (length) => Number(length) > 0,
    },
  },

  computed: {
    lengthNum() {
      return Number(this.length);
    },
  },
};
</script>

<style></style>
