import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Header from "@/components/header";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "@/components/theme-provider";
// import { SessionProvider } from "next-auth/react";

import GoogleProvider from "./provider/page";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "CareConnect-Doctors Appointment App",
  description: "Connect with doctors anytime, anywhere",
};

// This is your main App wrapper (can stay a server component)
function MyApp({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

// RootLayout must wrap children in GoogleProvider (client) and ClerkProvider (server)
export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      {/* GoogleProvider is a client component */}
      <GoogleProvider>
        <html lang="en" suppressHydrationWarning>
          <head>
            <link rel="icon" href="/logocc.png" sizes="any" />
          </head>
          <body className={inter.className}>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              <Header />
              <main className="min-h-screen">{children}</main>
              <Toaster richColors />
              <footer className="bg-muted/50 py-12">
                <div className="container mx-auto px-4 text-center text-black">
                  <p>Made with 💗 by Team Hacksmith</p>
                </div>
              </footer>
            </ThemeProvider>
          </body>
        </html>
      </GoogleProvider>
    </ClerkProvider>
  );
}
