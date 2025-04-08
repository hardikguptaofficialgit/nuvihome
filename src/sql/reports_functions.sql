

-- Function to get all reports with profiles
CREATE OR REPLACE FUNCTION public.get_reports()
RETURNS SETOF JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    json_build_object(
      'id', r.id,
      'reported_by', r.reported_by,
      'content_id', r.content_id,
      'content_type', r.content_type,
      'reason', r.reason,
      'status', r.status,
      'created_at', r.created_at,
      'resolved_at', r.resolved_at,
      'reporter', json_build_object(
        'id', p.id,
        'username', p.username,
        'full_name', p.full_name,
        'avatar_url', p.avatar_url,
        'role', p.role
      )
    )
  FROM 
    public.reports r
  LEFT JOIN
    public.user_profiles p ON r.reported_by = p.id
  ORDER BY
    r.created_at DESC;
END;
$$;

-- Function to process a report
CREATE OR REPLACE FUNCTION public.process_report(
  report_id UUID,
  action_type TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  report_record RECORD;
BEGIN
  -- Get the report details
  SELECT * INTO report_record
  FROM public.reports
  WHERE id = report_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Report not found';
  END IF;
  
  -- Update report status
  UPDATE public.reports
  SET 
    status = CASE WHEN action_type = 'approve' THEN 'approved' ELSE 'rejected' END,
    resolved_at = NOW()
  WHERE id = report_id;
  
  -- If approved, take action on the reported content
  IF action_type = 'approve' THEN
    IF report_record.content_type = 'thread' THEN
      DELETE FROM public.discussion_threads
      WHERE id = report_record.content_id;
    ELSIF report_record.content_type = 'reply' THEN
      DELETE FROM public.thread_replies
      WHERE id = report_record.content_id;
    END IF;
  END IF;
  
  RETURN TRUE;
END;
$$;

-- Update the tags column in the discussion_threads table
ALTER TABLE public.discussion_threads 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

