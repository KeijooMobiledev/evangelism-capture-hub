
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getProductBySlug, getFeaturedProducts } from '@/data/productsData';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Heart, ArrowLeft, Star } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import ProductGrid from '@/components/store/ProductGrid';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (slug) {
      const foundProduct = getProductBySlug(slug);
      if (foundProduct) {
        setProduct(foundProduct);
        // Get featured products excluding current product
        const featured = getFeaturedProducts().filter(p => p.id !== foundProduct.id);
        setRelatedProducts(featured.slice(0, 4));
      } else {
        navigate('/store');
      }
    }
  }, [slug, navigate]);

  const addToCart = () => {
    if (product) {
      toast({
        title: 'Added to cart',
        description: `${quantity} x ${product.name} has been added to your cart.`,
      });
    }
  };

  const addToWishlist = () => {
    if (product) {
      toast({
        title: 'Added to wishlist',
        description: `${product.name} has been added to your wishlist.`,
      });
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container py-12 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Loading product...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2"
          onClick={() => navigate('/store')}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Store</span>
        </Button>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border bg-muted">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex space-x-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className={`aspect-square w-20 overflow-hidden rounded-md border ${
                    selectedImage === index ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="mt-2 flex items-center">
                <div className="flex items-center text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-gray-200 text-gray-200'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">
                    ({product.reviews?.length || 0} reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {product.salePrice ? (
                  <>
                    <span className="text-3xl font-bold text-primary">
                      ${product.salePrice.toFixed(2)}
                    </span>
                    <span className="text-lg text-muted-foreground line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-3xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {product.inStock ? (
                  <span className="text-green-600">In Stock</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
                {product.stockQuantity && (
                  <span className="ml-2">
                    ({product.stockQuantity} available)
                  </span>
                )}
              </p>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium">Description</h3>
              <p className="mt-2 text-muted-foreground">{product.description}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity(quantity - 1)}
                >
                  -
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>

              <div className="flex space-x-2">
                <Button
                  className="flex-1 flex items-center justify-center gap-2"
                  onClick={addToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Add to Cart</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={addToWishlist}
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Category:</span>
                <span className="text-sm text-muted-foreground">
                  {product.category}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Tags:</span>
                <div className="flex flex-wrap gap-1">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Tabs defaultValue="reviews">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({product.reviews?.length || 0})
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <p>{product.description}</p>
              </div>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <div className="space-y-6">
                {product.reviews && product.reviews.length > 0 ? (
                  product.reviews.map((review) => (
                    <div key={review.id} className="space-y-2 rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{review.userName}</h4>
                        <div className="flex items-center text-yellow-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'fill-gray-200 text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground">
                    No reviews yet. Be the first to review this product!
                  </p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">You might also like</h2>
            <ProductGrid products={relatedProducts} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;
