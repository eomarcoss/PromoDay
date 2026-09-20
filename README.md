# PromoDay

Plataforma que conecta **lojistas** e **clientes** por meio de promoções com tempo limitado. O lojista publica ofertas com estoque, limite por cliente e prazo de validade; o cliente resgata a oferta, recebe um cupom com código único (`PD-XXXXXX`) e o lojista valida esse código no balcão.

O repositório é um monorepo com duas aplicações:

* `back/`: API RESTful em NestJS + Prisma + PostgreSQL
* `front/`: aplicação web em Next.js (App Router), pensada para uso mobile

## Tecnologias Utilizadas

**Backend**

* Node.js e TypeScript
* NestJS 11
* Prisma 7 (adapter `pg`)
* PostgreSQL
* Autenticação JWT (`@nestjs/jwt`) e senhas com `bcrypt`
* `class-validator` / `class-transformer` para validação de DTOs
* Supabase Storage para upload de imagens
* `@nestjs/schedule` para tarefas agendadas
* Jest e Supertest para testes

**Frontend**

* Next.js 16 e React 19
* Tailwind CSS 4 e shadcn/ui
* React Hook Form
* Axios e SWR
* Fuse.js (busca) e Sonner (notificações)

## Funcionalidades

**Cliente**

* Cadastro e login com foto de perfil
* Feed de promoções ativas com busca por nome e filtro por categoria
* Resgate de promoções com geração de cupom único
* Controle de estoque e de limite de resgates por usuário
* Histórico de resgates e métricas (total de resgates e total economizado em R$)

**Lojista**

* Cadastro da loja com endereço, categoria e horário de funcionamento
* CRUD de promoções com até 3 imagens
* Pausar e reativar promoções
* Validação de cupons pelo código
* Métricas da loja (promoções criadas e vendas validadas)

**Sistema**

* Perfis de acesso `CUSTOMER` e `SELLER` (guards de JWT e roles)
* Rotas do front protegidas por middleware conforme o perfil
* Tarefa agendada (a cada minuto) que remove promoções expiradas e seus cupons

## Estrutura do Projeto

```
promoday/
├── back/
│   ├── prisma/            # schema.prisma e migrations
│   └── src/
│       ├── modules/       # auth, costomers, sellers, promotions, claims, tasks, guards
│       ├── shared/        # StorageService (Supabase)
│       └── main.ts
└── front/
    └── src/
        ├── app/           # rotas (Customer, seller, auth, register) e server actions
        ├── components/    # shared/ e ui/
        └── middleware.ts
```

## Configuração do Ambiente

### Pré-requisitos

Antes de prosseguir, verifique se você tem os seguintes requisitos instalados em sua máquina:

* Node.js 20+
* npm
* PostgreSQL
* Uma conta no [Supabase](https://supabase.com/) (para o storage de imagens)

### Instalação e Configuração

* Clone este repositório:

```
git clone https://github.com/SEU-USUARIO/promoday.git
cd promoday
```

#### Backend

* Instale as dependências:

```
cd back
npm install
```

* Crie o arquivo `back/.env` com as variáveis abaixo:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/promoday"
JWT_SECRET="sua_chave_secreta"
SUPABASE_URL="https://seu-projeto.supabase.co"
SUPABASE_KEY="sua_chave_do_supabase"
PORT=3001
```

* No Supabase, crie um bucket **público** chamado `Avatars` (usado para avatares e imagens das promoções).
* Gere o client do Prisma e aplique as migrations:

```
npx prisma generate
npx prisma migrate deploy
```

* Inicie a API:

```
npm run start:dev
```

A API ficará disponível em `http://localhost:3001`.

#### Frontend

* Instale as dependências:

```
cd front
npm install
```

* Crie o arquivo `front/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

* Inicie a aplicação:

```
npm run dev
```

O front ficará disponível em `http://localhost:3000`.


## Capturas de Tela da Aplicação

Feed de promoções

<!-- ![Feed de promoções](docs/feed.png) -->

Resgate de cupom

<!-- ![Resgate de cupom](docs/resgate.png) -->

Painel do lojista

<!-- ![Painel do lojista](docs/painel-lojista.png) -->

## Deploy

* **Front:** Vercel (o `vercel.json` já está configurado).
* **Back:** em produção, defina `NODE_ENV=production` e atualize a origem permitida no CORS em `back/src/main.ts` com a URL do seu front.
