import './globals.css';

export const metadata = {
  title: 'Portal Makan Bergizi Gratis - Pemkab Lebak',
  description: 'Portal pemantauan program Makan Bergizi Gratis Pemerintah Kabupaten Lebak.',
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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    primary: {
                      50: '#fbf5dd',
                      100: '#f1eac1',
                      200: '#e7e1b1',
                      300: '#bbce75',
                      400: '#749e47',
                      500: '#4c8538',
                      600: '#306d29',
                      700: '#225e1e',
                      800: '#175816',
                      900: '#0d530e',
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
