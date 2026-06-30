import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Circle, Trash2, Plus, Loader2, Eye, EyeOff, Bell, BellOff } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function Todo() {
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
  const [newTodo, setNewTodo] = useState("");
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>("default");

  const todosQuery = trpc.todos.list.useQuery(undefined, {
    enabled: adminCheckQuery.data?.isAdmin === true,
    refetchInterval: 15000,
  });
  const createTodo = trpc.todos.create.useMutation({
    onSuccess: () => utils.todos.list.invalidate(),
  });
  const markDone = trpc.todos.markDone.useMutation({
    onSuccess: () => utils.todos.list.invalidate(),
  });
  const deleteTodo = trpc.todos.delete.useMutation({
    onSuccess: () => utils.todos.list.invalidate(),
  });

  useEffect(() => {
    if ("Notification" in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  const requestNotifPermission = async () => {
    if (!("Notification" in window)) {
      toast.error("Your browser does not support notifications");
      return;
    }
    const perm = await Notification.requestPermission();
    setNotifPermission(perm);
    if (perm === "granted") toast.success("Notifications enabled! You will be notified when tasks are done.");
    else toast.error("Notification permission denied");
  };

  const sendNotification = (taskTitle: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("✅ Task Done!", {
        body: taskTitle,
        icon: "/dr_profile.jpg",
      });
    }
  };

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

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    await createTodo.mutateAsync({ title: newTodo.trim() });
    setNewTodo("");
    toast.success("Task added!");
  };

  const handleMarkDone = async (id: number, title: string) => {
    await markDone.mutateAsync({ id });
    sendNotification(title);
    toast.success(`✅ "${title}" marked as done!`);
  };

  const handleDelete = async (id: number) => {
    await deleteTodo.mutateAsync({ id });
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
      <div className="min-h-screen flex items-center justify-center bg-medical-gradient-soft p-4">
        <Card className="w-full max-w-sm p-8 shadow-xl border border-slate-200">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
            <p className="text-sm text-slate-500 mt-1">My Tasks · Dr. Abdellrahman</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@drasd.xyz"
                disabled={isLoggingIn}
                autoComplete="email"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 mb-1.5 block">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isLoggingIn}
                  className="pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {loginError && <p className="text-sm text-red-600">{loginError}</p>}
            <Button
              type="submit"
              className="w-full bg-medical-blue hover:bg-blue-800 text-white"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  const allTodos = todosQuery.data ?? [];
  const pending = allTodos.filter((t) => !t.done);
  const done = allTodos.filter((t) => t.done);

  return (
    <div className="min-h-screen bg-medical-gradient-soft">
      <div className="container max-w-2xl py-10 px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Tasks</h1>
            <p className="text-sm text-slate-500">
              {pending.length} pending · {done.length} done
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={requestNotifPermission}
              title={
                notifPermission === "granted"
                  ? "Notifications enabled"
                  : "Enable phone notifications"
              }
            >
              {notifPermission === "granted" ? (
                <Bell className="w-4 h-4 text-green-600" />
              ) : (
                <BellOff className="w-4 h-4 text-slate-400" />
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                adminLogout.mutateAsync().then(() => utils.auth.adminCheck.invalidate())
              }
            >
              Log out
            </Button>
          </div>
        </div>

        {/* Add task */}
        <Card className="p-4 mb-6 border border-slate-200 shadow-sm">
          <form onSubmit={handleAddTodo} className="flex gap-2">
            <Input
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1"
              disabled={createTodo.isPending}
            />
            <Button
              type="submit"
              className="bg-medical-blue hover:bg-blue-800 text-white"
              disabled={createTodo.isPending || !newTodo.trim()}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </form>
        </Card>

        {/* Pending tasks */}
        {todosQuery.isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-medical-blue" />
          </div>
        ) : (
          <div className="space-y-2 mb-8">
            {pending.length === 0 && (
              <p className="text-center text-slate-400 py-10">
                No pending tasks. Add one above!
              </p>
            )}
            {pending.map((todo) => (
              <Card
                key={todo.id}
                className="p-4 border border-slate-200 shadow-sm flex items-center gap-3 group"
              >
                <button
                  onClick={() => handleMarkDone(todo.id, todo.title)}
                  disabled={markDone.isPending}
                  className="text-slate-300 hover:text-medical-green transition-colors flex-shrink-0"
                  title="Mark as done"
                >
                  <Circle className="w-5 h-5" />
                </button>
                <span className="flex-1 text-slate-800">{todo.title}</span>
                <button
                  onClick={() => handleDelete(todo.id)}
                  disabled={deleteTodo.isPending}
                  className="text-slate-200 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </Card>
            ))}
          </div>
        )}

        {/* Done tasks */}
        {done.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
              Completed
            </h2>
            <div className="space-y-2">
              {done.map((todo) => (
                <Card
                  key={todo.id}
                  className="p-4 border border-slate-100 flex items-center gap-3 opacity-60"
                >
                  <CheckCircle2 className="w-5 h-5 text-medical-green flex-shrink-0" />
                  <span className="flex-1 text-slate-500 line-through">{todo.title}</span>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    disabled={deleteTodo.isPending}
                    className="text-slate-200 hover:text-red-500 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
