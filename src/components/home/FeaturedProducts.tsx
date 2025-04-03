
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import ProductGrid from '@/components/store/ProductGrid';
import { getFeaturedProducts } from '@/data/productsData';

const FeaturedProducts: React.FC = () => {
  const featuredProducts = getFeaturedProducts().slice(0, 3);

  return (
    <section className="bg-muted/30 py-16">
      <div className="container">
        <div className="mb-10 text-center">
          <h2 className="mb-2 text-3xl font-bold tracking-tight">Featured Products</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Discover our most popular evangelism resources and tools to help you spread the Word.
          </p>
        </div>
        
        <ProductGrid products={featuredProducts} />
        
        <div className="mt-10 text-center">
          <Link to="/store">
            <Button className="gap-2">
              <ShoppingCart className="h-4 w-4" />
              Visit Our Store
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
