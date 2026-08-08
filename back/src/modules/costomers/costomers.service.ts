import {
  ConflictException,
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateCostomerDto } from './dto/create-costomer.dto';
import { UpdateCostomerDto } from './dto/update-costomer.dto';
import { PrismaService } from 'prisma/prisma.service';
import { StorageService } from 'src/shared/storage.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CostomersService {
  constructor(
    private readonly prisma: PrismaService,
    private StorageService: StorageService,
  ) {}

  async create(
    createCustomerDto: CreateCostomerDto,
    file: Express.Multer.File,
  ) {
    const { name, email, phone, password } = createCustomerDto;

    // 2. Regra de Negócio: Verificar se o e-mail já está cadastrado
    const emailExists = await this.prisma.customer.findUnique({
      where: { email },
    });

    if (emailExists) {
      // O NestJS já tem exceções HTTP prontas. Essa joga um erro 409 (Conflict) na tela
      throw new ConflictException(
        'Este e-mail já está cadastrado no PromoDay.',
      );
    }

    let avatarUrl: string | null = null;
    if (file) {
      avatarUrl = await this.StorageService.uploadFile(file);
    }

    // 3. Segurança: Criptografar a senha do usuário
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Persistência: Gravar no PostgreSQL usando o Prisma v7
    const customerData = await this.prisma.customer.create({
      data: {
        name,
        email,
        phone,
        password: hashedPassword, // Salvamos a senha segura, nunca a limpa!
        avatarUrl,
      },
    });

    // 5. Forma moderna e segura de remover a senha no TypeScript (Substitui o 'delete')
    const { password: _, ...customerWithoutPassword } = customerData;

    return customerWithoutPassword;
  }

  async findByEmail(email: string) {
    // Busca no banco um cliente onde o e-mail seja exatamente o digitado
    const customer = await this.prisma.customer.findUnique({
      where: { email },
    });

    return customer;
  }

  async update(id: string, updateCostomerDto: UpdateCostomerDto) {
    try {
      const costomerAtualizado = await this.prisma.customer.update({
        where: { id },
        data: {
          name: updateCostomerDto.name,
          phone: updateCostomerDto.phone,
          avatarUrl: updateCostomerDto.avatarUrl,
        },
      });

      // Remove a senha do retorno por segurança
      const { password, ...result } = costomerAtualizado;
      return result;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Utilizador não encontrado.');
      }
      throw new HttpException(
        'Erro ao atualizar o perfil.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: string) {
    try {
      // Deleta o cliente no banco baseado no ID do token
      await this.prisma.customer.delete({
        where: { id },
      });

      // Retornamos uma mensagem de sucesso para o front-end
      return {
        success: true,
        message: 'Sua conta foi deletada com sucesso.',
      };
    } catch (error) {
      // Se por algum motivo o ID não existir mais no banco (erro P2025 do Prisma)
      if (error.code === 'P2025') {
        throw new NotFoundException('Utilizador não encontrado.');
      }
      throw new HttpException(
        'Erro ao tentar deletar a conta.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return `This action returns all costomers`;
  }

  findOne(id: string) {
    return `This action returns a #${id} costomer`;
  }
}
