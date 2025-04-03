
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from '@/types/product';
import { useToast } from "@/components/ui/use-toast";
import { ShoppingCart, Heart } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toast } = useToast();

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const addToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: "Added to wishlist",
      description: `${product.name} has been added to your wishlist.`,
    });
  };

  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-lg">
      <Link to={`/store/${product.slug}`}>
        <CardHeader className="p-0">
          <div className="relative aspect-square overflow-hidden">
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="h-full w-full object-cover transition-transform hover:scale-105" 
            />
            {product.salePrice && (
              <Badge className="absolute right-2 top-2 bg-red-500">
                Sale
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <div className="mt-2 flex items-center">
            {product.salePrice ? (
              <>
                <span className="text-lg font-bold text-primary">${product.salePrice.toFixed(2)}</span>
                <span className="ml-2 text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
            )}
          </div>
          <div className="mt-2 flex items-center text-yellow-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`h-4 w-4 fill-current ${i < Math.floor(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
            <span className="ml-1 text-sm text-muted-foreground">({product.reviews?.length || 0})</span>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between p-4 pt-0">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={addToWishlist}
          >
            <Heart className="h-4 w-4" />
            <span className="sr-only md:not-sr-only md:inline">Wishlist</span>
          </Button>
          <Button 
            size="sm" 
            className="flex items-center gap-1"
            onClick={addToCart}
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default ProductCard;
