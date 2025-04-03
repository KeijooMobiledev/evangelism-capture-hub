
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductCategory } from '@/types/product';

interface ProductFiltersProps {
  categories: ProductCategory[];
  onCategoryChange: (categoryId: string) => void;
  onPriceChange: (priceRange: [number, number]) => void;
  onFilterReset: () => void;
  selectedCategories: string[];
  priceRange: [number, number];
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  onCategoryChange,
  onPriceChange,
  onFilterReset,
  selectedCategories,
  priceRange,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onFilterReset}>
          Reset
        </Button>
      </div>
      
      <Accordion type="multiple" defaultValue={["categories", "price"]}>
        <AccordionItem value="categories">
          <AccordionTrigger>Categories</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category.id}`} 
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => onCategoryChange(category.id)}
                  />
                  <Label htmlFor={`category-${category.id}`}>
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                defaultValue={priceRange}
                max={100}
                step={1}
                onValueChange={(value) => onPriceChange(value as [number, number])}
              />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="min-price">Min</Label>
                  <Input
                    id="min-price"
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => onPriceChange([Number(e.target.value), priceRange[1]])}
                    className="mt-1 w-24"
                  />
                </div>
                <div>
                  <Label htmlFor="max-price">Max</Label>
                  <Input
                    id="max-price"
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
                    className="mt-1 w-24"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ProductFilters;
