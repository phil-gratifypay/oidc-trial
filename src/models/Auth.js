import { VuexModule, Module, Mutation, Action } from "vuex-class-modules";
import axios from "axios";
import store from "@/store";

axios.defaults.withCredentials = true;
axios.defaults.credentials = "include";

delete axios.defaults.headers.common["origin"];
delete axios.defaults.headers.get["origin"];

// TODO: get the actual path
const API_PATH = "sth";

@Module
class AuthClass extends VuexModule {
  phone = null;
  email = null;
  flowId = null;
  _accessToken = null;
  _gpToken = null;
  _idToken = null;
  userId = null;
  _shieldToken = null;
  _appName = "consumer";
  _inviteToken = null;

  @Mutation
  setLocalVars(...[vars]) {
    for (const [k, v] of Object.entries(vars)) {
      this[k] = v;
    }
  }

  @Mutation
  setAccessToken(accessToken) {
    this._accessToken = accessToken;

    if (accessToken === null) {
      localStorage.removeItem("accessToken");
    } else {
      localStorage.setItem("accessToken", this._accessToken);
    }
  }

  @Mutation
  setShieldToken(token) {
    this._shieldToken = token;
  }

  get shieldToken() {
    return this._shieldToken;
  }

  get accessToken() {
    if (this._accessToken) return this._accessToken;

    const at = localStorage.getItem("accessToken");
    if (at) return at;

    return null;
  }

  @Mutation
  setAppName(appName) {
    this._appName = appName;
  }

  get appName() {
    return this._appName;
  }

  @Mutation
  setGPToken(gpToken) {
    this._gpToken = gpToken;

    if (gpToken === null) {
      localStorage.removeItem("gpToken");
    } else {
      localStorage.setItem("gpToken", this._gpToken);
    }
  }

  get gpToken() {
    if (this._gpToken) return this._gpToken;

    const at = localStorage.getItem("gpToken");
    if (at) return at;

    return null;
  }

  get idToken() {
    if (this._idToken) {
      return this._idToken;
    }

    return localStorage.getItem("idToken") || null;
  }

  @Mutation
  setIdToken(idToken) {
    this._idToken = idToken;

    if (idToken == null) {
      localStorage.removeItem("idToken");
    } else {
      localStorage.setItem("idToken", idToken);
    }
  }

  get inviteToken() {
    return this._inviteToken;
  }

  @Mutation
  setInviteToken(inviteToken) {
    this._inviteToken = inviteToken || null;
  }

  @Action
  async sendEmail({ email }) {
    const data = JSON.stringify(
      this.appName === "consumer"
        ? {
            email,
          }
        : { email, inviteToken: this.inviteToken }
    );

    const config = {
      method: "POST",
      url: `${API_PATH}/auth/email`,
      headers: { "Content-Type": "application/json" },
      data: data,
      params: {
        appName: this.appName,
      },
    };
    const res = await axios(config);
    const phone = res.data.phone === undefined ? null : res.data.phone;
    // log('sendEmail res.data: ', res.data);
    this.setLocalVars({
      email: email,
      flowId: res.data.flowId,
      phone,
    });

    console.log(this.email);
    return res;
  }

  @Action
  async createPhone({ phone }) {
    const data = JSON.stringify(
      this.appName === "consumer"
        ? {
            email: this.email,
            phone,
          }
        : {
            email: this.email,
            phone,
            inviteToken: this.inviteToken,
          }
    );

    const config = {
      method: "POST",
      url: `${API_PATH}/auth/create-phone`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
      params: {
        appName: this.appName,
      },
    };

    const res = await axios(config);
    this.setLocalVars({
      phone,
      flowId: res.data.flowId,
    });
    return res;
  }

  @Action
  async verifyPhone({ otp }) {
    const data = JSON.stringify({
      otp,
      flowId: this.flowId,
      email: this.email,
    });

    const config = {
      method: "POST",
      url: `${API_PATH}/auth/verify-phone`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
      params: {
        appName: this.appName,
      },
    };

    const res = await axios(config);

    if (res.data.status === "OTP_EMAIL_REQUIRED") {
      this.setLocalVars({
        flowId: res.data.flowId,
      });
      return res;
    } else {
      this.setLocalVars({
        userId: res.data.userId,
      });

      if (res?.data?.authorizeResponse?.access_token) {
        if (res?.data?.gpToken) {
          this.setGPToken(res.data.gpToken);
        }
        this.setAccessToken(res.data.authorizeResponse.access_token);
      }

      if (res.data?.authorizeResponse?.id_token) {
        this.setIdToken(res.data?.authorizeResponse?.id_token);
      }

      return res;
    }
  }

