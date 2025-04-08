
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Flag, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Report } from '@/services/communityService';
import { toast } from 'sonner';

interface AdminModToolsProps {
  isAdmin: boolean;
}

const AdminModTools: React.FC<AdminModToolsProps> = ({ isAdmin }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  
  useEffect(() => {
    if (isAdmin) {
      fetchReports();
    }
  }, [isAdmin]);
  
  const fetchReports = async () => {
    setLoading(true);
    try {
      // Use RPC function to get all reports with associated profiles
      const { data, error } = await supabase.rpc('get_reports');
        
      if (error) throw error;
      
      setReports(data as unknown as Report[]);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };
  
  const handleReportAction = async (reportId: string, action: 'approve' | 'reject') => {
    setProcessingId(reportId);
    try {
      // Use RPC function to process the report
      const { data, error } = await supabase.rpc('process_report', {
        report_id: reportId,
        action_type: action
      });
      
      if (error) throw error;
      
      toast.success(`Report ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      fetchReports();
    } catch (error) {
      console.error(`Error ${action}ing report:`, error);
      toast.error(`Failed to ${action} report`);
    } finally {
      setProcessingId(null);
    }
  };
  
  if (!isAdmin) return null;
  
  return (
    <Card className="mt-12 glass-card animate-fade-in">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Flag className="h-5 w-5 text-red-500" />
          <CardTitle className="text-xl font-bold">Admin Moderation Tools</CardTitle>
        </div>
        <CardDescription>
          Review and take action on user reports and content issues.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="reports">
          <TabsList className="mb-4">
            <TabsTrigger value="reports">Content Reports</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="stats">Community Stats</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reports">
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : reports.length > 0 ? (
              <div className="space-y-4">
                {reports.map(report => (
                  <div key={report.id} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/30">
                            {report.content_type === 'thread' ? 'Thread' : 'Reply'}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(report.created_at).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm font-medium">Reason: {report.reason}</p>
                        <div className="flex items-center gap-2 mt-4">
                          <div className="text-sm">Reported by:</div>
                          <div className="flex items-center gap-1">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={report.reporter?.avatar_url || undefined} />
                              <AvatarFallback className="text-[10px]">
                                {report.reporter?.full_name?.[0] || report.reporter?.username?.[0] || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">
                              {report.reporter?.full_name || report.reporter?.username || 'Unknown'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleReportAction(report.id, 'reject')}
                          disabled={!!processingId}
                          className="h-8 text-red-500 border-red-500/20 hover:bg-red-500/10"
                        >
                          {processingId === report.id ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          Reject
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => handleReportAction(report.id, 'approve')}
                          disabled={!!processingId}
                          className="h-8 bg-green-600 hover:bg-green-700"
                        >
                          {processingId === report.id ? (
                            <Loader2 className="h-3 w-3 animate-spin mr-1" />
                          ) : (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          )}
                          Approve
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                No pending reports to review.
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="users">
            <div className="text-center py-12 text-muted-foreground">
              User management tools will be implemented soon.
            </div>
          </TabsContent>
          
          <TabsContent value="stats">
            <div className="text-center py-12 text-muted-foreground">
              Community statistics will be available soon.
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button variant="outline" className="w-full" onClick={fetchReports} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            'Refresh Data'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminModTools;
