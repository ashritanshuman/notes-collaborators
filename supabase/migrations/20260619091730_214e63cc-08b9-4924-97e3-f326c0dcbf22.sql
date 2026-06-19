
CREATE POLICY "Public can read notes files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'notes');

CREATE POLICY "Authenticated can upload to own folder"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'notes'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own note files"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'notes'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own note files"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'notes'
    AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(), 'admin'))
  );
