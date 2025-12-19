import { Helmet } from 'react-helmet-async';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { SolutionsSection } from '@/components/SolutionsSection';
import { PresenceSection } from '@/components/PresenceSection';
import { WhyUsSection } from '@/components/WhyUsSection';
import { PartnersSection } from '@/components/PartnersSection';
import { ContactSection } from '@/components/ContactSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Groupe Premium | Industrial Equipment Distribution Across Africa</title>
        <meta 
          name="description" 
          content="Groupe Premium is Africa's leading distributor of industrial equipment and professional supplies. Operating across 12 African countries from our Casablanca headquarters since 1995." 
        />
        <meta name="keywords" content="industrial equipment, Africa, distribution, professional supplies, Casablanca, Morocco, B2B" />
        <meta property="og:title" content="Groupe Premium | Industrial Equipment Distribution Across Africa" />
        <meta property="og:description" content="Africa's trusted partner for industrial equipment and professional supplies. Delivering excellence across 12 countries." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://groupepremium.ma" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Navigation />
        <main>
          <HeroSection />
          <AboutSection />
          <SolutionsSection />
          <PresenceSection />
          <WhyUsSection />
          <PartnersSection />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
