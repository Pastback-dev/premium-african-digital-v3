import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PlusCircle, MinusCircle } from 'lucide-react';

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
  knowledge_evaluations: Array<{ category: string; rating: string; comment: string; percentage: number }>;
  savoir_faire_evaluations: Array<{ category: string; rating: string; comment: string; percentage: number }>;
  savoir_etre_evaluations: Array<{ category: string; rating: string; comment: string; percentage: number }>;
  total_savoir: number;
  total_savoir_faire: number;
  total_savoir_etre: number;
  total_tenue_de_poste: number;
  strong_points: string[];
  areas_to_improve: string[];
  development_plans: string[];
  manager_comments: string;
  collaborator_comments: string;
  responsable_savoir_notes?: string[];
  responsable_savoir_faire_notes?: string[];
  responsable_savoir_etre_notes?: string[];
}

interface ResponsableEvaluationNotesFormProps {
  evaluation: Evaluation;
  onUpdate: () => void; // Callback to refresh the list or state in parent
}

const ResponsableEvaluationNotesForm: React.FC<ResponsableEvaluationNotesFormProps> = ({ evaluation, onUpdate }) => {
  const { toast } = useToast();

  const [savoirNotes, setSavoirNotes] = useState<string[]>(evaluation.responsable_savoir_notes || ['']);
  const [savoirFaireNotes, setSavoirFaireNotes] = useState<string[]>(evaluation.responsable_savoir_faire_notes || ['']);
  const [savoirEtreNotes, setSavoirEtreNotes] = useState<string[]>(evaluation.responsable_savoir_etre_notes || ['']);

  useEffect(() => {
    // Update local state when a new evaluation is selected
    setSavoirNotes(evaluation.responsable_savoir_notes || ['']);
    setSavoirFaireNotes(evaluation.responsable_savoir_faire_notes || ['']);
    setSavoirEtreNotes(evaluation.responsable_savoir_etre_notes || ['']);
  }, [evaluation]);

  const handleAddNote = (type: 'savoir' | 'savoirFaire' | 'savoirEtre') => {
    if (type === 'savoir') setSavoirNotes(prev => [...prev, '']);
    else if (type === 'savoirFaire') setSavoirFaireNotes(prev => [...prev, '']);
    else setSavoirEtreNotes(prev => [...prev, '']);
  };

  const handleRemoveNote = (type: 'savoir' | 'savoirFaire' | 'savoirEtre', index: number) => {
    if (type === 'savoir') setSavoirNotes(prev => prev.filter((_, i) => i !== index));
    else if (type === 'savoirFaire') setSavoirFaireNotes(prev => prev.filter((_, i) => i !== index));
    else setSavoirEtreNotes(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdateNote = (type: 'savoir' | 'savoirFaire' | 'savoirEtre', index: number, value: string) => {
    if (type === 'savoir') setSavoirNotes(prev => prev.map((item, i) => (i === index ? value : item)));
    else if (type === 'savoirFaire') setSavoirFaireNotes(prev => prev.map((item, i) => (i === index ? value : item)));
    else setSavoirEtreNotes(prev => prev.map((item, i) => (i === index ? value : item)));
  };

  const handleSaveNotes = async () => {
    const { error } = await supabase
      .from('evaluations')
      .update({
        responsable_savoir_notes: savoirNotes.filter(Boolean), // Filter out empty strings
        responsable_savoir_faire_notes: savoirFaireNotes.filter(Boolean),
        responsable_savoir_etre_notes: savoirEtreNotes.filter(Boolean),
      })
      .eq('id', evaluation.id);

    if (error) {
      console.error('Error updating responsable notes:', error.message);
      toast({
        title: "Error",
        description: `Failed to save notes: ${error.message}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Responsable notes saved successfully.",
      });
      onUpdate(); // Notify parent to refresh data
    }
  };

  const renderNotesSection = (title: string, notes: string[], type: 'savoir' | 'savoirFaire' | 'savoirEtre') => (
    <div className="border rounded-lg p-6 bg-secondary/20">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
        <Button type="button" variant="outline" size="sm" onClick={() => handleAddNote(type)}>
          <PlusCircle className="w-4 h-4 mr-2" /> Add Note
        </Button>
      </div>
      <div className="space-y-4">
        {notes.map((note, index) => (
          <div key={index} className="flex items-center gap-2">
            <Textarea
              value={note}
              onChange={(e) => handleUpdateNote(type, index, e.target.value)}
              placeholder={`Enter note for ${title.toLowerCase()}...`}
              rows={2}
              className="flex-grow min-h-[60px] text-sm px-4 py-3"
            />
            <Button type="button" variant="destructive" size="icon" onClick={() => handleRemoveNote(type, index)}>
              <MinusCircle className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {notes.length === 0 && (
          <p className="text-muted-foreground text-sm">No notes added yet for {title.toLowerCase()}.</p>
        )}
      </div>
    </div>
  );

  return (
    <Card className="p-6 sm:p-8 lg:p-10">
      <CardHeader className="mb-8">
        <CardTitle className="text-3xl sm:text-4xl font-bold text-foreground">Evaluation Notes</CardTitle>
        <p className="text-muted-foreground">Adding notes for: <span className="font-semibold text-foreground">{evaluation.subject}</span></p>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Basic Evaluation Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 border rounded-lg p-6 bg-card">
          <div>
            <Label className="block text-sm font-medium text-muted-foreground mb-1">Subject</Label>
            <p className="text-lg font-semibold text-foreground">{evaluation.subject}</p>
          </div>
          <div>
            <Label className="block text-sm font-medium text-muted-foreground mb-1">Date Evaluation</Label>
            <p className="text-lg font-semibold text-foreground">{new Date(evaluation.created_at).toLocaleDateString()}</p>
          </div>
          <div className="md:col-span-2">
            <Label className="block text-sm font-medium text-muted-foreground mb-1">Description</Label>
            <p className="text-muted-foreground text-sm">{evaluation.description}</p>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-foreground">Tenue de poste Notes</h2>

        {renderNotesSection("Savoir (Knowledge)", savoirNotes, 'savoir')}
        {renderNotesSection("Savoir Faire (Know-how / Skills)", savoirFaireNotes, 'savoirFaire')}
        {renderNotesSection("Savoir Être (Attitude / Soft Skills)", savoirEtreNotes, 'savoirEtre')}

        <Button onClick={handleSaveNotes} className="w-full h-12 text-lg">
          Save Responsable Notes
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResponsableEvaluationNotesForm;