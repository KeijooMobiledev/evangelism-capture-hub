import EvangelismDesignTool from '@/components/design/EvangelismDesignTool';
import DashboardLayout from '@/components/layout/DashboardLayout';

const DesignToolPage = () => {
  return (
    <DashboardLayout>
      <div className="container py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Outil de Design Évangélique</h1>
          <p className="text-muted-foreground mt-1">
            Créez des visuels percutants pour partager l'Évangile
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border shadow-sm">
          <EvangelismDesignTool />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DesignToolPage;
