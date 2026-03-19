import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e40af", // Strong medical blue
        secondary: "#64748b", // Soft slate
        accent: "#ef4444", // Red for risk
      },
    },
  },
  plugins: [],
};
export default config;
