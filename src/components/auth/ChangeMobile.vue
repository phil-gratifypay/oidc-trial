<template>
  <div style="display: contents">
    <v-card-title class="justify-center"> Change Mobile Number </v-card-title>
    <v-card-text class="text-center mb-10">
      Enter your email address and a new mobile number
    </v-card-text>

    <v-card-actions class="d-block">
      <v-form style="width: 100%" :readonly="isChanging">
        <email-text-field v-model="email"></email-text-field>

        <phone-text-field
          v-model="phone"
          :error-messages="emsg"
        ></phone-text-field>

        <v-btn
          block
          class="ultra-red"
          :loading="isChanging"
          :disabled="!isValidPhone || !isValidEmail"
          @click="changePhone"
        >
          Continue
        </v-btn>
      </v-form>

      <v-card-text class="text-center opacity-50">
        Something went wrong?
        <br />

        <span
          class="text-decoration-underline actions"
          @click="contactCustomerService"
          >Contact Customer Service</span
        >
        or
        <span class="text-decoration-underline actions" @click="goToEmailScreen"
          >Login</span
        >
      </v-card-text>
    </v-card-actions>
  </div>
</template>

<script>
import { Auth } from '../../models/Auth';
import { isValidPhoneNumber, areacodes } from '@/utils/phone';
import { isValidEmail } from '@/utils/isValidEmail';
import EmailTextField from '@/components/auth/EmailTextField.vue';
import PhoneTextField from '@/components/auth/PhoneTextField.vue';

export default {
  name: 'ChangeMobile',
  components: {
    EmailTextField,
    PhoneTextField,
  },
  data() {
    return {
      email: '',
      phone: '',
      emsg: '',
      areacode: 'ca',
      isChanging: false,
    };
  },
  computed: {
    isValidEmail() {
      return isValidEmail(this.email);
    },

    isValidPhone() {
      return isValidPhoneNumber(this.phone);
    },

    areacodes() {
      return areacodes;
    },
  },
  created() {},
  methods: {
    displayErrorMessage(code) {
      switch (code) {
        case 'FORBIDDEN':
          this.emsg =
            'You are not allowed to change the mobile number at the moment. Contact customer servece or login';
          break;
        case 'DUPLICATE_PHONE':
          this.emsg = 'The mobile number has been used by someone else.';
          break;
        default:
          this.emsg = 'The email and/or the mobile number is invalid.';
      }
    },
    async changePhone() {
      console.log('call Auth.changePhone', this.email, this.phone);
      this.isChanging = true;
      try {
        const res = await Auth.changePhone({
          email: this.email,
          phone: this.phone,
        });
        this.$emit('form-change', res.data.status);
        this.isChanging = false;
      } catch (e) {
        this.isChanging = false;
        console.error(e);
        console.log(e.response?.data?.status);
        this.displayErrorMessage(e.response?.data?.status);
      } finally {
        this.isChanging = false;
      }
    },
    async contactCustomerService() {
      console.log('customer service');
    },

    goToEmailScreen() {
      this.$emit('form-change', { status: 'default' });
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
