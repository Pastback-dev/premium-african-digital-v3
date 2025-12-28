import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { PlusCircle, MinusCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client'; // Import supabase client
import { useSession } from './SessionProvider'; // Import useSession to get user_id

// Define section coefficients
const SAVOIR_COEFFICIENT = 0.2;
const SAVOIR_FAIRE_COEFFICIENT = 0.5;
const SAVOIR_ETRE_COEFFICIENT = 0.3;

// Knowledge evaluation data structure (coefficients removed from individual categories)
const knowledgeCategories = [
  { id: 'administration-rh', name: 'Administration des Ressources Humaines' },
  { id: 'legislation-travail', name: 'Maîtrise de la législation de travail' },
  { id: 'gestion-rh', name: 'Gestion des Ressources Humaines' }
];

// SAVOIR FAIRE evaluation data structure (coefficients removed from individual categories)
const savoirFaireCategories = [
  { id: 'gestion-paie', name: 'Gestion de la paie' },
  { id: 'gestion-budgetaire', name: 'Gestion budgétaire' },
  { id: 'developpement-rh', name: 'Développement RH' },
  { id: 'ingenierie-formation', name: 'Ingénierie de formation' },
  { id: 'gestion-appareils', name: 'Gestion des appareils' },
  { id: 'application-si', name: 'Application Système d\'information' },
  { id: 'fiabilite-donnees', name: 'Fiabilité des données' },
  { id: 'preparation-etats', name: 'Préparation des états et documents de synthèse' },
  { id: 'preparation-resultats', name: 'Préparation des résultats et points périodique' },
  { id: 'respect-delais', name: 'Respect des délais et engagements' },
  { id: 'respect-procedures', name: 'Respect des procédures' },
];

// SAVOIR ÊTRE evaluation data structure (coefficients removed from individual categories)
const savoirEtreCategories = [
  { id: 'assiduite', name: 'Assiduitė' },
  { id: 'attitudes-positives', name: 'Attitudes positives' },
  { id: 'communication-environnement', name: 'Communication avec son environnement' },
  { id: 'creativite', name: 'Créativité (Valeur Groupe)' },
  { id: 'determination-perseverance', name: 'Détermination / Persévérance' },
  { id: 'discretion-confidentialite', name: 'Discrétion / Confidentialité' },
  { id: 'engagement-disponibilite-implication', name: 'Engagement / Disponibilité / Implication' },
  { id: 'esprit-equipe-cooperation', name: 'Esprit d\'équipe / Coopération' },
  { id: 'esprit-initiative-autonomie', name: 'Esprit d\'initiative / Force de proposition /Autonomie' },
  { id: 'exemplarite', name: 'Exemplarité (Valeur Groupe)' },
  { id: 'gestion-priorites', name: 'Gestion des priorités' },
  { id: 'humilite', name: 'Humilité (Valeur Groupe)' },
  { id: 'reactivite-orientation-resultats', name: 'Réactivité / Orientation résultats' },
  { id: 'remise-en-cause', name: 'Remise en cause' },
  { id: 'respect', name: 'Respect (Valeur Groupe)' },
  { id: 'rigueur-organisation-methode', name: 'Rigueur / Organisation / Méthode' },
];

const ratingLevels = [
  { id: 'A+', label: 'A+', value: 100 },
  { id: 'A', label: 'A', value: 90 },
  { id: 'B+', label: 'B+', value: 80 },
  { id: 'B', label: 'B', value: 70 },
  { id: 'B-', label: 'B-', value: 50 },
  { id: 'C', label: 'C', value: 30 },
  { id: 'D', label: 'D', value: 10 }
];

export function ClientRequestForm() {
  const { session } = useSession(); // Get session from context
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [knowledgeRatings, setKnowledgeRatings] = useState(
    knowledgeCategories.reduce((acc, category) => {
      acc[category.id] = '';
      return acc;
    }, {} as Record<string, string>)
  );
  const [knowledgeComments, setKnowledgeComments] = useState(
    knowledgeCategories.reduce((acc, category) => {
      acc[category.id] = '';
      return acc;
    }, {} as Record<string, string>)
  );

  const [savoirFaireRatings, setSavoirFaireRatings] = useState(
    savoirFaireCategories.reduce((acc, category) => {
      acc[category.id] = '';
      return acc;
    }, {} as Record<string, string>)
  );
  const [savoirFaireComments, setSavoirFaireComments] = useState(
    savoirFaireCategories.reduce((acc, category) => {
      acc[category.id] = '';
      return acc;
    }, {} as Record<string, string>)
  );

  const [savoirEtreRatings, setSavoirEtreRatings] = useState(
    savoirEtreCategories.reduce((acc, category) => {
      acc[category.id] = '';
      return acc;
    }, {} as Record<string, string>)
  );
  const [savoirEtreComments, setSavoirEtreComments] = useState(
    savoirEtreCategories.reduce((acc, category) => {
      acc[category.id] = '';
      return acc;
    }, {} as Record<string, string>)
  );

  // New state for Synthèse section
  const [strongPoints, setStrongPoints] = useState<string[]>(['', '', '']); // Min 3
  const [areasToImprove, setAreasToImprove] = useState<string[]>(['', '', '']); // Min 3
  const [developmentPlans, setDevelopmentPlans] = useState<string[]>(['']); // Min 1

  // New state for Manager and Collaborator comments
  const [managerComments, setManagerComments] = useState('');
  const [collaboratorComments, setCollaboratorComments] = useState('');

  const { toast } = useToast();

  // Calculate total for SAVOIR (sum of percentages / number of categories)
  const totalSavoirSum = knowledgeCategories.reduce((total, category) => {
    const ratingId = knowledgeRatings[category.id];
    const rating = ratingLevels.find(r => r.id === ratingId);
    return total + (rating ? rating.value : 0);
  }, 0);
  const totalSavoir = knowledgeCategories.length > 0 ? totalSavoirSum / knowledgeCategories.length : 0;

  // Calculate total for SAVOIR FAIRE (sum of percentages / number of categories)
  const totalSavoirFaireSum = savoirFaireCategories.reduce((total, category) => {
    const ratingId = savoirFaireRatings[category.id];
    const rating = ratingLevels.find(r => r.id === ratingId);
    return total + (rating ? rating.value : 0);
  }, 0);
  const totalSavoirFaire = savoirFaireCategories.length > 0 ? totalSavoirFaireSum / savoirFaireCategories.length : 0;

  // Calculate total for SAVOIR ÊTRE (sum of percentages / number of categories)
  const totalSavoirEtreSum = savoirEtreCategories.reduce((total, category) => {
    const ratingId = savoirEtreRatings[category.id];
    const rating = ratingLevels.find(r => r.id === ratingId);
    return total + (rating ? rating.value : 0);
  }, 0);
  const totalSavoirEtre = savoirEtreCategories.length > 0 ? totalSavoirEtreSum / savoirEtreCategories.length : 0;

  // Calculate TOTAL TENUE DE POSTE (applying coefficients to section totals)
  const totalTenueDePoste = 
    (totalSavoir * SAVOIR_COEFFICIENT) + 
    (totalSavoirFaire * SAVOIR_FAIRE_COEFFICIENT) + 
    (totalSavoirEtre * SAVOIR_ETRE_COEFFICIENT);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to submit an evaluation.",
        variant: "destructive",
      });
      return;
    }

    // Validate minimum entries for Synthèse
    if (strongPoints.filter(Boolean).length < 3) {
      toast({
        title: "Validation Error",
        description: "Please provide at least 3 'POINTS FORTS'.",
        variant: "destructive",
      });
      return;
    }
    if (areasToImprove.filter(Boolean).length < 3) {
      toast({
        title: "Validation Error",
        description: "Please provide at least 3 'POINTS A AMELIORER'.",
        variant: "destructive",
      });
      return;
    }
    if (developmentPlans.filter(Boolean).length < 1) {
      toast({
        title: "Validation Error",
        description: "Please provide at least 1 'Développement à envisager'.",
        variant: "destructive",
      });
      return;
    }
    
    // Prepare evaluation data for Supabase
    const evaluationData = {
      user_id: session.user.id,
      subject,
      description,
      knowledge_evaluations: knowledgeCategories.map(category => ({
        category: category.name,
        rating: knowledgeRatings[category.id],
        comment: knowledgeComments[category.id],
        percentage: ratingLevels.find(r => r.id === knowledgeRatings[category.id])?.value || 0
      })),
      savoir_faire_evaluations: savoirFaireCategories.map(category => ({
        category: category.name,
        rating: savoirFaireRatings[category.id],
        comment: savoirFaireComments[category.id],
        percentage: ratingLevels.find(r => r.id === savoirFaireRatings[category.id])?.value || 0
      })),
      savoir_etre_evaluations: savoirEtreCategories.map(category => ({
        category: category.name,
        rating: savoirEtreRatings[category.id],
        comment: savoirEtreComments[category.id],
        percentage: ratingLevels.find(r => r.id === savoirEtreRatings[category.id])?.value || 0
      })),
      total_savoir: parseFloat(totalSavoir.toFixed(1)),
      total_savoir_faire: parseFloat(totalSavoirFaire.toFixed(1)),
      total_savoir_etre: parseFloat(totalSavoirEtre.toFixed(1)),
      total_tenue_de_poste: parseFloat(totalTenueDePoste.toFixed(1)),
      strong_points: strongPoints.filter(Boolean), // Filter out empty strings
      areas_to_improve: areasToImprove.filter(Boolean), // Filter out empty strings
      development_plans: developmentPlans.filter(Boolean), // Filter out empty strings
      manager_comments: managerComments,
      collaborator_comments: collaboratorComments,
    };
    
    const { error } = await supabase.from('evaluations').insert([evaluationData]);

    if (error) {
      console.error('Error submitting evaluation:', error);
      toast({
        title: "Submission Failed",
        description: `There was an error submitting your evaluation: ${error.message}`,
        variant: "destructive",
      });
    } else {
      toast({ 
        title: "Request Submitted", 
        description: "Your evaluation has been sent successfully." 
      });
      
      // Reset form
      setSubject('');
      setDescription('');
      setKnowledgeRatings(
        knowledgeCategories.reduce((acc, category) => {
          acc[category.id] = '';
          return acc;
        }, {} as Record<string, string>)
      );
      setKnowledgeComments(
        knowledgeCategories.reduce((acc, category) => {
          acc[category.id] = '';
          return acc;
        }, {} as Record<string, string>)
      );
      setSavoirFaireRatings(
        savoirFaireCategories.reduce((acc, category) => {
          acc[category.id] = '';
          return acc;
        }, {} as Record<string, string>)
      );
      setSavoirFaireComments(
        savoirFaireCategories.reduce((acc, category) => {
          acc[category.id] = '';
          return acc;
        }, {} as Record<string, string>)
      );
      setSavoirEtreRatings(
        savoirEtreCategories.reduce((acc, category) => {
          acc[category.id] = '';
          return acc;
        }, {} as Record<string, string>)
      );
      setSavoirEtreComments(
        savoirEtreCategories.reduce((acc, category) => {
          acc[category.id] = '';
          return acc;
        }, {} as Record<string, string>)
      );
      setStrongPoints(['', '', '']);
      setAreasToImprove(['', '', '']);
      setDevelopmentPlans(['']);
      setManagerComments('');
      setCollaboratorComments('');
    }
  };

  const handleRatingChange = (categoryId: string, ratingId: string, type: 'knowledge' | 'savoirFaire' | 'savoirEtre') => {
    if (type === 'knowledge') {
      setKnowledgeRatings(prev => ({
        ...prev,
        [categoryId]: ratingId
      }));
    } else if (type === 'savoirFaire') {
      setSavoirFaireRatings(prev => ({
        ...prev,
        [categoryId]: ratingId
      }));
    } else { // savoirEtre
      setSavoirEtreRatings(prev => ({
        ...prev,
        [categoryId]: ratingId
      }));
    }
  };

  const handleCommentChange = (categoryId: string, comment: string, type: 'knowledge' | 'savoirFaire' | 'savoirEtre') => {
    if (type === 'knowledge') {
      setKnowledgeComments(prev => ({
        ...prev,
        [categoryId]: comment
      }));
    } else if (type === 'savoirFaire') {
      setSavoirFaireComments(prev => ({
        ...prev,
        [categoryId]: comment
      }));
    } else { // savoirEtre
      setSavoirEtreComments(prev => ({
        ...prev,
        [categoryId]: comment
      }));
    }
  };

  const addStrongPoint = () => {
    setStrongPoints(prev => [...prev, '']);
  };

  const removeStrongPoint = (index: number) => {
    if (strongPoints.length > 3) {
      setStrongPoints(prev => prev.filter((_, i) => i !== index));
    } else {
      toast({
        title: "Minimum Required",
        description: "You must have at least 3 'POINTS FORTS'.",
        variant: "destructive",
      });
    }
  };

  const updateStrongPoint = (index: number, value: string) => {
    setStrongPoints(prev => prev.map((item, i) => (i === index ? value : item)));
  };

  const addAreaToImprove = () => {
    setAreasToImprove(prev => [...prev, '']);
  };

  const removeAreaToImprove = (index: number) => {
    if (areasToImprove.length > 3) {
      setAreasToImprove(prev => prev.filter((_, i) => i !== index));
    } else {
      toast({
        title: "Minimum Required",
        description: "You must have at least 3 'POINTS A AMELIORER'.",
        variant: "destructive",
      });
    }
  };

  const updateAreaToImprove = (index: number, value: string) => {
    setAreasToImprove(prev => prev.map((item, i) => (i === index ? value : item)));
  };

  const addDevelopmentPlan = () => {
    setDevelopmentPlans(prev => [...prev, '']);
  };

  const removeDevelopmentPlan = (index: number) => {
    if (developmentPlans.length > 1) {
      setDevelopmentPlans(prev => prev.filter((_, i) => i !== index));
    } else {
      toast({
        title: "Minimum Required",
        description: "You must have at least 1 'Développement à envisager'.",
        variant: "destructive",
      });
    }
  };

  const updateDevelopmentPlan = (index: number, value: string) => {
    setDevelopmentPlans(prev => prev.map((item, i) => (i === index ? value : item)));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto py-8">
      <Card className="p-6 sm:p-8 lg:p-10">
        <CardHeader className="mb-8">
          <CardTitle className="text-3xl sm:text-4xl font-bold text-foreground">Performance Evaluation Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-10">
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject" className="block text-base font-semibold text-foreground mb-2">
                Subject
              </Label>
              <Input 
                id="subject" 
                type="text" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
                placeholder="Evaluation subject" 
                required 
                className="h-14 text-base px-4 py-3"
              />
            </div>
            
            <div>
              <Label htmlFor="description" className="block text-base font-semibold text-foreground mb-2">
                Description
              </Label>
              <Textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                placeholder="Detailed description of the evaluation" 
                rows={6}
                required 
                className="min-h-[150px] text-base px-4 py-3"
              />
            </div>
          </div>
          
          {/* Knowledge Evaluation Section */}
          <div className="border rounded-lg p-6 sm:p-8 bg-secondary/20">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-foreground">SAVOIR (Knowledge) - Coefficient: {SAVOIR_COEFFICIENT}</h3>
            
            <div className="space-y-8">
              {knowledgeCategories.map(category => (
                <div key={category.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
                  <div className="mb-4">
                    <h4 className="text-lg sm:text-xl font-semibold text-foreground">{category.name}</h4>
                  </div>
                  
                  {/* Rating options - responsive grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3 mb-4">
                    {ratingLevels.map(level => (
                      <div key={level.id} className="flex flex-col items-center">
                        <input
                          type="radio"
                          id={`${category.id}-${level.id}`}
                          name={`rating-${category.id}`}
                          value={level.id}
                          checked={knowledgeRatings[category.id] === level.id}
                          onChange={() => handleRatingChange(category.id, level.id, 'knowledge')}
                          className="sr-only"
                        />
                        <Label 
                          htmlFor={`${category.id}-${level.id}`} 
                          className={`flex flex-col items-center justify-center p-4 sm:p-5 rounded-lg cursor-pointer text-center w-full min-w-[70px] min-h-[70px] transition-all duration-200 border
                            ${knowledgeRatings[category.id] === level.id 
                              ? 'bg-primary text-primary-foreground border-primary shadow-md' 
                              : 'bg-card text-muted-foreground border-border hover:bg-muted/50 hover:text-foreground'}
                          `}
                        >
                          <span className="text-base sm:text-lg font-medium">{level.label}</span>
                          <span className="text-xs sm:text-sm text-muted-foreground mt-1">
                            ({level.value}%)
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  {/* Commentary input */}
                  <div className="mt-4">
                    <Label htmlFor={`comment-${category.id}`} className="block text-sm font-medium text-muted-foreground mb-2">
                      Commentary
                    </Label>
                    <Textarea 
                      id={`comment-${category.id}`}
                      value={knowledgeComments[category.id]}
                      onChange={(e) => handleCommentChange(category.id, e.target.value, 'knowledge')}
                      placeholder="Add your commentary for this category..."
                      rows={3}
                      className="min-h-[80px] text-sm px-4 py-3"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg text-foreground">Total SAVOIR:</span>
                <span className="font-bold text-xl sm:text-2xl text-primary">
                  {totalSavoir.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* SAVOIR FAIRE Evaluation Section */}
          <div className="border rounded-lg p-6 sm:p-8 bg-secondary/20">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-foreground">SAVOIR FAIRE (Know-how / Skills) - Coefficient: {SAVOIR_FAIRE_COEFFICIENT}</h3>
            
            <div className="space-y-8">
              {savoirFaireCategories.map(category => (
                <div key={category.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
                  <div className="mb-4">
                    <h4 className="text-lg sm:text-xl font-semibold text-foreground">{category.name}</h4>
                  </div>
                  
                  {/* Rating options - responsive grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3 mb-4">
                    {ratingLevels.map(level => (
                      <div key={level.id} className="flex flex-col items-center">
                        <input
                          type="radio"
                          id={`${category.id}-${level.id}`}
                          name={`rating-${category.id}`}
                          value={level.id}
                          checked={savoirFaireRatings[category.id] === level.id}
                          onChange={() => handleRatingChange(category.id, level.id, 'savoirFaire')}
                          className="sr-only"
                        />
                        <Label 
                          htmlFor={`${category.id}-${level.id}`} 
                          className={`flex flex-col items-center justify-center p-4 sm:p-5 rounded-lg cursor-pointer text-center w-full min-w-[70px] min-h-[70px] transition-all duration-200 border
                            ${savoirFaireRatings[category.id] === level.id 
                              ? 'bg-primary text-primary-foreground border-primary shadow-md' 
                              : 'bg-card text-muted-foreground border-border hover:bg-muted/50 hover:text-foreground'}
                          `}
                        >
                          <span className="text-base sm:text-lg font-medium">{level.label}</span>
                          <span className="text-xs sm:text-sm text-muted-foreground mt-1">
                            ({level.value}%)
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  {/* Commentary input */}
                  <div className="mt-4">
                    <Label htmlFor={`comment-${category.id}`} className="block text-sm font-medium text-muted-foreground mb-2">
                      Commentary
                    </Label>
                    <Textarea 
                      id={`comment-${category.id}`}
                      value={savoirFaireComments[category.id]}
                      onChange={(e) => handleCommentChange(category.id, e.target.value, 'savoirFaire')}
                      placeholder="Add your commentary for this category..."
                      rows={3}
                      className="min-h-[80px] text-sm px-4 py-3"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg text-foreground">Total SAVOIR FAIRE:</span>
                <span className="font-bold text-xl sm:text-2xl text-primary">
                  {totalSavoirFaire.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* SAVOIR ÊTRE Evaluation Section */}
          <div className="border rounded-lg p-6 sm:p-8 bg-secondary/20">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-foreground">SAVOIR ÊTRE (Attitude / Soft Skills) - Coefficient: {SAVOIR_ETRE_COEFFICIENT}</h3>
            
            <div className="space-y-8">
              {savoirEtreCategories.map(category => (
                <div key={category.id} className="border-b border-border pb-6 last:border-0 last:pb-0">
                  <div className="mb-4">
                    <h4 className="text-lg sm:text-xl font-semibold text-foreground">{category.name}</h4>
                  </div>
                  
                  {/* Rating options - responsive grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3 mb-4">
                    {ratingLevels.map(level => (
                      <div key={level.id} className="flex flex-col items-center">
                        <input
                          type="radio"
                          id={`${category.id}-${level.id}`}
                          name={`rating-${category.id}`}
                          value={level.id}
                          checked={savoirEtreRatings[category.id] === level.id}
                          onChange={() => handleRatingChange(category.id, level.id, 'savoirEtre')}
                          className="sr-only"
                        />
                        <Label 
                          htmlFor={`${category.id}-${level.id}`} 
                          className={`flex flex-col items-center justify-center p-4 sm:p-5 rounded-lg cursor-pointer text-center w-full min-w-[70px] min-h-[70px] transition-all duration-200 border
                            ${savoirEtreRatings[category.id] === level.id 
                              ? 'bg-primary text-primary-foreground border-primary shadow-md' 
                              : 'bg-card text-muted-foreground border-border hover:bg-muted/50 hover:text-foreground'}
                          `}
                        >
                          <span className="text-base sm:text-lg font-medium">{level.label}</span>
                          <span className="text-xs sm:text-sm text-muted-foreground mt-1">
                            ({level.value}%)
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  {/* Commentary input */}
                  <div className="mt-4">
                    <Label htmlFor={`comment-${category.id}`} className="block text-sm font-medium text-muted-foreground mb-2">
                      Commentary
                    </Label>
                    <Textarea 
                      id={`comment-${category.id}`}
                      value={savoirEtreComments[category.id]}
                      onChange={(e) => handleCommentChange(category.id, e.target.value, 'savoirEtre')}
                      placeholder="Add your commentary for this category..."
                      rows={3}
                      className="min-h-[80px] text-sm px-4 py-3"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 pt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-lg text-foreground">Total SAVOIR ÊTRE:</span>
                <span className="font-bold text-xl sm:text-2xl text-primary">
                  {totalSavoirEtre.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* TOTAL TENUE DE POSTE Section */}
          <div className="border rounded-lg p-6 sm:p-8 bg-primary/10">
            <div className="flex justify-between items-center">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">TOTAL TENUE DE POSTE:</h3>
              <span className="font-bold text-2xl sm:text-3xl text-primary">
                {totalTenueDePoste.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Synthèse Section */}
          <div className="border rounded-lg p-6 sm:p-8 bg-secondary/20">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-foreground">Synthèse</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {/* POINTS FORTS */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg sm:text-xl font-semibold text-foreground">POINTS FORTS (Min. 3)</h4>
                  <Button type="button" variant="outline" size="sm" onClick={addStrongPoint}>
                    <PlusCircle className="w-4 h-4 mr-2" /> Add
                  </Button>
                </div>
                <div className="space-y-4">
                  {strongPoints.map((point, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Textarea
                        value={point}
                        onChange={(e) => updateStrongPoint(index, e.target.value)}
                        placeholder={`Point fort ${index + 1}`}
                        rows={2}
                        className="flex-grow min-h-[60px] text-sm px-4 py-3"
                      />
                      {strongPoints.length > 3 && (
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeStrongPoint(index)}>
                          <MinusCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* POINTS A AMELIORER */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg sm:text-xl font-semibold text-foreground">POINTS A AMELIORER (Min. 3)</h4>
                  <Button type="button" variant="outline" size="sm" onClick={addAreaToImprove}>
                    <PlusCircle className="w-4 h-4 mr-2" /> Add
                  </Button>
                </div>
                <div className="space-y-4">
                  {areasToImprove.map((point, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Textarea
                        value={point}
                        onChange={(e) => updateAreaToImprove(index, e.target.value)}
                        placeholder={`Point à améliorer ${index + 1}`}
                        rows={2}
                        className="flex-grow min-h-[60px] text-sm px-4 py-3"
                      />
                      {areasToImprove.length > 3 && (
                        <Button type="button" variant="destructive" size="icon" onClick={() => removeAreaToImprove(index)}>
                          <MinusCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Développement à envisager */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg sm:text-xl font-semibold text-foreground">Développement à envisager (formation, évolution, réaffectation...) (Min. 1)</h4>
                <Button type="button" variant="outline" size="sm" onClick={addDevelopmentPlan}>
                  <PlusCircle className="w-4 h-4 mr-2" /> Add
                </Button>
              </div>
              <div className="space-y-4">
                {developmentPlans.map((plan, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Textarea
                      value={plan}
                      onChange={(e) => updateDevelopmentPlan(index, e.target.value)}
                      placeholder={`Développement ${index + 1}`}
                      rows={2}
                      className="flex-grow min-h-[60px] text-sm px-4 py-3"
                    />
                    {developmentPlans.length > 1 && (
                      <Button type="button" variant="destructive" size="icon" onClick={() => removeDevelopmentPlan(index)}>
                        <MinusCircle className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Appréciation globale et commentaires du Manager */}
          <div className="border rounded-lg p-6 sm:p-8 bg-secondary/20">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-foreground">Appréciation globale et commentaires du Manager</h3>
            <Textarea
              id="manager-comments"
              value={managerComments}
              onChange={(e) => setManagerComments(e.target.value)}
              placeholder="Enter global appreciation and comments from the Manager..."
              rows={8}
              className="min-h-[200px] text-base px-4 py-3"
            />
          </div>

          {/* Commentaires du collaborateur */}
          <div className="border rounded-lg p-6 sm:p-8 bg-secondary/20">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-foreground">Commentaires du collaborateur</h3>
            <Textarea
              id="collaborator-comments"
              value={collaboratorComments}
              onChange={(e) => setCollaboratorComments(e.target.value)}
              placeholder="Enter comments from the Collaborator..."
              rows={8}
              className="min-h-[200px] text-base px-4 py-3"
            />
          </div>
          
          <Button type="submit" className="w-full h-14 text-lg font-semibold">
            Submit Evaluation
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};