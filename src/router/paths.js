/**
 * Define all of your application routes here
 * for more information on routes, see the
 * official documentation https://router.vuejs.org/en/
 */
export default [
  {
    path: "/info",
    // Relative to /src/views
    name: "info",
    view: "info",

    meta: { requiresAuth: false },
  },
  {
    path: "/",
    // Relative to /src/views
    name: "home",
    view: "dashboard/home",
    meta: { requiresAuth: true },
  },
  {
    path: "/auth",
    // Relative to /src/views
    name: "auth",
    view: "auth",
    meta: { requiresAuth: false },
    props: { asdf: "" },
  },
  {
    path: "/checkout",
    name: "checkout",
    view: "checkout",
    meta: { requiresAuth: true },
  },
  {
    path: "/terms",
    view: "terms",
    meta: { requiresAuth: false }, // @todo IMPORTANT: CHANGE THIS!!!!!
  },
  {
    path: "/styleguide",
    view: "styleguide",
    meta: { requiresAuth: false },
  },
  {
    path: "/merchant",
    view: "merchant/index",
    meta: { requiresAuth: true },
    children: [
      {
        path: "home",
        name: "merchant-home",
        view: "merchant/home",
        meta: { requiresAuth: true },
      },
      {
        path: "profile",
        name: "merchant-profile",
        view: "merchant/profile",
        meta: { requiresAuth: true },
      },
      {
        path: "account",
        name: "merchant-account",
        view: "merchant/account",
        meta: { requiresAuth: true },
      },

      {
        path: "order/:orderId?",
        name: "merchant-order",
        view: "merchant/order",
        meta: { requiresAuth: true },
      },
      // Default route for merchant
      {
        path: "",
        redirect: "order",
        // name: 'merchant-index',
        // view: 'merchant/home',
        meta: { requiresAuth: true },
      },
    ],
  },
  // {
  //   path: '/qr',
  //   redirect: '/styleguide',
  // },
  {
    path: "/qr/qldorthotics",
    name: "qr",
    view: "auth",
    meta: { requiresAuth: true },
    props: { isQrCheckoutFlow: true },
    // redirect: { name: 'styleguide' },
  },
  {
    path: "/invite",
    name: "merchant-invite",
    view: "invite",
    meta: { requiresAuth: true },
  },
  {
    path: "/checkout/status",
    name: "checkout-status",
    view: "checkout/orderStatus",
    meta: { requiresAuth: false },
  },
];
