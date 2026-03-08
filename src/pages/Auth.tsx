import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Banner } from "@/components/ui/banner";
import { User } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const isDev = process.env.NODE_ENV === "development" ||
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [navError, setNavError] = useState<string | null>(null);
  const { signIn, signUp, signInWithGoogle, authError, clearAuthError } = useAuth();
  const location = useLocation();

  // Read auth error passed via navigation state (e.g., from AuthCallback)
  useEffect(() => {
    const stateError = (location.state as any)?.authError;
    if (stateError) {
      setNavError(stateError);
      // Clear the navigation state so it doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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
      <div className="w-full max-w-sm space-y-6">
        {/* Sign In Card */}
        <Card>
          <CardContent className="pt-6 pb-5 space-y-4">
            <div className="text-center">
              <img
                src="/lovable-uploads/SS_logo.png"
                alt="Senior Services for South Sound"
                className="mx-auto h-14 w-auto mb-5"
              />
              <h1 className="text-h3 text-foreground">Employee Training Portal</h1>
              <p className="text-body-sm text-muted-foreground mt-1">Sign in to continue</p>
            </div>
            <hr className="border-border-primary" />
            {(navError || authError) && (
              <Banner variant="error" size="compact" description={navError || authError!} dismissible onDismiss={() => { setNavError(null); clearAuthError(); }} />
            )}
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 h-11 px-6 rounded-md border border-input bg-background text-foreground text-body font-medium shadow-sm hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>
            <p className="text-center text-caption text-muted-foreground">
              Only @southsoundseniors.org emails are accepted
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
