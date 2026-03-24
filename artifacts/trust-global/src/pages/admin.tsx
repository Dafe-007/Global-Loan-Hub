import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md mx-4 shadow-sm border border-border">
        <CardContent className="pt-10 pb-10 flex flex-col items-center text-center">

          {/* Big 404 */}
          <h1 className="text-8xl font-extrabold text-primary/20 leading-none select-none">
            404
          </h1>

          {/* Message */}
          <h2 className="mt-4 text-xl font-bold text-gray-900">
            Page Not Found
          </h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-xs">
            The page you're looking for doesn't exist or may have been moved.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full">
            <Button
              asChild
              className="flex-1 bg-primary text-white hover:bg-primary/90"
            >
              <Link href="/">
                <Home className="w-4 h-4 mr-2" /> Go Home
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1"
              onClick={() => window.history.back()}
            >
              <a href="#" onClick={(e) => { e.preventDefault(); window.history.back(); }}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
              </a>
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
