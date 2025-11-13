'use client';

import { ProtectedRoute } from '@/components/protected-route';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, CheckCircle2, Clock, Mail as MailIcon } from 'lucide-react';
import GlobalNav from '@/components/global-nav';

interface ActionItem {
  task: string;
  assignee: string;
  due_date: string;
  priority: 'High' | 'Medium' | 'Low';
}

interface Decision {
  decision: string;
  context: string;
}

interface Risk {
  risk: string;
  severity: 'High' | 'Medium' | 'Low';
  impact: string;
  mentioned_by: string;
}

interface EmailMetadata {
  subject: string;
  from: string;
  date: string;
  project_name: string;
}

interface StatusUpdate {
  area: string;
  status: string;
  type: string;
}

interface ProjectHealth {
  status: 'On Track' | 'At Risk' | 'Blocked';
  summary: string;
}

interface AnalysisResult {
  email_metadata: EmailMetadata;
  action_items: ActionItem[];
  decisions: Decision[];
  risks: Risk[];
  key_topics: string[];
  status_updates: StatusUpdate[];
  project_health: ProjectHealth;
}

const SAMPLE_EMAIL = `Subject: RE: Conference Room Install - Equipment Delay Update
From: Sarah Martinez (Project Manager)
Date: November 12, 2024
To: Mark Davidson (Client), Team

Hi Mark,

Quick update on the Enterprise Conference Room project.

Good news: Most equipment arrived yesterday and is staged for the November 30th installation. The team has completed the pre-wire and mounting brackets are in place.

However, we've hit a snag with the Crestron processor. Our supplier just notified me that it's delayed until December 5th due to a supply chain issue at the manufacturer. This affects our ability to deliver full system automation by your December 3rd board meeting.

OPTIONS:
1. We can rig a temporary basic control system (James estimates 1 day of work)
2. Wait for the Crestron and reschedule the board meeting demo
3. Expedite shipping (checking if possible, may incur additional cost)

I'm escalating this with our account manager and the supplier today to see if we can expedite. I'll have a concrete recommendation and cost estimate for you by Friday EOD.

Please let me know if you have a strong preference on approach, otherwise I'll move forward with Option 1 as backup while we pursue expediting.

Thanks,
Sarah

--
Sarah Martinez
Senior Project Manager
AVI-SPL
sarah.martinez@avispl.com`;

function EmailAnalyzerContent() {
  const [emailText, setEmailText] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!emailText.trim()) {
      setError('Please enter an email to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch('/api/analyze-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailText }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze email');
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleEmail = () => {
    setEmailText(SAMPLE_EMAIL);
    setAnalysis(null);
    setError(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'At Risk':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Blocked':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUpdateTypeColor = (type: string) => {
    switch (type) {
      case 'Blocker':
      case 'Delay':
        return 'bg-red-100 text-red-800';
      case 'Progress':
        return 'bg-green-100 text-green-800';
      case 'Resource Issue':
      case 'Budget':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <>
      <GlobalNav />
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Email Intelligence</h1>
          <p className="text-muted-foreground">
            Paste project-related emails to automatically extract status updates, action items, and risks
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Email Content</CardTitle>
              <CardDescription>
                Paste the email content or forward project status emails
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste email content here..."
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                rows={12}
                className="font-mono text-sm"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleAnalyze}
                  disabled={loading || !emailText.trim()}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <MailIcon className="mr-2 h-4 w-4" />
                      Analyze Email
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={loadSampleEmail}>
                  Load Sample
                </Button>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {analysis && (
            <>
              <Alert className={getStatusColor(analysis.project_health.status)}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-semibold">
                      {analysis.project_health.status}
                    </Badge>
                    <span>{analysis.project_health.summary}</span>
                  </div>
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MailIcon className="h-5 w-5" />
                    Email Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {analysis.email_metadata.subject !== 'Not specified' && (
                      <div>
                        <span className="font-semibold">Subject: </span>
                        {analysis.email_metadata.subject}
                      </div>
                    )}
                    {analysis.email_metadata.from !== 'Not specified' && (
                      <div>
                        <span className="font-semibold">From: </span>
                        {analysis.email_metadata.from}
                      </div>
                    )}
                    <div>
                      <span className="font-semibold">Project: </span>
                      {analysis.email_metadata.project_name}
                    </div>
                    <div>
                      <span className="font-semibold">Date: </span>
                      {analysis.email_metadata.date}
                    </div>
                    {analysis.key_topics.length > 0 && (
                      <div>
                        <span className="font-semibold">Key Topics: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {analysis.key_topics.map((topic, idx) => (
                            <Badge key={idx} variant="secondary">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {analysis.status_updates && analysis.status_updates.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Status Updates</CardTitle>
                    <CardDescription>
                      {analysis.status_updates.length} update(s) identified
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analysis.status_updates.map((update, idx) => (
                        <div key={idx} className="border-l-2 border-blue-500 pl-3 space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium">{update.area}</p>
                            <Badge variant="outline" className={getUpdateTypeColor(update.type)}>
                              {update.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{update.status}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Action Items
                    </CardTitle>
                    <CardDescription>
                      {analysis.action_items.length} task(s) identified
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysis.action_items.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No action items identified</p>
                      ) : (
                        analysis.action_items.map((item, idx) => (
                          <div key={idx} className="border-l-2 border-blue-500 pl-3 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-medium">{item.task}</p>
                              <Badge variant="outline" className={getSeverityColor(item.priority)}>
                                {item.priority}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              <span className="font-semibold">Assignee:</span> {item.assignee}
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {item.due_date}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Risk Signals
                    </CardTitle>
                    <CardDescription>
                      {analysis.risks.length} risk(s) identified
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysis.risks.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No risks identified</p>
                      ) : (
                        analysis.risks.map((risk, idx) => (
                          <div key={idx} className="border-l-2 border-red-500 pl-3 space-y-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-sm font-medium">{risk.risk}</p>
                              <Badge variant="outline" className={getSeverityColor(risk.severity)}>
                                {risk.severity}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              <span className="font-semibold">Impact:</span> {risk.impact}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              <span className="font-semibold">Raised by:</span> {risk.mentioned_by}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Decisions Made
                    </CardTitle>
                    <CardDescription>
                      {analysis.decisions.length} decision(s) recorded
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {analysis.decisions.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No decisions recorded</p>
                      ) : (
                        analysis.decisions.map((decision, idx) => (
                          <div key={idx} className="border-l-2 border-green-500 pl-3 space-y-1">
                            <p className="text-sm font-medium">{decision.decision}</p>
                            <p className="text-xs text-muted-foreground">{decision.context}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default function EmailAnalyzerPage() {
  return (
    <ProtectedRoute>
      <EmailAnalyzerContent />
    </ProtectedRoute>
  );
}
