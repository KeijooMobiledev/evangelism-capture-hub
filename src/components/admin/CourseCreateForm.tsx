import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  title: z.string().min(1, 'Titre requis'),
  slug: z.string().min(1, 'Slug requis'),
  shortDescription: z.string().optional(),
  fullDescription: z.string().min(1, 'Description requise'),
  coverImageUrl: z.string().url('URL image invalide'),
  price: z.number().min(0, 'Prix minimum 0').default(0)
});

export function CourseCreateForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      slug: '',
      price: 0
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase
        .from('courses')
        .insert({ 
          ...values,
          created_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      toast({ title: 'Succès', description: 'Cours créé avec succès' });
      form.reset();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Échec de création du cours',
        variant: 'destructive'
      });
      console.error(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre du cours</FormLabel>
              <FormControl>
                <Input placeholder="Introduction à l'évangélisation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug (URL)</FormLabel>
              <FormControl>
                <Input placeholder="introduction-evangelisation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Ajouter les autres champs du formulaire */}
        <Button type="submit">Ajouter le cours</Button>
      </form>
    </Form>
  );
}
