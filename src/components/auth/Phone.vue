<template>
  <div style="display: contents">
    <v-card-title class="justify-center">{{ title }}</v-card-title>
    <v-card-text class="text-center mb-10 min-height-60">
      Please enter your mobile number below and we'll send you a verification
      code.
    </v-card-text>
    <v-card-actions>
      <v-form
        style="width: 100%"
        :readonly="isSubmitting"
        @submit.prevent="handleSubmit"
      >
        <phone-text-field
          v-model="phone"
          :error-messages="emsg"
        ></phone-text-field>

        <v-btn
          type="submit"
          block
          class="ultra-red"
          :loading="isSubmitting"
          :disabled="!isValidPhone"
        >
          Continue
        </v-btn>
      </v-form>
    </v-card-actions>
  </div>
</template>

<script>
import { Auth } from '../../models/Auth';
import { isValidPhoneNumber } from '@/utils/phone';
import PhoneTextField from './PhoneTextField.vue';
// import generateNonce from "@/utils/util";

export default {
  name: 'CreatePhone',
  components: {
    PhoneTextField,
  },

  props: {
    purpose: {
      type: String,
      default: () => 'CREATE_PHONE',
      validator: (purpose) =>
        ['CREATE_PHONE', 'REPLACE_PHONE'].includes(purpose.toUpperCase()),
    },
  },

  data: () => ({
    phone: '',
    emsg: '',
    isSubmitting: false,
  }),

  computed: {
    isValidPhone() {
      return isValidPhoneNumber(this.phone);
    },

    title() {
      switch (this.purpose.toUpperCase()) {
        case 'CREATE_PHONE':
          return 'Create a New Account';
        case 'REPLACE_PHONE':
          return 'Update Your Phone';
        default:
          return '';
      }
    },
  },

  mounted() {},
  created() {},
  methods: {
    displayErrorMessage(code) {
      switch (code) {
        case 'INVALID_DATA':
          this.emsg =
            'There was a problem with that mobile number. Please try a different mobile number in your country.';
          break;
        case 'DUPLICATE_PHONE':
          this.emsg =
            "Whoops! There's already a Gratify Pay account associated with this phone number. Check your inbox! We sent a message to the registered email address. Please use that email address to log in.";
          break;
        default:
          this.emsg = 'Invalid Email and/or Phone';
      }
    },

    handleSubmit() {
      switch (this.purpose.toUpperCase()) {
        case 'CREATE_PHONE':
          this.createPhone();
          break;
        case 'REPLACE_PHONE':
          this.replacePhone();
          break;
        default:
          break;
      }
    },

    async createPhone() {
      this.isSubmitting = true;
      this.emsg = '';
      try {
        const res = await Auth.createPhone({ phone: this.phone });
        this.isSubmitting = false;
        this.$emit('form-change', res.data.status);
      } catch (e) {
        this.isSubmitting = false;
        console.error(e);
        this.displayErrorMessage(e.response?.data?.status);
      }
    },

    async replacePhone() {
      this.isSubmitting = true;
      try {
        const res = await Auth.replacePhone({ newPhone: this.phone });
        this.$emit('form-change', res.data.status);
      } catch (e) {
        this.isSubmitting = false;
        console.error(e);
        console.log(e.response?.data?.status);
        this.displayErrorMessage(e.response?.data?.status);
      }
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
