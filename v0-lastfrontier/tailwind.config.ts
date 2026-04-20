import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0e1b24",
        tide: "#12354a",
        glacier: "#d9eef8",
        spruce: "#1d4c47",
        ember: "#dd7a38",
        fog: "#f4f8fb",
      },
      boxShadow: {
        panel: "0 22px 50px rgba(11, 24, 33, 0.10)",
      },
      backgroundImage: {
        "hero-north":
          "radial-gradient(circle at top left, rgba(217,238,248,0.92), transparent 40%), linear-gradient(135deg, rgba(18,53,74,0.96), rgba(14,27,36,0.98))",
      },
    },
  },
  plugins: [],
};

export default config;
