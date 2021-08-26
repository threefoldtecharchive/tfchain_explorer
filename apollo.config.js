module.exports = {
  client: {
    service: {
      name: "my-app",
      url: process.env.VUE_APP_GQL_URL,
    },
    includes: ["src/**/*.vue", "src/**/*.js", "src/**/*.ts"],
  },
};
