import { useForm } from 'react-hook-form'; 
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/database.types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const formSchema = z.object({
  name: z.string().min(1, 'Nom requis'),
  slug: z.string().min(1, 'Slug requis'),
  description: z.string().min(1, 'Description requise'),
  price: z.number().min(0.01, 'Prix minimum 0.01').default(0),
  imageUrl: z.string().url('URL image invalide'),
  stock: z.number().min(0).default(0),
  category: z.string().min(1, 'Catégorie requise')
});

export function ProductCreateForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      slug: '',
      price: 0,
      stock: 0,
      category: ''
    }
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase
        .from('products')
        .insert({ 
          ...values,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({ title: 'Succès', description: 'Produit créé avec succès' });
      form.reset();
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Échec de création du produit',
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom du produit</FormLabel>
              <FormControl>
                <Input placeholder="Livre d'évangélisation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Ajouter les autres champs similaires */}  
        <Button type="submit">Ajouter le produit</Button>
      </form>
    </Form>
  );
}
