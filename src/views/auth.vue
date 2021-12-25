<template>
  <div style="display: contents">
    <bubble></bubble>
    <v-row
      class="ma-0"
      :class="appName == 'merchant' ? 'slate' : 'primary'"
      justify="center"
      align="center"
    >
      <v-col
        cols="12"
        sm="10"
        class="d-flex align-center justify-center flex-column px-md-0 py-md-16"
        :class="{ 'glass card': !xsOnly }"
      >
        <logo
          color="white-ice"
          type="tag"
          width="200px"
          class="mx-auto mt-10"
        />

        <v-row justify="center" align="center" no-gutters>
          <v-col>
            <v-card
              flat
              dark
              class="pa-md-2 mx-auto transparent"
              :width="cardWidth"
              :height="380"
            >
              <v-window v-model="form" class="min-width-50vw">
                <v-window-item
                  value="Email"
                  transition="fade-transition"
                  reverse-transition="fade-transition"
                >
                  <email @form-change="onFormChange"></email>
                </v-window-item>

                <v-window-item
                  value="VerifyPhone"
                  transition="fade-transition"
                  reverse-transition="fade-transition"
                >
                  <verify-otp
                    purpose="PHONE"
                    :is-new-account="isNewAccount"
                    @form-change="onFormChange"
                  ></verify-otp>
                </v-window-item>

                <v-window-item
                  value="CreatePhone"
                  transition="fade-transition"
                  reverse-transition="fade-transition"
                >
                  <phone
                    purpose="CREATE_PHONE"
                    @form-change="onFormChange"
                  ></phone>
                </v-window-item>

                <v-window-item
                  value="ChangeMobile"
                  transition="fade-transition"
                  reverse-transition="fade-transition"
                >
                  <change-mobile @form-change="onFormChange"></change-mobile>
                </v-window-item>

                <v-window-item
                  value="ReplacePhone"
                  transition="fade-transition"
                  reverse-transition="fade-transition"
                >
                  <phone
                    purpose="REPLACE_PHONE"
                    @form-change="onFormChange"
                  ></phone>
                </v-window-item>

                <v-window-item
                  value="VerifyEmail"
                  transition="fade-transition"
                  reverse-transition="fade-transition"
                >
                  <verify-otp
                    purpose="EMAIL"
                    @form-change="onFormChange"
                  ></verify-otp>
                </v-window-item>

                <v-window-item value="QrCode">
                  <qr-code></qr-code>
                </v-window-item>
              </v-window>
            </v-card>
          </v-col>
        </v-row>

        <logo
          color="white-ice"
          type="strapline"
          width="227px"
          class="mx-auto px-0"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Bubble from "../components/common/Bubble.vue";
import Email from "@/components/auth/Email.vue";
import Phone from "@/components/auth/Phone.vue";
import VerifyOtp from "@/components/auth/VerifyOtp.vue";
import ChangeMobile from "@/components/auth/ChangeMobile.vue";
// import QrCode from "@/components/auth/QrCode.vue";

import { Auth } from "../models/Auth";

export default {
  name: "Auth",

  components: {
    Bubble,
    Email,
    Phone,
    VerifyOtp,
    ChangeMobile,
  },

  props: {
    isQrCheckoutFlow: {
      type: Boolean,
      required: false,
      default: () => false,
    },
  },

  data: () => ({
    form: "Email",
    isNewAccount: false,
  }),

  computed: {
    appName() {
      return Auth.appName;
    },
    xsOnly() {
      return this.$vuetify.breakpoint.xsOnly;
    },
    cardWidth() {
      if (this.xsOnly) {
        return "100%";
      }
      return "360px";
    },

    authReturnUrl() {
      const { authReturnUrl } = this.$route.query;

      if (!authReturnUrl || authReturnUrl === "/auth") {
        return "/";
      }

      return authReturnUrl;
    },
  },

  mounted() {
    this.form = this.isQrCheckoutFlow ? "QrCode" : "Email";
  },

  methods: {
    onFormChange(status) {
      console.log({ status });
      switch (status) {
        // case 'DUPLICATE_PHONE':
        case "PHONE_REQUIRED":
          this.form = "CreatePhone";
          this.isNewAccount = true;
          break;
        case "OTP_REQUIRED":
        case "OTP_PHONE_REQUIRED":
          this.form = "VerifyPhone";
          break;
        case "CHANGE_PHONE": // deprecated?
          this.form = "ChangeMobile";
          break;
        case "OTP_EMAIL_REQUIRED":
          this.form = "VerifyEmail";
          break;
        case "NEW_PHONE_REQUIRED": // deprecated?
          this.form = "ReplacePhone";
          break;
        case "OK":
        case "COMPLETED": {
          console.log("authReturnUrl", this.authReturnUrl);

          // eslint-disable-next-line no-unused-vars
          const { authReturnUrl, ...query } = this.$route.query;

          this.$router.push({ path: this.authReturnUrl, query: query });
          break;
        }
        default:
          this.form = "Email";
      }
    },
  },
};
</script>

<style scoped lang="scss">
.card {
  height: 80%;
  max-width: 1170px;
}

.fade-transition {
  &-leave-active {
    position: absolute;
    width: 100%;
  }
  &-enter-active,
  &-leave,
  &-leave-to {
    transition: 0.3s ease;
  }

  &-enter,
  &-leave-to {
    opacity: 0;
  }
}
</style>
