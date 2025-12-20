import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { toast } from 'sonner';
import { CalendarIcon, UserPlus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSession } from '@/components/SessionProvider';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  fullName: z.string().min(2, { message: 'Le nom et prénom doivent contenir au moins 2 caractères.' }),
  function: z.string().min(2, { message: 'La fonction doit contenir au moins 2 caractères.' }),
  category: z.string().min(2, { message: 'La catégorie doit contenir au moins 2 caractères.' }),
  entryDate: z.date({ required_error: "La date d'entrée est requise." }),
  seniorityDate: z.date({ required_error: "La date d'ancienneté est requise." }),
}).refine((data) => data.seniorityDate >= data.entryDate, {
  message: "La date d'ancienneté ne peut pas être antérieure à la date d'entrée.",
  path: ["seniorityDate"],
});

export const CollaboratorForm = () => {
  const { user } = useSession();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      function: '',
      category: '',
      entryDate: undefined,
      seniorityDate: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast.error('Vous devez être connecté pour soumettre les informations du collaborateur.');
      return;
    }

    const { error } = await supabase
      .from('collaborators')
      .insert({
        user_id: user.id,
        full_name: values.fullName,
        function: values.function,
        category: values.category,
        entry_date: values.entryDate.toISOString().split('T')[0], // Format date to 'YYYY-MM-DD'
        seniority_date: values.seniorityDate.toISOString().split('T')[0], // Format date to 'YYYY-MM-DD'
      });

    if (error) {
      console.error('Error submitting collaborator:', error);
      toast.error('Échec de la soumission des informations du collaborateur. Veuillez réessayer.');
    } else {
      toast.success('Informations du collaborateur soumises avec succès !');
      form.reset();
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-8 rounded-lg border border-border bg-card shadow-lg mt-12">
      <h2 className="text-3xl font-bold text-foreground mb-6 text-center font-heading">
        Ajouter un Collaborateur
      </h2>
      <p className="text-muted-foreground mb-8 text-center">
        Saisissez les détails du nouveau collaborateur.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground font-heading uppercase tracking-wider">Nom et Prénom</FormLabel>
                <FormControl>
                  <Input placeholder="Jean Dupont" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="function"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground font-heading uppercase tracking-wider">Fonction</FormLabel>
                <FormControl>
                  <Input placeholder="Responsable Commercial" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground font-heading uppercase tracking-wider">Catégorie</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="executive">Direction</SelectItem>
                    <SelectItem value="management">Gestion</SelectItem>
                    <SelectItem value="technical">Technique</SelectItem>
                    <SelectItem value="sales">Ventes</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="entryDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-sm font-medium text-foreground font-heading uppercase tracking-wider">Date d'entrée</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="seniorityDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="text-sm font-medium text-foreground font-heading uppercase tracking-wider">Date d'ancienneté</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Sélectionner une date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="premium" size="lg" className="w-full group">
            Ajouter le Collaborateur
            <UserPlus className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </form>
      </Form>
    </div>
  );
};