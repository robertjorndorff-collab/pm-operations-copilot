'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, Mail, ChevronRight, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  if (isAuthenticated) {
    router.push('/meeting-analyzer');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    
    if (success) {
      router.push('/meeting-analyzer');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="shadow-2xl">
          <CardHeader className="text-center pt-4 pb-3">
            <div className="flex justify-center mb-2">
              <Image
                src="/avispl-logo.png"
                alt="AVI-SPL"
                width={200}
                height={55}
                priority
              />
            </div>
            <CardTitle className="text-3xl font-bold mb-1">
              PM Operations Copilot
            </CardTitle>
            <CardDescription className="text-lg">
              AI-powered intelligence for project management teams
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex gap-4 p-4 bg-blue-50 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Meeting Intelligence</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically extract action items, risks, and decisions from meeting transcripts
                  </p>
                </div>
              </div>
              <div className="flex gap-4 p-4 bg-green-50 rounded-lg">
                <Mail className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Email Intelligence</h3>
                  <p className="text-sm text-muted-foreground">
                    Parse project status emails to identify blockers, updates, and priorities
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">How to Use This Demo</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium">Enter the password below to access the demo</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium">Click "Load Sample" to see a realistic project scenario</p>
                    <p className="text-sm text-muted-foreground">Or paste your own meeting transcripts or emails</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium">Click "Analyze" to extract insights automatically</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <p className="font-medium">Review action items, risks, and project health</p>
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Demo Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter password"
                    className="pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" size="lg">
                Access Demo
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Demo built for AVI-SPL by R.J. Orndorff LLC
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
