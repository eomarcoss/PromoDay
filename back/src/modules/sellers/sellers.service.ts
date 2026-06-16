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

@Injectable()
export class SellersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSellerDto: CreateSellerDto) {
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

      // 2. Criptografa a senha do parceiro
      const hashedPassword = await bcrypt.hash(password, 10);

      // 3. Salva no banco de dados
      const newSeller = await this.prisma.seller.create({
        data: {
          ...createSellerDto,
          password: hashedPassword,
        },
      });

      // 4. Remove a senha do retorno por segurança
      const { password: _, ...result } = newSeller;
      return result;
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
    });
  }

  findAll() {
    return `This action returns all sellers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} seller`;
  }

  async update(id: string, updateSellerDto: UpdateSellerDto) {
    try {
      // 1. Verifica se o vendedor realmente existe no banco
      const seller = await this.prisma.seller.findUnique({ where: { id } });
      if (!seller) {
        throw new NotFoundException('Vendedor não encontrado.');
      }

      // 2. Atualiza apenas os campos enviados pelo front
      const updatedSeller = await this.prisma.seller.update({
        where: { id },
        data: {
          ...updateSellerDto,
        },
      });

      // 3. Remove a senha do retorno por segurança
      const { password: _, ...result } = updatedSeller;
      return result;
    } catch (error) {
      console.error('🚨 ERRO REAL DO PRISMA:', error);
      if (error instanceof NotFoundException) throw error;
      throw new HttpException(
        'Erro ao atualizar os dados do vendedor.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
