import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  LogOut,
  Eye,
  EyeOff,
  MessageSquare,
  Send,
  ShoppingBag,
  Package,
  LayoutDashboard,
  Users,
  Stethoscope,
  Mail,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();
  const diffH = (now.getTime() - d.getTime()) / 3600000;
  if (diffH < 24) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  if (diffH < 48) return "Yesterday";
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

type AdminSection = "dashboard" | "products" | "orders" | "bookings" | "messages";

export default function Admin() {
  const adminCheckQuery = trpc.auth.adminCheck.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });
  const adminLogout = trpc.auth.adminLogout.useMutation();
  const utils = trpc.useUtils();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [section, setSection] = useState<AdminSection>("dashboard");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        await utils.auth.adminCheck.invalidate();
        setPassword("");
      } else {
        const data = await res.json().catch(() => ({}));
        setLoginError(data.error || "Login failed");
      }
    } catch {
      setLoginError("Network error. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await adminLogout.mutateAsync();
    await utils.auth.adminCheck.invalidate();
  };

  if (adminCheckQuery.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-medical-gradient-soft">
        <Loader2 className="w-8 h-8 animate-spin text-medical-blue" />
      </div>
    );
  }

  if (!adminCheckQuery.data?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-medical-gradient-soft">
        <Card className="p-8 w-full max-w-sm shadow-xl border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-medical-blue flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Admin Panel</h1>
              <p className="text-xs text-slate-500">Dr. Abdellrahman Portfolio</p>
            </div>
          </div>

          {loginError && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <XCircle className="w-4 h-4 flex-shrink-0" />
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-700">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoggingIn}
                autoComplete="email"
                required
                placeholder="admin@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 text-slate-700">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoggingIn}
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-medical-blue hover:bg-blue-800 text-white"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...</> : "Sign In"}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-medical-blue flex items-center justify-center">
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Admin Panel</p>
              <p className="text-xs text-slate-400">Dr. Abdellrahman</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {(
            [
              { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: "products", label: "Products", icon: <ShoppingBag className="w-4 h-4" /> },
              { id: "orders", label: "Orders", icon: <Package className="w-4 h-4" /> },
              { id: "bookings", label: "Bookings", icon: <BookOpen className="w-4 h-4" /> },
              { id: "messages", label: "Messages", icon: <MessageSquare className="w-4 h-4" /> },
            ] as { id: AdminSection; label: string; icon: React.ReactNode }[]
          ).map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                section === item.id
                  ? "bg-blue-50 text-medical-blue"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="w-full text-slate-500 hover:text-red-600 hover:bg-red-50 gap-2 justify-start"
          >
            <LogOut className="w-4 h-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {section === "dashboard" && <DashboardSection />}
        {section === "products" && <ProductsSection />}
        {section === "orders" && <OrdersSection />}
        {section === "bookings" && <BookingsSection />}
        {section === "messages" && <MessagesSection />}
      </main>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────

function DashboardSection() {
  const { data: products = [] } = trpc.products.list.useQuery();
  const { data: orders = [] } = trpc.orders.list.useQuery();
  const { data: bookings = [] } = trpc.bookings.list.useQuery();
  const { data: contacts = [] } = trpc.contacts.list.useQuery();

  const paidOrders = orders.filter((o) => o.status === "paid");
  const revenue = paidOrders.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0);
  const unread = contacts.filter((c) => !c.read).length;
  const pendingBookings = bookings.filter((b) => b.status === "pending").length;

  const stats = [
    { label: "Total Products", value: products.length, icon: <ShoppingBag className="w-5 h-5" />, color: "text-medical-blue bg-blue-50" },
    { label: "Total Revenue", value: `$${revenue.toFixed(0)}`, icon: <TrendingUp className="w-5 h-5" />, color: "text-medical-green bg-green-50" },
    { label: "Pending Bookings", value: pendingBookings, icon: <Users className="w-5 h-5" />, color: "text-amber-600 bg-amber-50" },
    { label: "Unread Messages", value: unread, icon: <Mail className="w-5 h-5" />, color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Card key={s.label} className="p-5 border border-slate-200 bg-white">
            <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
              {s.icon}
            </div>
            <p className="text-2xl font-black text-slate-900">{s.value}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5 border border-slate-200 bg-white">
          <h3 className="font-semibold text-slate-900 mb-3">Recent Orders</h3>
          {orders.slice(-5).reverse().map((o) => (
            <div key={o.id} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
              <div>
                <p className="text-sm font-medium text-slate-800">{o.customerName}</p>
                <p className="text-xs text-slate-400">{formatDate(o.createdAt)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-medical-blue">${o.totalAmount}</p>
                <OrderStatusBadge status={o.status} />
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-sm text-slate-400 py-4 text-center">No orders yet</p>}
        </Card>

        <Card className="p-5 border border-slate-200 bg-white">
          <h3 className="font-semibold text-slate-900 mb-3">Recent Messages</h3>
          {contacts.slice(-5).reverse().map((c) => (
            <div key={c.id} className="flex justify-between items-start py-2 border-b border-slate-50 last:border-0">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-800 truncate">{c.name}</p>
                <p className="text-xs text-slate-400 truncate">{c.message?.slice(0, 50)}...</p>
              </div>
              {!c.read && (
                <span className="ml-2 w-2 h-2 rounded-full bg-medical-blue flex-shrink-0 mt-1.5" />
              )}
            </div>
          ))}
          {contacts.length === 0 && <p className="text-sm text-slate-400 py-4 text-center">No messages yet</p>}
        </Card>
      </div>
    </div>
  );
}

// ── Products ──────────────────────────────────────────────────────────────────

function ProductsSection() {
  const { data: products = [], isLoading } = trpc.products.list.useQuery();
  const createProduct = trpc.products.create.useMutation();
  const updateProduct = trpc.products.update.useMutation();
  const deleteProduct = trpc.products.delete.useMutation();
  const utils = trpc.useUtils();

  const emptyForm = { title: "", description: "", price: "", category: "illustration", imageUrl: "", tags: "", featured: 0, inStock: 1, paddlePriceId: "" };
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!form.title || !form.description || !form.price) {
      toast.error("Title, description, and price are required.");
      return;
    }
    setIsSaving(true);
    try {
      const data = {
        ...form,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        inStock: form.inStock,
        featured: form.featured,
      };
      if (editId !== null) {
        await updateProduct.mutateAsync({ id: editId, ...data });
        toast.success("Product updated.");
      } else {
        await createProduct.mutateAsync(data);
        toast.success("Product created.");
      }
      await utils.products.list.invalidate();
      setDialogOpen(false);
      setForm(emptyForm);
      setEditId(null);
    } catch {
      toast.error("Failed to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (p: (typeof products)[0]) => {
    setForm({
      title: p.title,
      description: p.description,
      price: p.price,
      category: p.category ?? "illustration",
      imageUrl: p.imageUrl ?? "",
      tags: Array.isArray(p.tags) ? p.tags.join(", ") : "",
      featured: p.featured,
      inStock: p.inStock,
      paddlePriceId: (p as any).paddlePriceId ?? "",
    });
    setEditId(p.id);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct.mutateAsync({ id });
      await utils.products.list.invalidate();
      toast.success("Product deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
        <Dialog open={dialogOpen} onOpenChange={(v) => { setDialogOpen(v); if (!v) { setForm(emptyForm); setEditId(null); } }}>
          <DialogTrigger asChild>
            <Button className="bg-medical-blue hover:bg-blue-800 text-white gap-2">
              <Plus className="w-4 h-4" /> Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editId !== null ? "Edit Product" : "New Product"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Title *</label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Heart Anatomy Illustration" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Description *</label>
                <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Describe the illustration..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Price (USD) *</label>
                  <Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="9.99" type="number" step="0.01" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Category</label>
                  <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="illustration" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Image URL</label>
                <Input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} placeholder="https://..." />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Tags (comma-separated)</label>
                <Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="anatomy, heart, cardiology" />
              </div>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Paddle Price ID</label>
                <Input value={form.paddlePriceId} onChange={(e) => setForm({ ...form, paddlePriceId: e.target.value })} placeholder="pri_01abc..." />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.featured === 1} onChange={(e) => setForm({ ...form, featured: e.target.checked ? 1 : 0 })} className="rounded" />
                  Featured on homepage
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={form.inStock === 1} onChange={(e) => setForm({ ...form, inStock: e.target.checked ? 1 : 0 })} className="rounded" />
                  In Stock
                </label>
              </div>
              <Button onClick={handleSave} className="w-full bg-medical-blue hover:bg-blue-800 text-white" disabled={isSaving}>
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {editId !== null ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-medical-blue" /></div>
      ) : products.length === 0 ? (
        <Card className="p-12 text-center border border-dashed border-slate-200">
          <ShoppingBag className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No products yet. Add your first illustration!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <Card key={p.id} className="border border-slate-200 bg-white overflow-hidden">
              <div className="aspect-video bg-slate-100 overflow-hidden">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 text-4xl">🎨</div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-slate-900 text-sm">{p.title}</h3>
                  {p.featured === 1 && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Featured</span>}
                </div>
                <p className="text-xs text-slate-500 line-clamp-2 mb-3">{p.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-medical-blue">${p.price}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(p)} className="p-1.5 rounded hover:bg-blue-50 text-slate-400 hover:text-medical-blue transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Orders ────────────────────────────────────────────────────────────────────

function OrdersSection() {
  const { data: orders = [], isLoading } = trpc.orders.list.useQuery();
  const updateStatus = trpc.orders.updateStatus.useMutation();
  const utils = trpc.useUtils();

  const handleStatusChange = async (id: number, status: "pending" | "paid" | "failed" | "refunded") => {
    try {
      await updateStatus.mutateAsync({ id, status });
      await utils.orders.list.invalidate();
      toast.success("Status updated.");
    } catch {
      toast.error("Failed to update status.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Orders</h1>
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-medical-blue" /></div>
      ) : orders.length === 0 ? (
        <Card className="p-12 text-center border border-dashed border-slate-200">
          <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500">No orders yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.slice().reverse().map((order) => (
            <Card key={order.id} className="p-4 border border-slate-200 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-slate-900">{order.customerName}</p>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="text-sm text-slate-500">{order.customerEmail}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatDate(order.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black text-medical-blue">${order.totalAmount}</span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as any)}
                    className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-medical-blue"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Bookings ──────────────────────────────────────────────────────────────────

function BookingsSection() {
  const { data: bookings = [], isLoading } = trpc.bookings.list.useQuery();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Session Bookings</h1>
      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-medical-blue" /></div>
      ) : bookings.length === 0 ? (
        <Card className="p-12 text-center border border-dashed border-slate-200">
          <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500">No session bookings yet.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookings.slice().reverse().map((b) => (
            <Card key={b.id} className="p-4 border border-slate-200 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-slate-900">{b.studentName}</p>
                    <BookingStatusBadge status={b.status} />
                  </div>
                  <p className="text-sm text-slate-500">{b.studentEmail}</p>
                  <p className="text-xs text-slate-400">
                    Package: {b.packageType} · {b.sessionCount} session{b.sessionCount !== 1 ? "s" : ""}
                  </p>
                  <p className="text-xs text-slate-400">{formatDate(b.createdAt)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black text-medical-blue">${b.totalAmount}</span>
                </div>
              </div>
              {b.notes && <p className="text-sm text-slate-600 mt-2 border-t border-slate-50 pt-2">Note: {b.notes}</p>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Messages ──────────────────────────────────────────────────────────────────

function MessagesSection() {
  const { data: contacts = [], isLoading } = trpc.contacts.list.useQuery();
  const markAsRead = trpc.contacts.markAsRead.useMutation();
  const replyMutation = trpc.contacts.reply.useMutation();
  const utils = trpc.useUtils();

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const selected = contacts.find((c) => c.id === selectedId);

  const handleSelect = async (id: number) => {
    setSelectedId(id);
    setReplyText("");
    const contact = contacts.find((c) => c.id === id);
    if (contact && !contact.read) {
      await markAsRead.mutateAsync({ id });
      await utils.contacts.list.invalidate();
    }
  };

  const handleReply = async () => {
    if (!replyText.trim() || !selectedId) return;
    setIsReplying(true);
    try {
      await replyMutation.mutateAsync({ id: selectedId, reply: replyText });
      await utils.contacts.list.invalidate();
      setReplyText("");
      toast.success("Reply sent.");
    } catch {
      toast.error("Failed to send reply.");
    } finally {
      setIsReplying(false);
    }
  };

  const unreadCount = contacts.filter((c) => !c.read).length;

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
        {unreadCount > 0 && (
          <span className="bg-medical-blue text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {unreadCount} unread
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-medical-blue" /></div>
      ) : contacts.length === 0 ? (
        <Card className="p-12 text-center border border-dashed border-slate-200">
          <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-500">No messages yet.</p>
        </Card>
      ) : (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-h-0">
          {/* List */}
          <div className="space-y-2 overflow-auto">
            {contacts.slice().reverse().map((c) => (
              <button
                key={c.id}
                onClick={() => handleSelect(c.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedId === c.id
                    ? "border-medical-blue bg-blue-50"
                    : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-slate-900 text-sm">{c.name}</p>
                      {!c.read && <span className="w-2 h-2 rounded-full bg-medical-blue flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{c.subject || c.email}</p>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{c.message}</p>
                  </div>
                  <p className="text-xs text-slate-400 flex-shrink-0">{formatDate(c.createdAt)}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Detail */}
          <div className="bg-white rounded-xl border border-slate-200 flex flex-col overflow-auto">
            {selected ? (
              <>
                <div className="p-5 border-b border-slate-100">
                  <p className="font-bold text-slate-900">{selected.name}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                    <span>{selected.email}</span>
                    {selected.phone && <span>{selected.phone}</span>}
                  </div>
                  {selected.subject && (
                    <p className="text-sm text-slate-600 mt-1.5 font-medium">{selected.subject}</p>
                  )}
                </div>
                <div className="p-5 flex-1">
                  <p className="text-slate-700 leading-relaxed">{selected.message}</p>
                  {selected.adminReply && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <p className="text-xs font-semibold text-medical-blue mb-1">Your Reply</p>
                      <p className="text-sm text-slate-700">{selected.adminReply}</p>
                      <p className="text-xs text-slate-400 mt-1">{formatDate(selected.repliedAt)}</p>
                    </div>
                  )}
                </div>
                <div className="p-4 border-t border-slate-100">
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    rows={3}
                    className="mb-2"
                    disabled={isReplying}
                  />
                  <Button
                    onClick={handleReply}
                    disabled={!replyText.trim() || isReplying}
                    className="bg-medical-blue hover:bg-blue-800 text-white gap-2 w-full"
                  >
                    {isReplying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Send Reply
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <MessageSquare className="w-10 h-10 mx-auto mb-2 text-slate-200" />
                  <p className="text-sm">Select a message to read</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function OrderStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    paid: { label: "Paid", className: "bg-green-100 text-green-700" },
    pending: { label: "Pending", className: "bg-amber-100 text-amber-700" },
    failed: { label: "Failed", className: "bg-red-100 text-red-600" },
    refunded: { label: "Refunded", className: "bg-slate-100 text-slate-600" },
  };
  const s = map[status] ?? { label: status, className: "bg-slate-100 text-slate-600" };
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${s.className}`}>{s.label}</span>;
}

function BookingStatusBadge({ status }: { status: string }) {
  const map: Record<string, { className: string }> = {
    paid: { className: "bg-green-100 text-green-700" },
    confirmed: { className: "bg-blue-100 text-blue-700" },
    pending: { className: "bg-amber-100 text-amber-700" },
    completed: { className: "bg-slate-100 text-slate-700" },
    cancelled: { className: "bg-red-100 text-red-600" },
  };
  const s = map[status] ?? { className: "bg-slate-100 text-slate-600" };
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${s.className}`}>{status}</span>;
}
