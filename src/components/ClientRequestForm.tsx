import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';

// Knowledge evaluation data structure
const knowledgeCategories = [
  { 
    id: 'administration-rh', 
    name: 'Administration des Ressources Humaines', 
    coefficient: 0.2 
  },
  { 
    id: 'legislation-travail', 
    name: 'Maîtrise de la législation de travail', 
    coefficient: 0.2 
  },
  { 
    id: 'gestion-rh', 
    name: 'Gestion des Ressources Humaines', 
    coefficient: 0.2 
  }
];

// SAVOIR FAIRE evaluation data structure
const savoirFaireCategories = [
  { id: 'gestion-paie', name: 'Gestion de la paie', coefficient: 0.5 },
  { id: 'gestion-budgetaire', name: 'Gestion budgétaire', coefficient: 0.5 },
  { id: 'developpement-rh', name: 'Développement RH', coefficient: 0.5 },
  { id: 'ingenierie-formation', name: 'Ingénierie de formation', coefficient: 0.5 },
  { id: 'gestion-appareils', name: 'Gestion des appareils', coefficient: 0.5 },
  { id: 'application-si', name: 'Application Système d\'information', coefficient: 0.5 },
  { id: 'fiabilite-donnees', name: 'Fiabilité des données', coefficient: 0.5 },
  { id: 'preparation-etats', name: 'Préparation des états et documents de synthèse', coefficient: 0.5 },
  { id: 'preparation-resultats', name: 'Préparation des résultats et points périodiques', coefficient: 0.5 },
  { id: 'respect-delais', name: 'Respect des délais et engagements', coefficient: 0.5 },
  { id: 'respect-procedures', name: 'Respect des procédures', coefficient: 0.5 },
];

