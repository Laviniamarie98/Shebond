import React from 'react';
import Head from 'next/head';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'SheBond - Pregnancy Support' }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="SheBond - Supporting women through their pregnancy journey" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          
          @font-face {
            font-family: 'Lovelace';
            src: url('/fonts/Lovelace-Medium.woff2') format('woff2'),
                 url('/fonts/Lovelace-Medium.woff') format('woff');
            font-weight: 500;
            font-style: normal;
            font-display: swap;
          }
          
          .font-lovelace {
            font-family: 'Lovelace', serif;
          }
          
          body {
            font-family: 'Poppins', sans-serif;
          }
          
          h1, h2, h3, h4, h5 {
            font-family: 'Lovelace', serif;
          }
        `}</style>
      </Head>
      <Navbar />
      <main>{children}</main>
    </>
  );
} 