'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, CheckCircle2, Clock, Users } from 'lucide-react';

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

interface MeetingMetadata {
  project_name: string;
  date: string;
  attendees: string[];
}

interface ProjectHealth {
  status: 'On Track' | 'At Risk' | 'Blocked';
  summary: string;
}

interface AnalysisResult {
  meeting_metadata: MeetingMetadata;
  action_items: ActionItem[];
  decisions: Decision[];
  risks: Risk[];
  key_topics: string[];
  project_health: ProjectHealth;
}

const SAMPLE_TRANSCRIPT = `Weekly Project Status - Enterprise Conference Room Buildout
Date: November 12, 2024
Attendees: Sarah (PM), Mark (Client), James (AV Tech)

Sarah: "Quick update - we're on track for the November 30th install date. Equipment arrived yesterday except for the Crestron processor."

Mark: "Wait, what? I thought everything was here. When's the processor coming?"

Sarah: "Supplier says December 5th now. Supply chain issue. We can work around it temporarily but means we won't have full automation until early December."

Mark: "That's a problem. We have the board meeting December 3rd and promised them the new system would be live."

James: "I can probably rig a basic control system as a stopgap, but it won't be pretty."

Sarah: "Let me escalate with the supplier and see if we can expedite. I'll also loop in our account manager to discuss options. Mark, can you give me 48 hours before we decide on the workaround?"

Mark: "Fine. But I need a concrete plan by Friday."

Sarah: "Noted. James, can you map out what the temporary setup would look like - just in case?"

James: "Yeah, I'll have something by Thursday."`;

export default function MeetingAnalyzerPage() {
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!transcript.trim()) {
      setError('Please enter a meeting transcript');
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const response = await fetch('/api/analyze-meeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze meeting');
      }

      const result = await response.json();
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const loadSampleTranscript = () => {
    setTranscript(SAMPLE_TRANSCRIPT);
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

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Meeting Intelligence</h1>
        <p className="text-muted-foreground">
          Paste a meeting transcript to automatically extract action items, risks, and decisions
        </p>
      </div>

      <div className="grid gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle>Meeting Transcript</CardTitle>
            <CardDescription>
              Paste your meeting transcript or notes below
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste meeting transcript here..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
            <div className="flex gap-2">
              <Button
                onClick={handleAnalyze}
                disabled={loading || !transcript.trim()}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Meeting'
                )}
              </Button>
              <Button variant="outline" onClick={loadSampleTranscript}>
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

        {/* Results Section */}
        {analysis && (
          <>
            {/* Project Health Alert */}
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

            {/* Meeting Metadata */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Meeting Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <span className="font-semibold">Project: </span>
                    {analysis.meeting_metadata.project_name}
                  </div>
                  <div>
                    <span className="font-semibold">Date: </span>
                    {analysis.meeting_metadata.date}
                  </div>
                  {analysis.meeting_metadata.attendees.length > 0 && (
                    <div>
                      <span className="font-semibold">Attendees: </span>
                      {analysis.meeting_metadata.attendees.join(', ')}
                    </div>
                  )}
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

            <div className="grid md:grid-cols-3 gap-6">
              {/* Action Items */}
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

              {/* Risks */}
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

              {/* Decisions */}
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
  );
}
