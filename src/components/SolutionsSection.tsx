import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Cog, Package, Truck, Wrench, Shield, Settings } from 'lucide-react';

const solutions = [
  {
    icon: Cog,
    title: 'Industrial Equipment',
    description: 'Heavy machinery, manufacturing tools, and precision equipment from world-renowned manufacturers.',
  },
  {
    icon: Package,
    title: 'Professional Supplies',
    description: 'Comprehensive range of industrial consumables, safety gear, and maintenance materials.',
  },
  {
    icon: Truck,
    title: 'Logistics & Distribution',
    description: 'End-to-end supply chain solutions with strategic warehousing across 12 African nations.',
  },
  {
    icon: Wrench,
    title: 'Technical Support',
    description: 'Expert installation, maintenance, and training services from certified professionals.',
  },
  {
    icon: Shield,
    title: 'Quality Assurance',
    description: 'Rigorous testing and certification processes ensuring products meet international standards.',
  },
  {
    icon: Settings,
    title: 'Custom Solutions',
    description: 'Tailored equipment packages and procurement strategies for unique industrial requirements.',
  },
];

export const SolutionsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="solutions" className="py-24 lg:py-32 bg-secondary/30 relative overflow-hidden" ref={ref}>
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[180px]" />
      
      <div className="container mx-auto px-6 lg:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
        >
          <span className="inline-block text-sm font-medium text-primary uppercase tracking-widest mb-6 font-heading">
            Our Solutions
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 font-heading">
            Comprehensive Industrial
            <br />
            <span className="text-gradient-crimson">Solutions & Services</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            From sourcing premium equipment to delivering expert support, we provide 
            end-to-end solutions that power Africa's industrial growth.
          </p>
        </motion.div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative p-8 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-500 hover:premium-shadow"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors duration-500">
                <solution.icon className="w-7 h-7 text-primary" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-3 font-heading group-hover:text-primary transition-colors duration-300">
                {solution.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {solution.description}
              </p>

              {/* Hover accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
