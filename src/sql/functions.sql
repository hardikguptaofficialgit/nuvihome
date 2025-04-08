

-- Function to submit a report
CREATE OR REPLACE FUNCTION public.submit_report(
  reporter_id UUID,
  content_id_param UUID,
  content_type_param TEXT,
  reason_param TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_id UUID;
BEGIN
  INSERT INTO public.reports (
    reported_by, 
    content_id, 
    content_type, 
    reason, 
    status
  )
  VALUES (
    reporter_id,
    content_id_param,
    content_type_param,
    reason_param,
    'pending'
  )
  RETURNING id INTO result_id;
  
  RETURN json_build_object('id', result_id);
END;
$$;

-- Function to fetch group messages with profiles
CREATE OR REPLACE FUNCTION public.fetch_group_messages(group_id_param UUID)
RETURNS SETOF JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    json_build_object(
      'id', gm.id,
      'group_id', gm.group_id,
      'user_id', gm.user_id,
      'content', gm.content,
      'created_at', gm.created_at,
      'profiles', json_build_object(
        'id', p.id,
        'username', p.username,
        'full_name', p.full_name,
        'avatar_url', p.avatar_url,
        'role', p.role
      )
    )
  FROM 
    public.group_messages gm
  LEFT JOIN
    public.user_profiles p ON gm.user_id = p.id
  WHERE
    gm.group_id = group_id_param
  ORDER BY
    gm.created_at ASC;
END;
$$;

-- Function to insert a group message
CREATE OR REPLACE FUNCTION public.insert_group_message(
  group_id_param UUID,
  content_param TEXT,
  user_id_param UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  message_id UUID;
BEGIN
  INSERT INTO public.group_messages (
    group_id,
    content,
    user_id
  )
  VALUES (
    group_id_param,
    content_param,
    user_id_param
  )
  RETURNING id INTO message_id;
  
  RETURN json_build_object('id', message_id);
END;
$$;

-- Function to get a single message with profile
CREATE OR REPLACE FUNCTION public.get_message_with_profile(message_id_param UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT 
      json_build_object(
        'id', gm.id,
        'group_id', gm.group_id,
        'user_id', gm.user_id,
        'content', gm.content,
        'created_at', gm.created_at,
        'profiles', json_build_object(
          'id', p.id,
          'username', p.username,
          'full_name', p.full_name,
          'avatar_url', p.avatar_url,
          'role', p.role
        )
      )
    FROM 
      public.group_messages gm
    LEFT JOIN
      public.user_profiles p ON gm.user_id = p.id
    WHERE
      gm.id = message_id_param
  );
END;
$$;

-- Create the reports table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reported_by UUID NOT NULL,
  content_id UUID NOT NULL,
  content_type TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_at TIMESTAMPTZ
);

-- Create the group_messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.group_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID NOT NULL REFERENCES public.study_groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;

-- Reports policies
CREATE POLICY "Anyone can create reports" ON public.reports
  FOR INSERT TO authenticated
  WITH CHECK (true);
  
CREATE POLICY "Admins can view all reports" ON public.reports
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));
  
CREATE POLICY "Admins can update reports" ON public.reports
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Group messages policies
CREATE POLICY "Group members can view group messages" ON public.group_messages
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.study_group_members
    WHERE group_id = group_messages.group_id AND user_id = auth.uid()
  ));
  
CREATE POLICY "Group members can insert messages" ON public.group_messages
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.study_group_members
    WHERE group_id = group_messages.group_id AND user_id = auth.uid()
  ));

