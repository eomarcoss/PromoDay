import { Injectable, BadRequestException } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class StorageService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!,
    );
  }

  async uploadFile(file: Express.Multer.File, bucket: string): Promise<string> {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo foi enviado.');
    }

    // 1. Extrai a extensão do arquivo original (ex: png, jpg) de forma limpa
    const fileExt = file.originalname.split('.').pop()?.toLowerCase() || 'jpg';

    // 2. Geramos um nome puramente numérico e aleatório para evitar qualquer caractere especial ou espaço do arquivo original
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e5)}`;
    const fileName = `${uniqueSuffix}.${fileExt}`;

    // 3. O filePath deve ser APENAS o nome do arquivo, sem barras iniciais
    const filePath = fileName;

    // Faz o upload do buffer para o Supabase Storage
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      // Deixamos o erro mais descritivo para nos ajudar se algo mais falhar
      throw new BadRequestException(
        `Erro ao subir arquivo para o Supabase: ${error.message}`,
      );
    }

    // Captura a URL pública definitiva
    const { data: publicUrlData } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrlData.publicUrl;
  }
}