  @Action
  async changePhone({ email, phone }) {
    const config = {
      method: "patch",
      url: `${API_PATH}/auth/change-phone`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ phone, email }),
      params: {
        appName: this.appName,
      },
    };

    const res = await axios(config);

    if (res.data?.flowId) {
      this.setLocalVars({ flowId: res.data.flowId });
    }

    return res;
  }

  @Action
  async lostPhone() {
    const config = {
      method: "POST",
      url: `${API_PATH}/auth/lost-phone`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ email: this.email }),
      params: {
        appName: this.appName,
      },
    };

    const res = await axios(config);

    this.setLocalVars({ flowId: res.data.flowId });

    return res;
  }

  @Action
  async verifyEmail({ otp }) {
    const data = JSON.stringify({
      otp: otp,
      flowId: this.flowId,
    });

    const config = {
      method: "POST",
      url: `${API_PATH}/auth/verify-email`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
      params: {
        appName: this.appName,
      },
    };

    const res = await axios(config);
    this.setShieldToken(res.data?.shieldToken);
    return res;
  }

  @Action
  async replacePhone({ newPhone }) {
    const config = {
      method: "PATCH",
      url: `${API_PATH}/auth/replace-phone`,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        email: this.email,
        oldPhone: this.phone,
        newPhone,
        shieldToken: this.shieldToken,
      }),
      params: {
        appName: this.appName,
      },
    };

    console.log("old phone: ", this.phone);

    const res = await axios(config);

    this.setLocalVars({
      phone: res.data.phone,
      flowId: res.data.flowId,
    });

    return res;
  }

  @Action
  async createPassword({ pwd, confirm }) {
    // TODO: hashing password
    const data = JSON.stringify({
      password: pwd,
      confirm: confirm,
      userId: this.userId,
    });

    const config = {
      method: "POST",
      url: `${API_PATH}/auth/create-password`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    console.log(config);

    const res = await axios(config);
    return res;
  }

  @Action
  async pwdLogin({ password }) {
    const data = JSON.stringify({
      email: this.email,
      password: password,
      flowId: this.flowId,
    });

    const config = {
      method: "POST",
      url: `${API_PATH}/auth/verify-username`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    const res = await axios(config);
    console.log("pwdLogin", res);

    if (res?.data?.authorizeResponse?.access_token) {
      if (res?.data?.gpToken) {
        this.setGPToken(res.data.gpToken);
      }
      this.setAccessToken(res.data.authorizeResponse.access_token);
    }
    if (res.data?.authorizeResponse?.id_token) {
      this.setIdToken(res.data?.authorizeResponse?.id_token);
    }
    return res;
  }

  @Action
  async logout() {
    const idToken = this.idToken;

    this.setAccessToken(null);
    this.setGPToken(null);
    this.setIdToken(null);
    // Just to be sure
    localStorage.clear();

    await axios({
      method: "POST",
      url: `${API_PATH}/auth/logout`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        idToken,
      },
      params: {
        appName: this.appName,
      },
    });

    axios.interceptors.request.use((config) => {
      config.headers.Authorization = "";
      return config;
    });
  }

  @Action
  async getCurrentAuthenticatedUser() {
    const accessToken = this.accessToken;

    if (!accessToken) return null;

    const config = {
      method: "POST",
      url: `${API_PATH}/auth/introspect`,
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        appName: this.appName,
      },
    };

    try {
      const res = await axios(config);
      console.log("getCurrentAuthenticatedUser res", res);
      return res.data;
    } catch (error) {
      console.error("getCurrentAuthenticatedUser error", error);
      this.setAccessToken(null);
      return null;
    }
  }
}

// register module (could be in any file)
export const Auth = new AuthClass({ store, name: "Auth" });
