import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UserStatsPanel = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
      <Card>
        <CardHeader>
          <CardTitle>Création IA</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Posts générés : 12</p>
          <p>Images créées : 8</p>
          <p>Taux de partage : 65%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Formations</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Cours suivis : 4</p>
          <p>Quiz réussis : 7</p>
          <p>Certifications : 2</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mes Publications</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Posts sauvegardés : 15</p>
          <p>Engagement moyen : 120</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Boutique</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Commandes : 5</p>
          <p>Produits achetés : 12</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Groupes d'études</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Groupes rejoints : 3</p>
          <p>Sessions à venir : 2</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Autres</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Invitations en attente : 1</p>
          <p>Rappels actifs : 4</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStatsPanel;
