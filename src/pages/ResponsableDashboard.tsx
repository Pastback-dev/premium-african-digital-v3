import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import ResponsableEvaluationNotesForm from '@/components/ResponsableEvaluationNotesForm'; // Import the new component

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
  responsable_savoir_notes?: string[]; // New field
  responsable_savoir_faire_notes?: string[]; // New field
  responsable_savoir_etre_notes?: string[]; // New field
}

const ResponsableDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null>(null);

  const fetchEvaluations = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching evaluations:', error.message);
      toast({
        title: "Error",
        description: "Failed to load evaluations.",
        variant: "destructive",
      });
    } else {
      setEvaluations(data as Evaluation[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvaluations();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    } else {
      navigate('/login');
    }
  };

  const handleSelectEvaluation = (evaluation: Evaluation) => {
    setSelectedEvaluation(evaluation);
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Responsable Dashboard</h1>
          <Button onClick={handleSignOut} variant="destructive">
            Sign Out
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel: List of Evaluations */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Client Evaluations</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-muted-foreground">Loading evaluations...</p>
                ) : evaluations.length === 0 ? (
                  <p className="text-muted-foreground">No evaluations found.</p>
                ) : (
                  <div className="max-h-[70vh] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Subject</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Total Score</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {evaluations.map((evaluation) => (
                          <TableRow 
                            key={evaluation.id} 
                            onClick={() => handleSelectEvaluation(evaluation)}
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                          >
                            <TableCell className="font-medium">{evaluation.subject}</TableCell>
                            <TableCell>{new Date(evaluation.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>{evaluation.total_tenue_de_poste?.toFixed(1) || 'N/A'}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel: Evaluation Notes Form */}
          <div className="lg:col-span-2">
            {selectedEvaluation ? (
              <ResponsableEvaluationNotesForm evaluation={selectedEvaluation} onUpdate={fetchEvaluations} />
            ) : (
              <Card className="p-6 sm:p-8 lg:p-10 text-center flex items-center justify-center min-h-[500px]">
                <p className="text-muted-foreground text-lg">Select an evaluation from the left to add notes.</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsableDashboard;