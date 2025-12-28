import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Evaluation {
  id: string;
  user_id: string;
  subject: string;
  description: string;
  created_at: string;
  evaluator1_details: {
    name: string;
    function: string;
    category: string;
    entry_date: string;
    seniority_date: string;
  } | null;
  evaluator2_details: {
    name: string;
    function: string;
    category: string;
    entry_date: string;
    seniority_date: string;
  } | null;
  // Include other evaluation fields if needed for display
  knowledge_evaluations: any;
  savoir_faire_evaluations: any;
  savoir_etre_evaluations: any;
  total_savoir: number;
  total_savoir_faire: number;
  total_savoir_etre: number;
  total_tenue_de_poste: number;
  strong_points: string[];
  areas_to_improve: string[];
  development_plans: string[];
  manager_comments: string;
  collaborator_comments: string;
}

interface EvaluationDetailsFormProps {
  evaluation: Evaluation;
  onUpdate: () => void; // Callback to refresh the list or state in parent
}

const EvaluationDetailsForm: React.FC<EvaluationDetailsFormProps> = ({ evaluation, onUpdate }) => {
  const { toast } = useToast();

  const [evaluator1Name, setEvaluator1Name] = useState(evaluation.evaluator1_details?.name || '');
  const [evaluator1Function, setEvaluator1Function] = useState(evaluation.evaluator1_details?.function || '');
  const [evaluator1Category, setEvaluator1Category] = useState(evaluation.evaluator1_details?.category || '');
  const [evaluator1EntryDate, setEvaluator1EntryDate] = useState(evaluation.evaluator1_details?.entry_date || '');
  const [evaluator1SeniorityDate, setEvaluator1SeniorityDate] = useState(evaluation.evaluator1_details?.seniority_date || '');

  const [evaluator2Name, setEvaluator2Name] = useState(evaluation.evaluator2_details?.name || '');
  const [evaluator2Function, setEvaluator2Function] = useState(evaluation.evaluator2_details?.function || '');
  const [evaluator2Category, setEvaluator2Category] = useState(evaluation.evaluator2_details?.category || '');
  const [evaluator2EntryDate, setEvaluator2EntryDate] = useState(evaluation.evaluator2_details?.entry_date || '');
  const [evaluator2SeniorityDate, setEvaluator2SeniorityDate] = useState(evaluation.evaluator2_details?.seniority_date || '');

  useEffect(() => {
    // Update form fields when a new evaluation is selected
    setEvaluator1Name(evaluation.evaluator1_details?.name || '');
    setEvaluator1Function(evaluation.evaluator1_details?.function || '');
    setEvaluator1Category(evaluation.evaluator1_details?.category || '');
    setEvaluator1EntryDate(evaluation.evaluator1_details?.entry_date || '');
    setEvaluator1SeniorityDate(evaluation.evaluator1_details?.seniority_date || '');

    setEvaluator2Name(evaluation.evaluator2_details?.name || '');
    setEvaluator2Function(evaluation.evaluator2_details?.function || '');
    setEvaluator2Category(evaluation.evaluator2_details?.category || '');
    setEvaluator2EntryDate(evaluation.evaluator2_details?.entry_date || '');
    setEvaluator2SeniorityDate(evaluation.evaluator2_details?.seniority_date || '');
  }, [evaluation]);

  const handleSaveEvaluatorDetails = async () => {
    const updatedEvaluator1Details = {
      name: evaluator1Name,
      function: evaluator1Function,
      category: evaluator1Category,
      entry_date: evaluator1EntryDate,
      seniority_date: evaluator1SeniorityDate,
    };

    const updatedEvaluator2Details = {
      name: evaluator2Name,
      function: evaluator2Function,
      category: evaluator2Category,
      entry_date: evaluator2EntryDate,
      seniority_date: evaluator2SeniorityDate,
    };

    const { error } = await supabase
      .from('evaluations')
      .update({
        evaluator1_details: updatedEvaluator1Details,
        evaluator2_details: updatedEvaluator2Details,
      })
      .eq('id', evaluation.id);

    if (error) {
      console.error('Error updating evaluator details:', error.message);
      toast({
        title: "Error",
        description: `Failed to save evaluator details: ${error.message}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Evaluator details saved successfully.",
      });
      onUpdate(); // Notify parent to refresh data
    }
  };

  const evaluationYear = new Date(evaluation.created_at).getFullYear();
  const evaluationDate = new Date(evaluation.created_at).toLocaleDateString();

  return (
    <Card className="p-6 sm:p-8 lg:p-10">
      <CardHeader className="mb-8">
        <CardTitle className="text-3xl sm:text-4xl font-bold text-foreground">Evaluation Details</CardTitle>
        <p className="text-muted-foreground">Viewing evaluation for: <span className="font-semibold text-foreground">{evaluation.subject}</span></p>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label className="block text-sm font-medium text-muted-foreground mb-1">Année d’évaluation</Label>
            <p className="text-lg font-semibold text-foreground">{evaluationYear}</p>
          </div>
          <div>
            <Label className="block text-sm font-medium text-muted-foreground mb-1">Date Evaluation</Label>
            <p className="text-lg font-semibold text-foreground">{evaluationDate}</p>
          </div>
        </div>

        {/* Evaluator 1 Details */}
        <div className="border rounded-lg p-6 bg-secondary/20">
          <h3 className="text-xl font-bold mb-6 text-foreground">Evaluateur 1</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="evaluator1Name">Nom et Prénom</Label>
              <Input id="evaluator1Name" value={evaluator1Name} onChange={(e) => setEvaluator1Name(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="evaluator1Function">Fonction</Label>
              <Input id="evaluator1Function" value={evaluator1Function} onChange={(e) => setEvaluator1Function(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="evaluator1Category">Catégorie</Label>
              <Input id="evaluator1Category" value={evaluator1Category} onChange={(e) => setEvaluator1Category(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="evaluator1EntryDate">Date d’entrée</Label>
              <Input id="evaluator1EntryDate" type="date" value={evaluator1EntryDate} onChange={(e) => setEvaluator1EntryDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="evaluator1SeniorityDate">Date d’ancienneté</Label>
              <Input id="evaluator1SeniorityDate" type="date" value={evaluator1SeniorityDate} onChange={(e) => setEvaluator1SeniorityDate(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Evaluator 2 Details */}
        <div className="border rounded-lg p-6 bg-secondary/20">
          <h3 className="text-xl font-bold mb-6 text-foreground">Evaluateur 2</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="evaluator2Name">Nom et Prénom</Label>
              <Input id="evaluator2Name" value={evaluator2Name} onChange={(e) => setEvaluator2Name(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="evaluator2Function">Fonction</Label>
              <Input id="evaluator2Function" value={evaluator2Function} onChange={(e) => setEvaluator2Function(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="evaluator2Category">Catégorie</Label>
              <Input id="evaluator2Category" value={evaluator2Category} onChange={(e) => setEvaluator2Category(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="evaluator2EntryDate">Date d’entrée</Label>
              <Input id="evaluator2EntryDate" type="date" value={evaluator2EntryDate} onChange={(e) => setEvaluator2EntryDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="evaluator2SeniorityDate">Date d’ancienneté</Label>
              <Input id="evaluator2SeniorityDate" type="date" value={evaluator2SeniorityDate} onChange={(e) => setEvaluator2SeniorityDate(e.target.value)} />
            </div>
          </div>
        </div>

        <Button onClick={handleSaveEvaluatorDetails} className="w-full h-12 text-lg">
          Save Evaluator Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default EvaluationDetailsForm;