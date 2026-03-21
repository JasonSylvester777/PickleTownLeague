export const metadata = {
  title: "PickleTown @Betshalom PickleBall League",
  description: "Live leaderboard and match updates",
};

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
