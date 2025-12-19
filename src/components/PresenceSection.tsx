import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

const countries = [
  { name: 'Morocco', code: 'MA', headquarters: true },
  { name: 'Senegal', code: 'SN' },
  { name: 'Ivory Coast', code: 'CI' },
  { name: 'Ghana', code: 'GH' },
  { name: 'Nigeria', code: 'NG' },
  { name: 'Cameroon', code: 'CM' },
  { name: 'Gabon', code: 'GA' },
  { name: 'DR Congo', code: 'CD' },
  { name: 'Kenya', code: 'KE' },
  { name: 'Tanzania', code: 'TZ' },
  { name: 'South Africa', code: 'ZA' },
  { name: 'Egypt', code: 'EG' },
];

export const PresenceSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  return (
    <section id="presence" className="py-24 lg:py-32 bg-background relative overflow-hidden" ref={ref}>
      {/* Background accents */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--foreground)) 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }}
        />
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gold/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-6 lg:px-12 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
        >
          <span className="inline-block text-sm font-medium text-primary uppercase tracking-widest mb-6 font-heading">
            Our Presence
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 font-heading">
            Strategically Positioned
            <br />
            <span className="text-gradient-gold">Across Africa</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            With operations in 12 countries, we maintain a robust network ensuring 
            efficient distribution and localized support across the continent.
          </p>
        </motion.div>

        {/* Map and Countries */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Stylized Africa Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative aspect-square max-w-lg mx-auto"
          >
            {/* Abstract map representation */}
            <svg viewBox="0 0 400 450" className="w-full h-full">
              {/* Africa outline - simplified elegant shape */}
              <path
                d="M200 20 C120 30 80 80 70 140 C60 200 50 260 80 320 C100 360 140 400 180 420 C200 430 220 430 240 420 C280 400 320 360 340 300 C360 240 350 180 330 120 C310 60 260 30 200 20 Z"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="2"
                className="opacity-50"
              />
              
              {/* Country points */}
              {[
                { cx: 160, cy: 80, name: 'Morocco' },
                { cx: 100, cy: 180, name: 'Senegal' },
                { cx: 130, cy: 200, name: 'Ivory Coast' },
                { cx: 150, cy: 210, name: 'Ghana' },
                { cx: 190, cy: 220, name: 'Nigeria' },
                { cx: 200, cy: 250, name: 'Cameroon' },
                { cx: 180, cy: 280, name: 'Gabon' },
                { cx: 220, cy: 310, name: 'DR Congo' },
                { cx: 300, cy: 280, name: 'Kenya' },
                { cx: 290, cy: 320, name: 'Tanzania' },
                { cx: 260, cy: 400, name: 'South Africa' },
                { cx: 280, cy: 100, name: 'Egypt' },
              ].map((point, i) => (
                <g key={point.name}>
                  {/* Pulse animation */}
                  <circle
                    cx={point.cx}
                    cy={point.cy}
                    r="20"
                    fill={hoveredCountry === point.name ? 'hsl(var(--primary))' : 'hsl(var(--gold))'}
                    opacity="0.2"
                    className="animate-pulse"
                  />
                  {/* Main point */}
                  <circle
                    cx={point.cx}
                    cy={point.cy}
                    r="8"
                    fill={point.name === 'Morocco' ? 'hsl(var(--primary))' : 'hsl(var(--gold))'}
                    className="cursor-pointer transition-all duration-300"
                    onMouseEnter={() => setHoveredCountry(point.name)}
                    onMouseLeave={() => setHoveredCountry(null)}
                  />
                  {/* Headquarters indicator */}
                  {point.name === 'Morocco' && (
                    <circle
                      cx={point.cx}
                      cy={point.cy}
                      r="14"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      className="animate-pulse"
                    />
                  )}
                </g>
              ))}
              
              {/* Connection lines */}
              <path
                d="M160 80 L100 180 L130 200 L150 210 L190 220 L200 250 L180 280 L220 310 L290 320 L260 400"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.3"
              />
              <path
                d="M160 80 L280 100 L300 280 L290 320"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.3"
              />
            </svg>

            {/* Hovered country label */}
            {hoveredCountry && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card border border-border rounded-lg px-4 py-2 premium-shadow pointer-events-none"
              >
                <span className="text-foreground font-heading font-medium">{hoveredCountry}</span>
              </motion.div>
            )}
          </motion.div>

          {/* Countries List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="grid grid-cols-2 gap-4">
              {countries.map((country, index) => (
                <motion.div
                  key={country.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.05 }}
                  onMouseEnter={() => setHoveredCountry(country.name)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                    country.headquarters
                      ? 'border-primary/50 bg-primary/5'
                      : 'border-border hover:border-gold/50 hover:bg-gold/5'
                  } ${hoveredCountry === country.name ? 'scale-105 premium-shadow' : ''}`}
                >
                  <MapPin className={`w-5 h-5 ${country.headquarters ? 'text-primary' : 'text-gold'}`} />
                  <div>
                    <span className="font-medium text-foreground font-heading">{country.name}</span>
                    {country.headquarters && (
                      <span className="block text-xs text-primary uppercase tracking-wider">HQ</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
