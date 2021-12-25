<template>
  <gp-text-field
    v-bind="$attrs"
    data-test="email-input"
    placeholder="Enter email"
    inputmode="email"
    label="Email address"
    prepend-inner-icon="uis-mail-line"
    autofocus
    v-on="$listeners"
  >
  </gp-text-field>
</template>

<script>
export default {};
</script>

<style></style>
