<template>
  <div :class="`fflag ff-sm fflag-${code} mr-2`"></div>
</template>

<script>
import "@/assets/css/flags-sprite.css";

export default {
  props: {
    countryCode: {
      type: String,
      required: true,
      validator: (countryCode) => countryCode.length === 2,
    },
  },

  computed: {
    code() {
      return this.countryCode.toUpperCase();
    },
  },
};
</script>

<style></style>
