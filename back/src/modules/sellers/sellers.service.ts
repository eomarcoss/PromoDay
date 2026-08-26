import {
  Injectable,
  ConflictException,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { StorageService } from 'src/shared/storage.service';

@Injectable()
export class SellersService {
  constructor(
    private readonly prisma: PrismaService,
    private StorageService: StorageService,
  ) {}

  async create(createSellerDto: CreateSellerDto, file: Express.Multer.File) {
    const { email, password } = createSellerDto;

    try {
      // 1. Verifica se já existe um vendedor com esse e-mail
      const sellerExists = await this.prisma.seller.findUnique({
        where: { email },
      });
      if (sellerExists) {
        throw new ConflictException(
          'Este e-mail já está cadastrado para um vendedor.',
        );
      }

      let avatarUrl: string | null = null;
      if (file) {
        avatarUrl = await this.StorageService.uploadFile(file);
      }

      // 2. Criptografa a senha do parceiro
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3. Salva no banco de dados
      const sellerData = await this.prisma.seller.create({
        data: {
          ...createSellerDto,
          avatarUrl,
          password: hashedPassword,
        },
      });

      // 4. Remove a senha do retorno por segurança
      const { password: _, ...sellerWithPassword } = sellerData;
      return sellerWithPassword;
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      throw new HttpException(
        'Erro ao criar o cadastro do vendedor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByEmail(email: string) {
    return this.prisma.seller.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        address: true,
        avatarUrl: true,
        businessHours: true,
        promotions: true,
        phone: true,
        category: true,
        totalPromotions: true,
        totalSales: true,
      },
    });
  }

  async findAll() {
    return this.prisma.seller.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        avatarUrl: true,
        phone: true,
        category: true,
        // Traz a contagem de promoções ativas para cada loja
        _count: {
          select: {
            promotions: {
              where: {
                isActive: true,
              },
            },
          },
        },
      },
    });
  }

  async getProfile(id: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatarUrl: true,
        address: true,
        businessHours: true,
        category: true,
      },
    });

    if (!seller) {
      throw new NotFoundException('Vendedor não encontrado.');
    }

    return seller;
  }

  async findOne(id: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        address: true,
        avatarUrl: true,
        businessHours: true,
        phone: true,
        category: true,
        totalPromotions: true,
        totalSales: true,
        promotions: {
          where: {
            isActive: true,
          },
          include: {
            seller: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    if (!seller) {
      throw new NotFoundException('Vendedor não encontrado.');
    }

    return seller;
  }

  async updateProfile(
    sellerId: string,
    dto: UpdateSellerDto,
    file?: Express.Multer.File,
  ) {
    // 1. Verifica se o vendedor existe
    const sellerExists = await this.prisma.seller.findUnique({
      where: { id: sellerId },
    });

    if (!sellerExists) {
      throw new NotFoundException('Vendedor não encontrado.');
    }

    // 2. Mantém a imagem antiga por padrão
    let avatarUrl = sellerExists.avatarUrl;

    // 3. Se um novo arquivo foi enviado, realiza o upload para o Supabase
    if (file) {
      avatarUrl = await this.StorageService.uploadFile(file);
    }

    // 4. Atualiza os dados no banco
    const updatedSeller = await this.prisma.seller.update({
      where: { id: sellerId },
      data: {
        ...dto,
        avatarUrl, // Atualiza a URL apenas se um novo arquivo foi enviado
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        avatarUrl: true,
        address: true,
        businessHours: true,
        category: true,
      },
    });

    return updatedSeller;
  }
  async getMetrics(id: string) {
    const seller = await this.prisma.seller.findUnique({
      where: { id: id },
      select: {
        totalPromotions: true,
        totalSales: true,
      },
    });

    if (!seller) {
      throw new NotFoundException('Vendedor não encontrado');
    }

    return {
      totalPromotions: seller.totalPromotions ?? 0,
      totalSales: seller.totalSales ?? 0,
    };
  }

  async remove(id: string) {
    try {
      // 1. Verifica se o vendedor realmente existe antes de tentar deletar
      const seller = await this.prisma.seller.findUnique({ where: { id } });
      if (!seller) {
        throw new NotFoundException('Vendedor não encontrado.');
      }

      // 2. Deleta o registro do banco
      await this.prisma.seller.delete({
        where: { id },
      });

      // 3. Retorna uma mensagem de sucesso clara
      return {
        message:
          'A conta do vendedor e todos os seus anúncios foram removidos com sucesso.',
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        'Erro ao tentar remover a conta do vendedor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
