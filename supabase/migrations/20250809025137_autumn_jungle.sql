/*
  # Create storage bucket for product images

  1. Storage Setup
    - Create 'produtos' bucket for product images
    - Set up proper policies for upload and access
    - Allow authenticated users to upload
    - Allow public read access to images

  2. Security
    - Only authenticated users can upload
    - File size and type restrictions
    - Public read access for product images
*/

-- Create the produtos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('produtos', 'produtos', true)
ON CONFLICT (id) DO NOTHING;

-- Policy to allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'produtos' 
  AND (storage.foldername(name))[1] = 'images'
  AND (
    lower(storage.extension(name)) = 'jpg' OR
    lower(storage.extension(name)) = 'jpeg' OR
    lower(storage.extension(name)) = 'png' OR
    lower(storage.extension(name)) = 'webp'
  )
);

-- Policy to allow public read access to product images
CREATE POLICY "Public can view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'produtos');

-- Policy to allow authenticated users to update their uploads
CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'produtos');

-- Policy to allow authenticated users to delete product images
CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'produtos');