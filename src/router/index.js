/**
 * Vue Router
 *
 * @library
 *
 * https://router.vuejs.org/en/
 */

// Lib imports
import Vue from "vue";
import Router from "vue-router";
import { Auth } from "../models/Auth";

// Routes
import paths from "@/router/paths";

function route({
  path,
  view,
  name,
  meta,
  props,
  alias,
  beforeEnter,
  redirect,
  children = [],
}) {
  return {
    name,
    path,
    component: (resovle) => {
      // log('trying', `@/views/${view}.vue`)
      import(`@/views/${view}.vue`)
        .then(resovle)
        .catch((e) => {
          console.error(e);
          // log('err, trying', `@/views/${view}/${view}.vue`)
          return import(`@/views/${view}/${view}.vue`).then(resovle);
        });
    },
    meta,
    props,
    alias,
    redirect,
    beforeEnter,
    children: children.map(route),
  };
}

Vue.use(Router);
// Vue.use(Meta);

// Create a new router
const router = new Router({
  mode: "history",
  routes: [...paths.map(route), { path: "*", redirect: "/" }],

  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    if (to.hash) {
      return { selector: to.hash };
    }
    return { x: 0, y: 0 };
  },
});

router.beforeResolve(async (to, _from, next) => {
  const appName = getAppNameFromRoute(to);

  console.log({ appName });

  Auth.setAppName(appName);

  // Set invite token on invite route
  if (to.name === "merchant-invite" || to.query.authReturnUrl === "/invite") {
    // If there's no invite token
    // Just redirect to merchant portal
    if (!to.query.inviteToken) {
      return next({ path: "/merchant" });
    }

    Auth.setInviteToken(to.query.inviteToken);
  }

  if (!to.meta.requiresAuth) {
    console.log("Does't require authentication");
    return next();
  }

  const data = await Auth.getCurrentAuthenticatedUser();

  if (data && data.active) {
    console.log("There is an access token", Auth.accessToken);
    return next();
  }

  console.log("Going to auth");
  // Clears any remaining tokens in the localStorage after accessToken expired
  localStorage.clear();
  return next({
    path: "/auth",
    query: { ...to.query, authReturnUrl: to.path },
  });
});

/**
 * Returns the type of route for `route`.
 * @param {import('vue-router').Route} route
 * @returns {'consumer' | 'merchant'} `'merchant'` if route starts with
 * `'/merchant'` or `'/invite'`. Otherwise `'consumer'`
 */
function getAppNameFromRoute(route) {
  const startWithMerchantOrInvite = /^\/((merchant)|(invite))/;

  const pathname = route.path;

  const { authReturnUrl } = route.query;

  return startWithMerchantOrInvite.test(pathname) ||
    startWithMerchantOrInvite.test(authReturnUrl)
    ? "merchant"
    : "consumer";
}

export default router;
