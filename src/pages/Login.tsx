import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, Mail, Lock, ArrowRight, User, Briefcase } from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login - replace with actual auth
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Login successful!");
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
                <Home className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">HomeHelp</span>
            </Link>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Welcome back</CardTitle>
              <CardDescription>
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="customer" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="customer" className="gap-2">
                    <User className="h-4 w-4" />
                    Customer
                  </TabsTrigger>
                  <TabsTrigger value="provider" className="gap-2">
                    <Briefcase className="h-4 w-4" />
                    Provider
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="customer" className="mt-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link
                          to="/forgot-password"
                          className="text-xs text-primary hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      variant="hero"
                      className="w-full gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="provider" className="mt-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="provider-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="provider-email"
                          type="email"
                          placeholder="provider@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="provider-password">Password</Label>
                        <Link
                          to="/forgot-password"
                          className="text-xs text-primary hover:underline"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="provider-password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="pl-9"
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="submit"
                      variant="hero"
                      className="w-full gap-2"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In as Provider"}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="font-medium text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