// SAVOIR ÊTRE evaluation data structure
const savoirEtreCategories = [
  { id: 'assiduite', name: 'Assiduitė', coefficient: 0.3 },
  { id: 'attitudes-positives', name: 'Attitudes positives', coefficient: 0.3 },
  { id: 'communication-environnement', name: 'Communication avec son environnement', coefficient: 0.3 },
  { id: 'creativite', name: 'Créativité (Valeur Groupe)', coefficient: 0.3 },
  { id: 'determination-perseverance', name: 'Détermination / Persévérance', coefficient: 0.3 },
  { id: 'discretion-confidentialite', name: 'Discrétion / Confidentialité', coefficient: 0.3 },
  { id: 'engagement-disponibilite-implication', name: 'Engagement / Disponibilité / Implication', coefficient: 0.3 },
  { id: 'esprit-equipe-cooperation', name: 'Esprit d\'équipe / Coopération', coefficient: 0.3 },
  { id: 'esprit-initiative-autonomie', name: 'Esprit d\'initiative / Force de proposition /Autonomie', coefficient: 0.3 },
  { id: 'exemplarite', name: 'Exemplarité (Valeur Groupe)', coefficient: 0.3 },
  { id: 'gestion-priorites', name: 'Gestion des priorités', coefficient: 0.3 },
  { id: 'humilite', name: 'Humilité (Valeur Groupe)', coefficient: 0.3 },
  { id: 'reactivite-orientation-resultats', name: 'Réactivité / Orientation résultats', coefficient: 0.3 },
  { id: 'remise-en-cause', name: 'Remise en cause', coefficient: 0.3 },
  { id: 'respect', name: 'Respect (Valeur Groupe)', coefficient: 0.3 },
  { id: 'rigueur-organisation-methode', name: 'Rigueur / Organisation / Méthode', coefficient: 0.3 },
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

export const ClientRequestForm = () => {
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

  const { toast } = useToast();

  // Calculate total for SAVOIR
  const totalSavoir = knowledgeCategories.reduce((total, category) => {
    const ratingId = knowledgeRatings[category.id];
    const rating = ratingLevels.find(r => r.id === ratingId);
    return total + (rating ? (rating.value * category.coefficient) : 0);
  }, 0);

  // Calculate total for SAVOIR FAIRE
  const totalSavoirFaire = savoirFaireCategories.reduce((total, category) => {
    const ratingId = savoirFaireRatings[category.id];
    const rating = ratingLevels.find(r => r.id === ratingId);
    return total + (rating ? (rating.value * category.coefficient) : 0);
  }, 0);

  // Calculate total for SAVOIR ÊTRE
  const totalSavoirEtre = savoirEtreCategories.reduce((total, category) => {
    const ratingId = savoirEtreRatings[category.id];
    const rating = ratingLevels.find(r => r.id === ratingId);
    return total + (rating ? (rating.value * category.coefficient) : 0);
  }, 0);

  // Calculate TOTAL TENUE DE POSTE
  const totalTenueDePoste = totalSavoir + totalSavoirFaire + totalSavoirEtre;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare evaluation data
    const evaluationData = {
      subject,
      description,
      knowledgeEvaluations: knowledgeCategories.map(category => ({
        category: category.name,
        coefficient: category.coefficient,
        rating: knowledgeRatings[category.id],
        comment: knowledgeComments[category.id],
        percentage: ratingLevels.find(r => r.id === knowledgeRatings[category.id])?.value || 0
      })),
      savoirFaireEvaluations: savoirFaireCategories.map(category => ({
        category: category.name,
        coefficient: category.coefficient,
        rating: savoirFaireRatings[category.id],
        comment: savoirFaireComments[category.id],
        percentage: ratingLevels.find(r => r.id === savoirFaireRatings[category.id])?.value || 0
      })),
      savoirEtreEvaluations: savoirEtreCategories.map(category => ({
        category: category.name,
        coefficient: category.coefficient,
        rating: savoirEtreRatings[category.id],
        comment: savoirEtreComments[category.id],
        percentage: ratingLevels.find(r => r.id === savoirEtreRatings[category.id])?.value || 0
      })),
      totalTenueDePoste: totalTenueDePoste.toFixed(1) // Include the grand total
    };
    
    console.log('Request submitted:', evaluationData);
    toast({ 
      title: "Request Submitted", 
      description: "Your request has been sent successfully." 
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Performance Evaluation Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="subject" className="block text-sm font-medium text-muted-foreground mb-2">
              Subject
            </Label>
            <Input 
              id="subject" 
              type="text" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
              placeholder="Evaluation subject" 
              required 
              className="h-12"
            />
          </div>
          
          <div>
            <Label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-2">
              Description
            </Label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Detailed description of the evaluation" 
              rows={5} 
              required 
              className="min-h-[120px]"
            />
          </div>
          
          {/* Knowledge Evaluation Section */}
          <div className="border rounded-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">SAVOIR (Knowledge) - Coefficient: 0.2</h3>
            
            <div className="space-y-6 sm:space-y-8">
              {knowledgeCategories.map(category => (
                <div key={category.id} className="border-b border-border pb-4 sm:pb-6 last:border-0 last:pb-0">
                  <div className="mb-3 sm:mb-4">
                    <h4 className="text-base sm:text-lg font-medium text-foreground">{category.name}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">Coefficient: {category.coefficient}</p>
                  </div>
                  
                  {/* Rating options - responsive grid */}
                  <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3">
                    {ratingLevels.map(level => (
                      <div key={level.id} className="flex flex-col items-center">
                        <input
                          type="radio"
                          id={`${category.id}-${level.id}`}
                          name={`rating-${category.id}`}
                          value={level.id}
                          checked={knowledgeRatings[category.id] === level.id}
                          onChange={() => handleRatingChange(category.id, level.id, 'knowledge')}
                          className="h-4 w-4 text-primary focus:ring-primary sr-only"
                        />
                        <Label 
                          htmlFor={`${category.id}-${level.id}`} 
                          className={`flex flex-col items-center justify-center p-2 rounded-md cursor-pointer text-center w-full transition-colors
                            ${knowledgeRatings[category.id] === level.id 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted hover:bg-muted/80'}
                          `}
                        >
                          <span className="text-xs sm:text-sm font-medium">{level.label}</span>
                          <span className="text-[0.6rem] sm:text-xs text-muted-foreground mt-1">
                            ({level.value}%)
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  {/* Commentary input */}
                  <div className="mt-3">
                    <Label htmlFor={`comment-${category.id}`} className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Commentary
                    </Label>
                    <Textarea 
                      id={`comment-${category.id}`}
                      value={knowledgeComments[category.id]}
                      onChange={(e) => handleCommentChange(category.id, e.target.value, 'knowledge')}
                      placeholder="Add your commentary for this category..."
                      rows={2}
                      className="min-h-[60px] text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 sm:mt-6 pt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground">Total SAVOIR:</span>
                <span className="font-bold text-lg sm:text-xl">
                  {totalSavoir.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* SAVOIR FAIRE Evaluation Section */}
          <div className="border rounded-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">SAVOIR FAIRE (Know-how / Skills) - Coefficient: 0.5</h3>
            
            <div className="space-y-6 sm:space-y-8">
              {savoirFaireCategories.map(category => (
                <div key={category.id} className="border-b border-border pb-4 sm:pb-6 last:border-0 last:pb-0">
                  <div className="mb-3 sm:mb-4">
                    <h4 className="text-base sm:text-lg font-medium text-foreground">{category.name}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">Coefficient: {category.coefficient}</p>
                  </div>
                  
                  {/* Rating options - responsive grid */}
                  <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3">
                    {ratingLevels.map(level => (
                      <div key={level.id} className="flex flex-col items-center">
                        <input
                          type="radio"
                          id={`${category.id}-${level.id}`}
                          name={`rating-${category.id}`}
                          value={level.id}
                          checked={savoirFaireRatings[category.id] === level.id}
                          onChange={() => handleRatingChange(category.id, level.id, 'savoirFaire')}
                          className="h-4 w-4 text-primary focus:ring-primary sr-only"
                        />
                        <Label 
                          htmlFor={`${category.id}-${level.id}`} 
                          className={`flex flex-col items-center justify-center p-2 rounded-md cursor-pointer text-center w-full transition-colors
                            ${savoirFaireRatings[category.id] === level.id 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted hover:bg-muted/80'}
                          `}
                        >
                          <span className="text-xs sm:text-sm font-medium">{level.label}</span>
                          <span className="text-[0.6rem] sm:text-xs text-muted-foreground mt-1">
                            ({level.value}%)
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  {/* Commentary input */}
                  <div className="mt-3">
                    <Label htmlFor={`comment-${category.id}`} className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Commentary
                    </Label>
                    <Textarea 
                      id={`comment-${category.id}`}
                      value={savoirFaireComments[category.id]}
                      onChange={(e) => handleCommentChange(category.id, e.target.value, 'savoirFaire')}
                      placeholder="Add your commentary for this category..."
                      rows={2}
                      className="min-h-[60px] text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 sm:mt-6 pt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground">Total SAVOIR FAIRE:</span>
                <span className="font-bold text-lg sm:text-xl">
                  {totalSavoirFaire.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* SAVOIR ÊTRE Evaluation Section */}
          <div className="border rounded-lg p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">SAVOIR ÊTRE (Attitude / Soft Skills) - Coefficient: 0.3</h3>
            
            <div className="space-y-6 sm:space-y-8">
              {savoirEtreCategories.map(category => (
                <div key={category.id} className="border-b border-border pb-4 sm:pb-6 last:border-0 last:pb-0">
                  <div className="mb-3 sm:mb-4">
                    <h4 className="text-base sm:text-lg font-medium text-foreground">{category.name}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">Coefficient: {category.coefficient}</p>
                  </div>
                  
                  {/* Rating options - responsive grid */}
                  <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-3">
                    {ratingLevels.map(level => (
                      <div key={level.id} className="flex flex-col items-center">
                        <input
                          type="radio"
                          id={`${category.id}-${level.id}`}
                          name={`rating-${category.id}`}
                          value={level.id}
                          checked={savoirEtreRatings[category.id] === level.id}
                          onChange={() => handleRatingChange(category.id, level.id, 'savoirEtre')}
                          className="h-4 w-4 text-primary focus:ring-primary sr-only"
                        />
                        <Label 
                          htmlFor={`${category.id}-${level.id}`} 
                          className={`flex flex-col items-center justify-center p-2 rounded-md cursor-pointer text-center w-full transition-colors
                            ${savoirEtreRatings[category.id] === level.id 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted hover:bg-muted/80'}
                          `}
                        >
                          <span className="text-xs sm:text-sm font-medium">{level.label}</span>
                          <span className="text-[0.6rem] sm:text-xs text-muted-foreground mt-1">
                            ({level.value}%)
                          </span>
                        </Label>
                      </div>
                    ))}
                  </div>
                  
                  {/* Commentary input */}
                  <div className="mt-3">
                    <Label htmlFor={`comment-${category.id}`} className="block text-xs font-medium text-muted-foreground mb-1.5">
                      Commentary
                    </Label>
                    <Textarea 
                      id={`comment-${category.id}`}
                      value={savoirEtreComments[category.id]}
                      onChange={(e) => handleCommentChange(category.id, e.target.value, 'savoirEtre')}
                      placeholder="Add your commentary for this category..."
                      rows={2}
                      className="min-h-[60px] text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 sm:mt-6 pt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground">Total SAVOIR ÊTRE:</span>
                <span className="font-bold text-lg sm:text-xl">
                  {totalSavoirEtre.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* TOTAL TENUE DE POSTE Section */}
          <div className="border rounded-lg p-4 sm:p-6 bg-primary/10">
            <div className="flex justify-between items-center">
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">TOTAL TENUE DE POSTE:</h3>
              <span className="font-bold text-xl sm:text-2xl text-primary">
                {totalTenueDePoste.toFixed(1)}%
              </span>
            </div>
          </div>
          
          <Button type="submit" className="w-full h-12 text-base">
            Submit Evaluation
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};