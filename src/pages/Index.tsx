
import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import Testimonials from '@/components/home/Testimonials';
import Pricing from '@/components/home/Pricing';
import CallToAction from '@/components/home/CallToAction';
import AIFeaturesSection from '@/components/home/AIFeaturesSection';
import ResourcesSection from '@/components/home/ResourcesSection';
import BlogSection from '@/components/home/BlogSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import FeaturedCourses from '@/components/home/FeaturedCourses';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-700 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <Header />
      <main className="flex-1">
        <Hero />
        <Features />
        <FeaturedProducts />
        <FeaturedCourses />
        <AIFeaturesSection />
        <ResourcesSection />

        <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
          <div className="container space-y-8">
            <h2 className="text-3xl font-bold text-center">Création de Contenus Chrétiens par IA</h2>
            <p className="max-w-3xl mx-auto text-center text-muted-foreground">
              Générez facilement des posts inspirants pour vos réseaux sociaux grâce à notre intelligence artificielle spécialisée dans la foi chrétienne.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              <div className="p-6 border rounded-lg bg-white dark:bg-gray-900 hover:shadow-md transition-shadow">
                <h3 className="font-semibold mb-2">Génération de texte inspirant</h3>
                <p>Créez des messages bibliques, encouragements, prières et enseignements en un clic.</p>
              </div>
              <div className="p-6 border rounded-lg bg-white dark:bg-gray-900 hover:shadow-md transition-shadow">
                <h3 className="font-semibold mb-2">Génération d'images chrétiennes</h3>
                <p>Obtenez des visuels artistiques et calligraphiés pour illustrer vos versets et messages.</p>
              </div>
              <div className="p-6 border rounded-lg bg-white dark:bg-gray-900 hover:shadow-md transition-shadow">
                <h3 className="font-semibold mb-2">Planification multi-plateformes</h3>
                <p>Programmez vos publications sur Facebook, Instagram, WhatsApp et suivez leur impact.</p>
              </div>
              <div className="p-6 border rounded-lg bg-white dark:bg-gray-900 hover:shadow-md transition-shadow">
                <h3 className="font-semibold mb-2">Bibliothèque de templates chrétiens</h3>
                <p>Utilisez des modèles prêts à l'emploi pour vos posts, invitations, annonces et encouragements.</p>
              </div>
              <div className="p-6 border rounded-lg bg-white dark:bg-gray-900 hover:shadow-md transition-shadow">
                <h3 className="font-semibold mb-2">Modération IA chrétienne</h3>
                <p>Assurez-vous que vos contenus respectent la foi et les valeurs chrétiennes.</p>
              </div>
              <div className="p-6 border rounded-lg bg-white dark:bg-gray-900 hover:shadow-md transition-shadow">
                <h3 className="font-semibold mb-2">Partage et collaboration</h3>
                <p>Travaillez en équipe, partagez vos créations et touchez plus de personnes avec l'Évangile.</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <a href="/design">
                <Button size="lg">Démarrer la création</Button>
              </a>
            </div>
          </div>
        </section>

        <BlogSection />
        <Testimonials />
        <Pricing />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
