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
  const { toast } = useToast();

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
        percentage: ratingLevels.find(r => r.id === knowledgeRatings[category.id])?.value || 0
      }))
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
  };

  const handleRatingChange = (categoryId: string, ratingId: string) => {
    setKnowledgeRatings(prev => ({
      ...prev,
      [categoryId]: ratingId
    }));
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
                  <div className="grid grid-cols-7 gap-1 sm:gap-2">
                    {ratingLevels.map(level => (
                      <div key={level.id} className="flex flex-col items-center">
                        <input
                          type="radio"
                          id={`${category.id}-${level.id}`}
                          name={`rating-${category.id}`}
                          value={level.id}
                          checked={knowledgeRatings[category.id] === level.id}
                          onChange={() => handleRatingChange(category.id, level.id)}
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
                </div>
              ))}
            </div>
            
            <div className="mt-4 sm:mt-6 pt-4 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="font-medium text-foreground">Total SAVOIR:</span>
                <span className="font-bold text-lg sm:text-xl">
                  {/* Calculate total based on selected ratings */}
                  {knowledgeCategories.reduce((total, category) => {
                    const ratingId = knowledgeRatings[category.id];
                    const rating = ratingLevels.find(r => r.id === ratingId);
                    return total + (rating ? (rating.value * category.coefficient) : 0);
                  }, 0).toFixed(1)}%
                </span>
              </div>
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