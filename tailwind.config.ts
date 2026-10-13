import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vet: {
          mint: "#14B8A6",
          mintLight: "#F0FDFA",
          mintDark: "#0F766E",
          butter: "#FEF3C7",
          coral: "#F87171",
          coralLight: "#FEF2F2",
          sky: "#0284C7",
          skyLight: "#F0F9FF",
          cream: "#FCFDFD",
          sage: "#475569",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      borderRadius: {
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
      boxShadow: {
        soft: "0 10px 25px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)",
        cute: "0 8px 0px 0px rgba(20, 184, 166, 0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
