import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Stethoscope, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-medical-gradient-soft flex flex-col items-center justify-center gap-6 p-8 text-center">
      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
        <Stethoscope className="w-8 h-8 text-medical-blue" />
      </div>
      <div>
        <h1 className="text-6xl font-black text-medical-blue mb-2">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Page Not Found</h2>
        <p className="text-slate-500 max-w-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <Link href="/">
        <Button className="bg-medical-blue hover:bg-blue-800 text-white gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Button>
      </Link>
    </div>
  );
}
