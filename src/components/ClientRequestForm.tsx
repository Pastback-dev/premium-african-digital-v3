import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

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
          <CardTitle>Performance Evaluation Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-muted-foreground mb-1">
              Subject
            </label>
            <Input 
              id="subject" 
              type="text" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
              placeholder="Evaluation subject" 
              required 
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-muted-foreground mb-1">
              Description
            </label>
            <Textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              placeholder="Detailed description of the evaluation" 
              rows={5} 
              required 
            />
          </div>
          
          {/* Knowledge Evaluation Section */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">SAVOIR (Knowledge) - Coefficient: 0.2</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">SAVOIR COEF.</th>
                    <th className="text-left py-2 px-4">Niveau de notation</th>
                    {ratingLevels.map(level => (
                      <th key={level.id} className="text-center py-2 px-2 text-xs">
                        {level.label}<br />
                        <span className="text-muted-foreground">({level.value}%)</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {knowledgeCategories.map(category => (
                    <tr key={category.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-muted-foreground">Coefficient: {category.coefficient}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {ratingLevels.map(level => (
                            <span key={level.id} className="text-xs bg-muted px-2 py-1 rounded">
                              {level.label}
                            </span>
                          ))}
                        </div>
                      </td>
                      {ratingLevels.map(level => (
                        <td key={level.id} className="text-center py-3 px-2">
                          <input
                            type="radio"
                            name={`rating-${category.id}`}
                            value={level.id}
                            checked={knowledgeRatings[category.id] === level.id}
                            onChange={() => handleRatingChange(category.id, level.id)}
                            className="h-4 w-4"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total SAVOIR:</span>
                <span className="font-bold text-lg">
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
          
          <Button type="submit" className="w-full">
            Submit Evaluation
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};