import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CourseCreateForm } from '@/components/admin/CourseCreateForm';
import { ProductCreateForm } from '@/components/admin/ProductCreateForm';
import { BlogArticleCreateForm } from '@/components/admin/BlogArticleCreateForm';
import { useAuth } from '@/contexts/AuthContext';

export function Admin() {
  const { user } = useAuth();

  if (!user?.is_admin) {
    return (
      <div className="container py-8 text-center">
        <h1 className="text-2xl font-bold">Accès refusé</h1>
        <p className="mt-2 text-muted-foreground">
          Vous devez être administrateur pour accéder à cette page
        </p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-8">Tableau de bord administrateur</h1>
      
      <Tabs defaultValue="course" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="course">Cours</TabsTrigger>
          <TabsTrigger value="product">Produits</TabsTrigger>
          <TabsTrigger value="article">Articles</TabsTrigger>
        </TabsList>

        <TabsContent value="course">
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold">Créer un nouveau cours</h2>
            <CourseCreateForm />
          </div>
        </TabsContent>

        <TabsContent value="product">
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold">Ajouter un produit</h2>
            <ProductCreateForm />
          </div>
        </TabsContent>

        <TabsContent value="article">
          <div className="mt-6 space-y-4">
            <h2 className="text-xl font-semibold">Écrire un article</h2>
            <BlogArticleCreateForm />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Admin;
