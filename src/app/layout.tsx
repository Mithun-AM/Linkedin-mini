// src/app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';
import Navbar from '@/app/components/ui/Navbar'; // Corrected path alias

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Linkedin Mini',
  description: 'A community platform assignment',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* ✨ STYLE: Changed background to a subtle slate color */}
      <body className={`${inter.className} bg-slate-100 text-slate-800`}>
        <AuthProvider>
          <Toaster position="top-center" />
          <Navbar />
          {/* ✨ STYLE: Added max-width for very large screens */}
          <main className="container mx-auto max-w-7xl px-4 py-6">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}