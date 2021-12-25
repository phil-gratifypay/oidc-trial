<template>
  <gp-text-field
    v-bind="$attrs"
    :value="phone"
    data-test="phone-input"
    inputmode="tel"
    :maxlength="maxLength"
    :placeholder="placeholder"
    autofocus
    label="Phone Number"
    class="phone"
    @v-on="$listeners"
    @input="onInput"
  >
    <template #prepend-inner>
      <v-select
        :value="areacode"
        :items="areacodes"
        class="areacode"
        required
        dense
        dark
        hide-details
        single-line
        item-value="code"
        :append-icon="null"
        data-test="areacode-input"
        @input="onAreacodeInput"
      >
        <template #item="{ item }">
          <flag :country-code="item.code"></flag>
          <span style="width: 40px">{{ item.text }}</span>
          <span class="ml-2">{{ item.country }}</span>
        </template>
        <template #selection="{ item }">
          <flag :country-code="item.code"></flag>
          <!-- https://github.com/vuetifyjs/vuetify/issues/14391 -->
          <span style="width: 32px" class="nudge-down">{{ item.text }}</span>
        </template>
      </v-select>
    </template>
  </gp-text-field>
</template>

<script>
import Flag from "@/components/common/Flag.vue";

import { areacodes } from "@/utils/phone/";
import { formatToPattern } from "@/utils/mask";

export default {
  components: {
    Flag,
  },

  data: () => ({
    areacode: "ca",
    phone: "",
  }),

  computed: {
    areacodes() {
      return areacodes;
    },

    fullPhone() {
      if (this.currentCountry.removeFirstZero) {
        return `${this.currentCountry.text}${this.phone
          .replace(/\D/g, "")
          .substring(1)}`;
      }

      return this.currentCountry.text + this.phone.replace(/\D/g, "");
    },

    currentCountry() {
      return areacodes.find(({ code }) => code === this.areacode);
    },

    maxLength() {
      return this.currentCountry.mask.length;
    },

    placeholder() {
      return this.currentCountry.placeholder;
    },
  },

  methods: {
    onInput(newPhone) {
      this.phone = formatToPattern(
        newPhone.replace(/\D/, ""),
        this.currentCountry.mask
      );

      this.$emit("input", this.fullPhone);
    },

    onAreacodeInput(areacode) {
      this.areacode = areacode;
      this.phone = "";

      this.$emit("input", this.fullPhone);
    },
  },
};
</script>

<style scoped lang="scss">
.areacode {
  margin-top: 0px !important;
}

::v-deep .v-text-field.v-input--dense:not(.v-text-field--outlined) input {
  display: none;
}

::v-deep .v-text-field > .v-input__control > .v-input__slot:before,
.v-text-field > .v-input__control > .v-input__slot:after {
  display: none;
}
.v-select-list {
  background: var(--v-ice-base);
  box-shadow: 0px 0px 40px rgba(60, 66, 87, 0.05),
    0px 10px 40px rgba(60, 66, 87, 0.05);

  border-radius: 8px;
}
</style>
