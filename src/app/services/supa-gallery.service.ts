// src/app/core/supa-gallery.service.ts
import { Injectable } from '@angular/core';
import { supabase } from '../supabase.client';

export interface SupaImage {
  name: string; // object name in bucket, e.g. "1725096500000_cat.jpg"
  url: string;  // public URL for <img src>
}

@Injectable({ providedIn: 'root' })
export class SupaGalleryService {
  private bucket = 'gallery';

  /** List images in the bucket root. Adjust `path` if you use subfolders. */
  async list(path = ''): Promise<SupaImage[]> {
    const { data, error } = await supabase
      .storage
      .from(this.bucket)
      .list(path, { limit: 1000, sortBy: { column: 'created_at', order: 'desc' } });

    if (error) throw error;

    // Map to public URLs
    return (data ?? [])
    .filter(obj => (obj.metadata?.['mimetype'] as string | undefined)?.startsWith('image/') ?? true)
    .map(obj => {
        const { data: pub } = supabase.storage.from(this.bucket).getPublicUrl((path ? path + '/' : '') + obj.name);
        return { name: obj.name, url: pub.publicUrl };
      });
  }

  /** Upload a single file to the bucket root. */
  async upload(file: File, path = ''): Promise<SupaImage> {
    const cleanName = file.name.replace(/\s+/g, '_');
    const objectName = `${Date.now()}_${cleanName}`;
    const fullPath = (path ? path + '/' : '') + objectName;
  
    const { error } = await supabase
      .storage
      .from(this.bucket)
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'application/octet-stream'
      });
    if (error) throw error;
  
    const { data: { publicUrl } } = supabase.storage.from(this.bucket).getPublicUrl(fullPath);
    return { name: objectName, url: publicUrl }; // ✅ return full item
  }

  /** Delete a single object by name from the bucket root. */
  async remove(name: string, path = ''): Promise<void> {
    const fullPath = (path ? path + '/' : '') + name;
    const { error } = await supabase.storage.from(this.bucket).remove([fullPath]);
    if (error) throw error;
  }
}
