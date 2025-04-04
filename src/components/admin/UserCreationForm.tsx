import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const UserCreationForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'supervisor' | 'evangelist'>('supervisor');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Call backend function to create user
      // This should be a secure edge function that:
      // 1. Verifies the requesting user is a community admin
      // 2. Creates the new user with specified role
      // 3. Links the new user to the community of the creator
      
      const { data, error } = await supabase.functions.invoke('create-community-user', {
        body: { email, password, role }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Utilisateur créé avec succès",
        description: `Nouveau compte ${role === 'supervisor' ? 'Superviseur' : 'Évangéliste'} créé pour ${email}`,
      });

      // Reset form
      setEmail('');
      setPassword('');
      setRole('supervisor');
    } catch (error: any) {
      toast({
        title: "Error creating user",
        description: error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="user@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select value={role} onValueChange={(value: 'supervisor' | 'evangelist') => setRole(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="supervisor">Superviseur</SelectItem>
            <SelectItem value="evangelist">Évangéliste</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create User'}
      </Button>
    </form>
  );
};

export default UserCreationForm;
