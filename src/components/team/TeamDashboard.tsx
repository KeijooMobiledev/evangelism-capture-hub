import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Team {
  id: string;
  name: string;
  description: string;
}

interface Member {
  id: string;
  user_id: string;
  role: string;
}

const TeamDashboard = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<Member[]>([]);

  const fetchTeams = async () => {
    const { data } = await supabase.from('teams').select('*');
    setTeams(data || []);
  };

  const fetchMembers = async (teamId: string) => {
    const { data } = await supabase
      .from('team_members')
      .select('*')
      .eq('team_id', teamId);
    setMembers(data || []);
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-2xl font-bold">Gestion des équipes</h1>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h2 className="font-semibold">Mes équipes</h2>
          {teams.map(team => (
            <Card key={team.id} onClick={() => {
              setSelectedTeam(team);
              fetchMembers(team.id);
            }} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{team.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{team.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedTeam && (
          <div className="space-y-4">
            <h2 className="font-semibold">Membres de {selectedTeam.name}</h2>
            {members.map(member => (
              <div key={member.id} className="p-3 border rounded flex justify-between">
                <span>{member.user_id}</span>
                <span>{member.role}</span>
              </div>
            ))}
            <Button className="mt-4">Ajouter un membre</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamDashboard;
