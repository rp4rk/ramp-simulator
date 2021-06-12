export const parameters = {
  backgrounds: {
    default: "default",
    values: [{ name: "default", value: "#cde0fe" }],
  },
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
