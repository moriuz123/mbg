import './globals.css';

export const metadata = {
  title: 'Sistem Digitalisasi Supply Chain - Pemkab Lebak',
  description: 'Sistem Digitalisasi Supply Chain dan pemantauan distribusi logistik Pemerintah Kabupaten Lebak.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" style={{ scrollBehavior: 'smooth' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  fontFamily: {
                    sans: ['Inter', 'sans-serif'],
                    heading: ['"Plus Jakarta Sans"', 'sans-serif'],
                  },
                  colors: {
                    primary: {
                      50: '#e8f0fb',
                      100: '#d1e1f7',
                      200: '#a3c4ee',
                      300: '#75a6e5',
                      400: '#4788dc',
                      500: '#1e5ca8', // Base blue
                      600: '#184a86',
                      700: '#123765',
                      800: '#0a2463', // Dark blue
                      900: '#071840', // Very dark blue
                    },
                    accent: {
                      500: '#e8a020', // Gold/orange
                      600: '#d1901d',
                    }
                  }
                }
              }
            }
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
