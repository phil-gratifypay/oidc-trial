<template>
  <div style="display: contents">
    <v-card-title class="justify-center">{{
      appName == "merchant" ? "Merchant Portal" : "Welcome to Gratify Pay"
    }}</v-card-title>
    <v-card-text class="text-center mb-10 min-height-60">
      {{
        appName == "merchant"
          ? "Enter your email to log in"
          : "Log in or sign up"
      }}
    </v-card-text>

    <v-card-actions>
      <v-form
        autocomplete="off"
        style="width: 100%"
        :readonly="isCheckingEmail"
        @submit.prevent="sendEmail"
      >
        <email-text-field
          v-model="email"
          :error-messages="emsg"
          :disabled="hasMerchantEmail"
        ></email-text-field>

        <v-btn
          type="submit"
          block
          class="ultra-red"
          :loading="isCheckingEmail"
          :disabled="!isValidEmail"
        >
          Continue
        </v-btn>
      </v-form>
    </v-card-actions>
  </div>
</template>

<script>
import { Auth } from "../../models/Auth";
import decodeJWT from "@/utils/decodeJWT.js";
import { isValidEmail } from "@/utils/isValidEmail";

import EmailTextField from "@/components/auth/EmailTextField.vue";

export default {
  name: "Email",

  components: {
    EmailTextField,
  },

  data: () => ({
    email: "",
    emsg: "",
    isCheckingEmail: false,
  }),
  computed: {
    isValidEmail() {
      return isValidEmail(this.email);
    },
    xsOnly() {
      return this.$vuetify.breakpoint.xsOnly;
    },

    appName() {
      return Auth.appName;
    },

    inviteToken() {
      return this.$route.query.inviteToken;
    },

    merchantEmail() {
      const payload = decodeJWT(this.inviteToken);

      return payload.email || null;
    },

    hasMerchantEmail() {
      return this.merchantEmail !== null;
    },
  },

  mounted() {
    if (this.hasMerchantEmail) {
      this.email = this.merchantEmail;
    }
  },

  methods: {
    // invoke model method to send user email to the api and switch to the
    // next screen according to the response status
    async sendEmail() {
      this.isCheckingEmail = true;
      this.emsg = "";

      try {
        const res = await Auth.sendEmail({ email: this.email });

        this.isCheckingEmail = false;
        if (res.data?.status === "INVALID_EMAIL") {
          this.emsg = "Whoops! There's something wrong with your email.";
        } else {
          this.$emit("form-change", res.data.status);
        }
      } catch (e) {
        this.isCheckingEmail = false;
        console.error(e);
        this.emsg =
          e?.response?.data?.code ||
          "Looks like something's wrong with the server";
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
