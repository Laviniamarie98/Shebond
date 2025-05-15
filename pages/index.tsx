import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import { FaHeart } from 'react-icons/fa';
import { supabase } from '@/lib/supabase';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import CtaSection from '@/components/CtaSection';
import AuthForm from '@/components/auth/AuthForm';

export default function Home() {
  const [showLogin, setShowLogin] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for login parameter in URL
    if (router.query.login === 'true') {
      setShowLogin(true);
    }
  }, [router.query]);

  return (
    <>
      <Head>
        <title>SheBond - Your Pregnancy Journey</title>
      </Head>
      <main className={styles.main}>
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CtaSection />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerColumn}>
            <div className={styles.footerLogo}>
              <FaHeart /> SheBond
            </div>
            <p className={styles.footerDescription}>
              Supporting mothers through every step of their pregnancy journey with love, care, and beautiful design.
            </p>
            <div className={styles.footerSocial}>
              <a href="#" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a href="#" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div className={styles.footerColumn}>
            <h3>Features</h3>
            <ul className={styles.footerLinks}>
              <li><Link href="/pregnancy-tracker">Pregnancy Tracking</Link></li>
              <li><a href="#health-monitoring">Health Monitoring</a></li>
              <li><a href="#community-support">Community Support</a></li>
              <li><a href="#expert-resources">Expert Resources</a></li>
            </ul>
          </div>
          
          <div className={styles.footerColumn}>
            <h3>Company</h3>
            <ul className={styles.footerLinks}>
              <li><a href="#about-us">About Us</a></li>
              <li><a href="#our-team">Our Team</a></li>
              <li><a href="#careers">Careers</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          
          <div className={styles.footerColumn}>
            <h3>Stay Updated</h3>
            <p className={styles.footerDescription}>
              Subscribe to our newsletter for the latest pregnancy tips and app updates.
            </p>
            <div className={styles.newsletterForm}>
              <input 
                type="email" 
                placeholder="Your email" 
                className={styles.newsletterInput} 
              />
              <button className={`${styles.newsletterButton} hover-grow`}>Subscribe</button>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} SheBond. All rights reserved. Made with <FaHeart style={{ color: '#d5a676', verticalAlign: 'middle' }} /> for mothers everywhere.</p>
        </div>
      </footer>

      {showLogin && (
        <div className={styles.authModal}>
          <div className={styles.authModalContent}>
            <button 
              className={styles.authModalClose}
              onClick={() => setShowLogin(false)}
            >
              &times;
            </button>
            <AuthForm />
          </div>
        </div>
      )}

      {showCookieConsent && (
        <div className={`${styles.cookieConsent} fadeIn`}>
          <p className={styles.cookieText}>
            This site uses cookies to enhance your experience. By continuing to browse, you agree to our use of cookies.
          </p>
          <div className={styles.cookieButtons}>
            <button 
              className={`${styles.cookieButton} ${styles.denyButton}`}
              onClick={() => setShowCookieConsent(false)}
            >
              Deny
            </button>
            <button 
              className={`${styles.cookieButton} ${styles.acceptButton}`}
              onClick={() => setShowCookieConsent(false)}
            >
              Accept All
            </button>
          </div>
        </div>
      )}
    </>
  );
} 