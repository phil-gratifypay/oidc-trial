<template>
  <v-app>
    <router-view :key="$route.path"></router-view>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({
    //
  }),
};
</script>
