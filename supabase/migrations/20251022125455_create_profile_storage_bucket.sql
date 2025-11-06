/*
  # Create Storage Bucket for Profile Photos

  1. Storage
    - Create `profiles` bucket for avatar uploads
    - Enable public access for avatars
    - Set size limit to 5MB
    - Allow image types only

  2. Security
    - RLS policies for authenticated users to upload their own avatars
    - Public read access for all avatars
    - Users can only delete their own avatars
*/

-- Create storage bucket for profile photos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'profiles',
  'profiles',
  true,
  5242880, -- 5MB in bytes
  array['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
)
on conflict (id) do nothing;

-- Policy: Allow authenticated users to upload their own avatars
create policy "Users can upload their own avatar"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'profiles' and
  (storage.foldername(name))[1] = 'avatars' and
  auth.uid()::text = (regexp_match(name, 'avatars/([^-]+)-'))[1]
);

-- Policy: Allow authenticated users to update their own avatars
create policy "Users can update their own avatar"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'profiles' and
  (storage.foldername(name))[1] = 'avatars' and
  auth.uid()::text = (regexp_match(name, 'avatars/([^-]+)-'))[1]
);

-- Policy: Allow authenticated users to delete their own avatars
create policy "Users can delete their own avatar"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'profiles' and
  (storage.foldername(name))[1] = 'avatars' and
  auth.uid()::text = (regexp_match(name, 'avatars/([^-]+)-'))[1]
);

-- Policy: Allow public read access to all avatars
create policy "Public can view all avatars"
on storage.objects
for select
to public
using (bucket_id = 'profiles' and (storage.foldername(name))[1] = 'avatars');
