import { Injectable, BadRequestException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

@Injectable()
export class StorageService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'SUPABASE_URL ou SUPABASE_KEY não foram configurados no arquivo .env.',
      );
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Upload de um único arquivo para o bucket 'Avatars'
   */
  async uploadFile(file: Express.Multer.File): Promise<string> {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado.');
    }

    const fileExt = file.originalname.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${randomUUID()}.${fileExt}`;

    const { data, error } = await this.supabase.storage
      .from('Avatars')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      throw new BadRequestException(
        `Erro ao subir arquivo para o Supabase: ${error.message}`,
      );
    }

    const { data: publicUrlData } = this.supabase.storage
      .from('Avatars')
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  }

  /**
   * Upload de múltiplos arquivos em paralelo para o bucket 'Avatars'
   */
  async uploadManyFiles(files: Express.Multer.File[]): Promise<string[]> {
    if (!files || files.length === 0) {
      return [];
    }

    const uploadPromises = files.map((file) => this.uploadFile(file));
    return Promise.all(uploadPromises);
  }
}
