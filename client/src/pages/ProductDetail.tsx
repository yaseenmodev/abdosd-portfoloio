import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  ShoppingBag,
  ShoppingCart,
  Palette,
  Loader2,
  Download,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

export default function ProductDetail() {
  const params = useParams<{ id: string }>();
  const productId = parseInt(params.id ?? "0");

  const { data: product, isLoading, error } = trpc.products.getById.useQuery(
    { id: productId },
    { enabled: !!productId }
  );

  const { addItem, count } = useCart();

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    toast.success(`"${product.title}" added to cart!`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-medical-blue" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <Palette className="w-16 h-16 text-slate-200" />
        <p className="text-xl font-semibold text-slate-600">Product not found</p>
        <Link href="/shop">
          <Button className="bg-medical-blue hover:bg-blue-800 text-white gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Shop
          </Button>
        </Link>
      </div>
    );
  }

  const tags = Array.isArray(product.tags) ? product.tags : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-medical-gradient-soft border-b border-slate-100">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/shop">
              <button className="p-2 rounded-lg hover:bg-white/80 text-slate-600 transition-colors flex items-center gap-1.5 text-sm font-medium">
                <ArrowLeft className="w-4 h-4" /> Back to Shop
              </button>
            </Link>
          </div>
          <Link href="/cart">
            <Button variant="outline" className="border-medical-blue text-medical-blue hover:bg-blue-50 gap-2">
              <ShoppingCart className="w-4 h-4" />
              Cart
              {count > 0 && (
                <span className="bg-medical-blue text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>

      <div className="container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-green-50 border border-slate-100 aspect-square flex items-center justify-center">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-full object-contain p-4"
              />
            ) : (
              <Palette className="w-20 h-20 text-slate-300" />
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {product.category && (
              <span className="medical-badge capitalize">{product.category}</span>
            )}
            <h1 className="text-3xl font-bold text-slate-900 leading-tight">{product.title}</h1>
            <div className="text-4xl font-black text-medical-blue">${product.price}</div>

            <p className="text-slate-600 leading-relaxed">{product.description}</p>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag: string) => (
                  <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600">
                    <Tag className="w-3 h-3" /> {tag}
                  </span>
                ))}
              </div>
            )}

            <Card className="p-4 bg-blue-50 border border-blue-100">
              <ul className="space-y-2">
                {[
                  "High-resolution digital file",
                  "Instant download after payment",
                  "Licensed for personal & educational use",
                  "Suitable for study, presentations, and printing",
                ].map((f) => (
                  <li key={f} className="flex gap-2 text-sm text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-medical-green flex-shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button
                onClick={handleAddToCart}
                className="flex-1 bg-medical-blue hover:bg-blue-800 text-white gap-2 py-3"
                disabled={!product.inStock}
              >
                <ShoppingBag className="w-4 h-4" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
              <Link href="/cart" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-2 border-medical-blue text-medical-blue hover:bg-blue-50 gap-2 py-3"
                >
                  <ShoppingCart className="w-4 h-4" /> View Cart
                </Button>
              </Link>
            </div>

            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5" />
              Download link delivered to your email within 24 hours of payment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
