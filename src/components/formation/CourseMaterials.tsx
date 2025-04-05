import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download, Link, Presentation } from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'presentation';
  url: string;
  size?: string;
}

const CourseMaterials = ({ materials }: { materials: Resource[] }) => {
  const getIcon = (type: string) => {
    switch(type) {
      case 'pdf': return <FileText className="h-4 w-4 mr-2" />;
      case 'link': return <Link className="h-4 w-4 mr-2" />;
      case 'presentation': return <Presentation className="h-4 w-4 mr-2" />;
      default: return <FileText className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Presentation className="h-5 w-5" />
          Supports de cours
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {materials.map((material) => (
          <div key={material.id} className="flex items-center justify-between p-2 border rounded">
            <div className="flex items-center">
              {getIcon(material.type)}
              <span>{material.title}</span>
              {material.size && <span className="text-xs text-muted-foreground ml-2">{material.size}</span>}
            </div>
            <Button variant="outline" size="sm" asChild>
              <a href={material.url} target="_blank" rel="noopener noreferrer">
                <Download className="h-4 w-4 mr-1" />
                {material.type === 'link' ? 'Ouvrir' : 'Télécharger'}
              </a>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CourseMaterials;
