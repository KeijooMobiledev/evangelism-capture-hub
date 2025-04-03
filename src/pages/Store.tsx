
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductGrid from '@/components/store/ProductGrid';
import ProductFilters from '@/components/store/ProductFilters';
import { Product } from '@/types/product';
import { getAllProducts, productCategories } from '@/data/productsData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Search } from 'lucide-react';

const Store: React.FC = () => {
  const navigate = useNavigate();
  const [products] = useState<Product[]>(getAllProducts());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);

  const handleCategoryChange = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const handlePriceChange = (newPriceRange: [number, number]) => {
    setPriceRange(newPriceRange);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 100]);
    setSearchQuery('');
  };

  const filteredProducts = products.filter(product => {
    // Filter by search query
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Filter by categories
    const matchesCategory = selectedCategories.length === 0 || 
      selectedCategories.some(catId => {
        const category = productCategories.find(c => c.id === catId);
        return category && product.category === category.name;
      });
    
    // Filter by price
    const matchesPrice = (product.salePrice || product.price) >= priceRange[0] && 
      (product.salePrice || product.price) <= priceRange[1];
    
    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Store</h1>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate('/cart')}
            >
              <ShoppingCart className="h-4 w-4" />
              <span>View Cart</span>
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="hidden md:block">
            <ProductFilters 
              categories={productCategories}
              onCategoryChange={handleCategoryChange}
              onPriceChange={handlePriceChange}
              onFilterReset={resetFilters}
              selectedCategories={selectedCategories}
              priceRange={priceRange}
            />
          </div>
          <div className="md:col-span-3">
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} />
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="text-xl font-semibold">No products found</h3>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={resetFilters}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Store;
