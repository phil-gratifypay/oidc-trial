<template>
  <v-img :src="imgSrc" :max-height="height" :max-width="width" contain />
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
      validator: (type) =>
        ['full', 'logotype', 'strapline', 'tag'].includes(type),
    },
    color: {
      type: String,
      required: true,
      validator: (color) =>
        ['blue', 'black-slate', 'white-ice'].includes(color),
    },
    height: {
      type: String,
      default: null,
    },

    width: {
      type: String,
      default: null,
    },
  },
  computed: {
    imgSrc() {
      // return require('@/assets/logo/blue/Gratify_Logo_full.svg');
      return require(`@/assets/logo/${this.color}/Gratify_Logo_${this.type}.svg`);
    },
  },
};
</script>

<style lang="scss" scoped></style>
