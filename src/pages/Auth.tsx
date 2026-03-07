import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const isDev = process.env.NODE_ENV === "development" ||
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await signInWithGoogle();
    setIsLoading(false);
  };

  // Dev-only test login handlers
  const handleTestLogin = async (testEmail: string, testPassword: string, testName: string) => {
    setIsLoading(true);
    const result = await signIn(testEmail, testPassword);
    if (!result || result.error) {
      await signUp(testEmail, testPassword, testName);
      await signIn(testEmail, testPassword);
    }
    setIsLoading(false);
  };

  const handleDevEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    const name = fullName.trim() || email.split("@")[0];
    const pwd = password || "test123";
    const result = await signIn(email, pwd);
    if (!result || result.error) {
      await signUp(email, pwd, name);
      await signIn(email, pwd);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background-header flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Sign In Card */}
        <Card>
          <CardContent className="pt-8 pb-6 space-y-5">
            <div className="text-center">
              <img
                src="/lovable-uploads/SS_logo.png"
                alt="Senior Services for South Sound"
                className="mx-auto h-16 w-auto mb-6"
              />
              <h1 className="text-h2 text-foreground">Training Portal</h1>
            </div>
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              size="lg"
              className="w-full button-social"
            >
              <LogIn className="w-5 h-5 mr-3" />
              Sign in with Google
            </Button>
            <p className="text-center text-body-sm text-muted-foreground whitespace-nowrap">
              Only @southsoundseniors.org email addresses are accepted
            </p>
          </CardContent>
        </Card>

        {/* Dev Testing Section - only visible in development */}
        {isDev && (
          <Card className="border-dashed border-warning/40">
            <CardContent className="pt-4 space-y-3">
              <p className="text-center text-body-sm font-semibold text-warning">
                Development Testing
              </p>

              {/* Quick login buttons */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  onClick={() => handleTestLogin("jane.doe@southsoundseniors.org", "test123", "Jane Doe")}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                  className="button-outline-primary"
                >
                  <User className="w-4 h-4 mr-1" />
                  Jane
                </Button>
                <Button
                  onClick={() => handleTestLogin("john.doe@southsoundseniors.org", "test123", "John Doe")}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                  className="button-outline-success"
                >
                  <User className="w-4 h-4 mr-1" />
                  John
                </Button>
                <Button
                  onClick={() => handleTestLogin("admin@southsoundseniors.org", "admin123", "Test Admin")}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                  className="button-outline-destructive"
                >
                  <User className="w-4 h-4 mr-1" />
                  Admin
                </Button>
              </div>

              {/* Custom email login */}
              <form onSubmit={handleDevEmailLogin} className="space-y-2 pt-2 border-t border-border">
                <div className="space-y-1.5">
                  <Label htmlFor="dev-name" className="text-body-sm">Name</Label>
                  <Input
                    id="dev-name"
                    type="text"
                    placeholder="Test User"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dev-email" className="text-body-sm">Email</Label>
                  <Input
                    id="dev-email"
                    type="email"
                    placeholder="any@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-9 text-sm"
                  />
                </div>
                <Button type="submit" variant="outline" size="sm" className="w-full" disabled={isLoading}>
                  Dev Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
