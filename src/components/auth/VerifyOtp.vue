<template>
  <div style="display: contents">
    <v-card-title class="justify-center">
      {{ isForPhone ? 'Verify Your Account' : 'Verify Your Email' }}
    </v-card-title>

    <v-card-text class="text-center mb-10 min-height-60">
      <template v-if="isForPhone">
        Enter the 6-digit verification code sent to your mobile number
        {{ phone | phone }}
      </template>
      <template v-else>
        Please enter the 6-digit email code sent to your email address
      </template>
    </v-card-text>

    <v-card-actions>
      <v-form
        autocomplete="off"
        style="width: 100%"
        :readonly="isCheckingOTP"
        @submit.prevent="onSubmit"
      >
        <otp-text-field v-model="otp"></otp-text-field>

        <v-btn
          type="submit"
          block
          class="ultra-red"
          :loading="isCheckingOTP"
          :disabled="!isValidOTP"
        >
          Continue
        </v-btn>
      </v-form>
    </v-card-actions>

    <v-card-text class="text-center opacity-50 px-0">
      Didn't receive the code?
      <span class="text-decoration-underline actions" @click="resend"
        >Resend code</span
      >
      <template v-if="isForPhone">
        <span v-if="isNewAccount">
          or
          <span
            id="ch-phone"
            class="text-decoration-underline actions"
            @click="changePhone"
            >change mobile phone number</span
          ></span
        >
        <span v-else>
          <br />
          <span
            id="no-longer-have-phone"
            class="text-decoration-underline actions"
            @click="noLongerHavePhone"
          >
            I no longer have this device
          </span>
        </span>
      </template>
    </v-card-text>
  </div>
</template>

<script>
import { Auth } from '../../models/Auth';
import OtpTextField from './OtpTextField.vue';

export default {
  name: 'VerifyPhone',

  components: {
    OtpTextField,
  },

  props: {
    isNewAccount: {
      type: Boolean,
      required: false,
      default: () => true,
    },

    purpose: {
      type: String,
      required: true,
      validator: (purpose) =>
        ['EMAIL', 'PHONE'].includes(purpose.toUpperCase()),
    },
  },

  data: () => ({
    otp: '',
    emsg: '',
    isCheckingOTP: false,
  }),

  computed: {
    phone() {
      return Auth.phone;
    },

    isValidOTP() {
      return /^\d{6}$/.test(String(this.otp));
    },

    xsOnly() {
      return this.$vuetify.breakpoint.xsOnly;
    },

    isForPhone() {
      return this.purpose.toUpperCase() === 'PHONE';
    },
  },

  mounted() {
    this.otp = '';
  },

  methods: {
    onSubmit() {
      if (this.isForPhone) {
        return this.verifyPhone();
      } else {
        return this.verifyEmail();
      }
    },

    displayErrorMessage(code) {
      switch (code) {
        case 'QUOTA_EXCEEDED':
          this.emsg = 'Too many unsuccessful attempts';
          break;
        case 'INVALID_OTP':
          this.emsg = 'Sorry! The code is incorrect. Please try again.';
          break;
        default:
          this.emsg = "Something's wrong with the server";
      }
    },

    async verifyPhone() {
      try {
        this.emsg = '';
        this.isCheckingOTP = true;
        const res = await Auth.verifyPhone({
          otp: this.otp,
        });
        this.$emit('form-change', res.data.status);
      } catch (e) {
        this.isCheckingOTP = false;
        console.error(e);
        this.displayErrorMessage(e.response?.data?.status);
      }
    },

    async verifyEmail() {
      this.isCheckingOTP = true;
      try {
        const res = await Auth.verifyEmail({
          otp: this.otp,
        });
        this.$emit('form-change', res.data.status);
        this.isCheckingOTP = false;
      } catch (e) {
        this.isCheckingOTP = false;
        console.error(e);
        this.displayErrorMessage(
          e.response?.data?.status ?? e.response?.data?.details[0]?.code
        );
      }
    },

    async resend() {
      if (this.isForPhone) {
        return this.resendPhoneOTP();
      } else {
        return this.resendEmailOTP();
      }
    },

    async resendPhoneOTP() {
      if (this.isCheckingOTP) {
        return;
      }

      try {
        const email = Auth.email;
        const res = await Auth.sendEmail({ email });
        this.emsg = res.code;
        console.log('sendEmail res:', res);
      } catch (e) {
        console.error(e);
        this.displayErrorMessage(e.response?.data?.details[0]?.code);
      }
    },

    async resendEmailOTP() {
      if (this.isCheckingOTP) {
        return;
      }

      try {
        await Auth.lostPhone();
      } catch (e) {
        this.emsg = 'Sorry! There was a problem sending the code to your email';
        console.error(e);
      }
    },

    changePhone() {
      if (this.isCheckingOTP) {
        return;
      }

      console.log('Change mobile number');
      this.$emit('form-change', 'CHANGE_PHONE');
    },

    async noLongerHavePhone() {
      if (this.isCheckingOTP) {
        return;
      }

      try {
        const res = await Auth.lostPhone();
        this.$emit('form-change', res.data.status);
      } catch (e) {
        console.error(e);
        this.displayErrorMessage(e.response.data?.details[0]?.code);
      }
    },
  },
};
</script>

<style scoped lang="scss"></style>
