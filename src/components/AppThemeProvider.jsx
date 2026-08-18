import { ThemeProvider } from "next-themes";

export default function AppThemeProvider({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="repopilot-theme"
      themes={["light", "dark"]}
    >
      {children}
    </ThemeProvider>
  );
}
