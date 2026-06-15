import { ConflictException, Injectable } from '@nestjs/common';
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
      avatarUrl = await this.StorageService.uploadFile(file, 'Avatars');
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

  findAll() {
    return `This action returns all costomers`;
  }

  findOne(id: string) {
    return `This action returns a #${id} costomer`;
  }

  update(id: string, updateCostomerDto: UpdateCostomerDto) {
    return `This action updates a #${id} costomer`;
  }

  remove(id: string) {
    return `This action removes a #${id} costomer`;
  }
}
