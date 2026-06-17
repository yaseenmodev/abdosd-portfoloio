import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  Search,
  Palette,
  Stethoscope,
  ArrowLeft,
  ShoppingBag,
  Loader2,
  Filter,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

export default function Shop() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const { data: products = [], isLoading } = trpc.products.list.useQuery();
  const { addItem, count } = useCart();

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category ?? "illustration")))];

  const filtered = products.filter((p) => {
    const matchSearch =
      search === "" ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "all" || p.category === activeCategory;
    return matchSearch && matchCat && p.inStock;
  });

  const handleAddToCart = (product: (typeof products)[0]) => {
    addItem({
      productId: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
    });
    toast.success(`"${product.title}" added to cart!`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-medical-gradient-soft border-b border-slate-100">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <button className="p-2 rounded-lg hover:bg-white/80 text-slate-600 transition-colors">
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Medical Illustrations Shop</h1>
                <p className="text-sm text-slate-500 mt-0.5">
                  Premium digital medical art by Dr. Abdellrahman
                </p>
              </div>
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
      </div>

      <div className="container py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search illustrations..."
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize ${
                  activeCategory === cat
                    ? "bg-medical-blue text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-medical-blue" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <Palette className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            {products.length === 0 ? (
              <>
                <p className="text-xl font-semibold text-slate-600">Coming Soon!</p>
                <p className="text-slate-400 mt-2">
                  Medical illustrations are being prepared. Check back soon.
                </p>
              </>
            ) : (
              <>
                <p className="text-xl font-semibold text-slate-600">No results found</p>
                <p className="text-slate-400 mt-2">Try a different search or category.</p>
              </>
            )}
            <Link href="/">
              <Button className="mt-6 bg-medical-blue hover:bg-blue-800 text-white gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-6">
              Showing {filtered.length} illustration{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product) => (
                <div key={product.id} className="medical-card overflow-hidden group">
                  <Link href={`/shop/${product.id}`}>
                    <div className="aspect-square bg-slate-100 overflow-hidden cursor-pointer">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
                          <Palette className="w-12 h-12 text-slate-300" />
                        </div>
                      )}
                    </div>
                  </Link>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Link href={`/shop/${product.id}`}>
                        <h3 className="font-semibold text-slate-900 text-sm leading-tight hover:text-medical-blue transition-colors line-clamp-2 cursor-pointer">
                          {product.title}
                        </h3>
                      </Link>
                    </div>
                    {product.category && (
                      <span className="medical-badge text-xs mb-2 inline-block capitalize">
                        {product.category}
                      </span>
                    )}
                    <p className="text-xs text-slate-500 line-clamp-2 mb-3">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-black text-medical-blue">${product.price}</span>
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(product)}
                        className="bg-medical-blue hover:bg-blue-800 text-white gap-1.5 text-xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
