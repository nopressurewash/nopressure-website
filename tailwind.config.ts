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
        "np-black": "#000000",
        "np-gold": "var(--np-gold)",
        "np-purple": "var(--np-purple)",
        "np-muted": "var(--np-muted)"
      },
      boxShadow: {
        soft: "0 10px 30px rgba(0,0,0,0.35)",
      }
    },
  },
  plugins: [],
};

export default config;
