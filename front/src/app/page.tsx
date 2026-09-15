"use client"

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const features = [
    {
      id: 1,
      title: "Promoções Exclusivas",
      description: "Acesse ofertas únicas e descontos especiais selecionados para você todos os dias em nossa plataforma.",
      icon: (
        <svg className="w-8 h-8 lg:w-10 lg:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      bgClass: "bg-primary",
    },
    {
      id: 2,
      title: "Resgate cupons únicos com um clique",
      description: "Garanta seu desconto instantaneamente. Basta um clique para salvar o cupom e usar na sua próxima compra.",
      icon: (
        <svg className="w-8 h-8 lg:w-10 lg:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
        </svg>
      ),
      bgClass: "bg-background",
    },
    {
      id: 3,
      title: "Valide seu cupom facilmente com QR Code",
      description: "Apresente o código no estabelecimento parceiro e valide sua promoção de forma rápida, segura e sem contato.",
      icon: (
        <svg className="w-8 h-8 lg:w-10 lg:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      bgClass: "bg-primary",
    },
    {
      id: 4,
      title: "Acompanhe quanto você já economizou",
      description: "Tenha um relatório visual do seu progresso. Veja o impacto das suas escolhas inteligentes no seu bolso.",
      icon: (
        <svg className="w-8 h-8 lg:w-10 lg:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      bgClass: "bg-background",
    }
  ];
  const steps = [
    {
      id: 1,
      title: "Cadastre-se e Conecte",
      description: "Crie sua conta em segundos e veja as melhores promoções do dia.",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Explore Ofertas Inteligentes",
      description: "Nosso sistema destaca os melhores descontos de eletrônicos, supermercado e mais.",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Economize com Segurança",
      description: "Clique, resgate e valide seu cupom com segurança no estabelecimento local.",
      icon: (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // UX Extra: Previne o scroll da página quando o menu mobile estiver aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);
  const closeMenu = () => setIsMobileMenuOpen(false);
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-background selection:text-black">

      {/* HEADER / NAVIGATION */}
      <header className="w-full absolute top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 sm:py-6 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2 relative z-50">
            <Link href="/" className="text-xl sm:text-2xl font-black tracking-tighter text-primary uppercase flex items-center gap-1" onClick={closeMenu}>
              PromoDay
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 font-medium text-sm">
            <Link href="#features" className="hover:text-primary transition-colors">Recursos</Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">Como Funciona</Link>
            <Link href="#sobre" className="hover:text-primary transition-colors">Sobre</Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/auth/login" className="font-semibold text-sm hover:text-primary transition-colors">
              Entrar
            </Link>
            <Link href="/register" className="px-5 py-2.5 rounded-full border border-primary font-semibold text-sm hover:bg-primary hover:text-white transition-all">
              Criar conta
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground relative z-50 transition-transform duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-expanded={isMobileMenuOpen}
            aria-label="Alternar menu de navegação"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                // Ícone de "X" (Fechar)
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                // Ícone de Hambúrguer
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        <div
          className={`fixed inset-0 bg-background/95 backdrop-blur-lg lg:hidden flex flex-col items-center justify-center gap-8 transition-all duration-300 ease-in-out ${isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto translate-y-0'
            : 'opacity-0 pointer-events-none -translate-y-4'
            }`}
        >
          <nav className="flex flex-col items-center gap-6 font-medium text-lg text-foreground">
            <Link href="#features" onClick={closeMenu} className="hover:text-primary transition-colors">Recursos</Link>
            <Link href="#how-it-works" onClick={closeMenu} className="hover:text-primary transition-colors">Como Funciona</Link>
            <Link href="#sobre" onClick={closeMenu} className="hover:text-primary transition-colors">Sobre</Link>
          </nav>

          <div className="flex flex-col items-center gap-4 w-full max-w-[200px] mt-4">
            <Link
              href="/auth/login"
              onClick={closeMenu}
              className="font-semibold text-base hover:text-primary transition-colors w-full text-center py-2"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              onClick={closeMenu}
              className="w-full text-center px-5 py-3 rounded-full bg-primary text-white font-semibold text-base hover:opacity-90 transition-all shadow-md"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* SEÇÃO 1: HERO SECTION */}
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden pt-32 pb-16 lg:pt-20 lg:pb-16">
          {/* BACKGROUND GRÁFICO */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <div className="w-[250px] h-[250px] sm:w-[400px] sm:h-[400px] md:w-[550px] md:h-[550px] bg-primary rounded-full blur-[100px] sm:blur-[110px] opacity-30 border border-[#88E713]"></div>
            <div className="absolute w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] md:w-[700px] md:h-[700px] rounded-full border border-[#88E713]/30"></div>
            <div className="absolute w-[380px] h-[380px] sm:w-[650px] sm:h-[650px] md:w-[900px] md:h-[900px] rounded-full border border-[#88E713]/15"></div>
          </div>

          {/* CONTEÚDO HERO */}
          <div className="container mx-auto px-4 md:px-6 lg:px-12 relative z-10 w-full max-w-3xl flex flex-col items-center text-center space-y-6 sm:space-y-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              Garanta suas <br className="hidden sm:inline" />
              <span className="text-primary">Promoções</span> todos os dias aqui!
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-foreground max-w-xl font-medium mx-auto px-2">
              Conectamos estabelecimentos locais com clientes que buscam promoções e descontos em tempo real.
            </p>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full sm:w-auto px-4 sm:px-0">
              <Link href="/promotions">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-primary text-foreground hover:text-primary rounded-full font-bold text-base sm:text-lg hover:bg-foreground transition-colors shadow-lg shadow-[#88E713]/20 cursor-pointer">
                  Ver promoções
                </button>
              </Link>

              <Link href="/register/store">
                <button className="w-full sm:w-auto px-6 sm:px-8 py-2 sm:py-3 flex items-center justify-center gap-3 rounded-full font-bold text-base sm:text-lg hover:bg-foreground hover:text-background transition-colors text-foreground cursor-pointer">
                  <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#111827] dark:border-white/20">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16 6V4c0-2.21-1.79-4-4-4S8 1.79 8 4v2H3v13c0 1.66 1.34 3 3 3h12c1.66 0 3-1.34 3-3V6h-5zm-6-2c0-1.1.9-2 2-2s2 .9 2 2v2h-4V4zm7 16H7c-.55 0-1-.45-1-1V8h12v11c0 .55-.45 1-1 1z" />
                    </svg>
                  </span>
                  Seja um anunciante
                </button>
              </Link>
            </div>

            {/* Pílulas de Tags */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 pt-6 sm:pt-8 border-t border-gray-200/20 mt-4 sm:mt-6 w-full">
              {["Eletrônicos", "Supermercado", "Farmácias", "Restaurantes", "E Muito mais"].map((tag) => (
                <span key={tag} className="px-4 sm:px-5 py-1.5 sm:py-2 rounded-full border border-gray-300 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 hover:border-[#88E713] hover:text-[#111827] dark:hover:text-[#88E713] transition-colors cursor-pointer bg-white dark:bg-black/20 backdrop-blur-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* SEÇÃO 2: GRID DE RECURSOS */}
        <section id="features" className="w-full min-h-screen bg-foreground flex flex-col justify-center py-16 sm:py-24">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 lg:mb-16 gap-6 text-center lg:text-left">
              <div className="max-w-3xl flex flex-col items-center lg:items-start">
                <span className="inline-block px-4 py-1.5 sm:px-5 sm:py-2 bg-primary text-foreground rounded-full text-xs sm:text-sm font-bold mb-4 sm:mb-6">
                  Recursos
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-[#F7F9F6]">
                  Veja o seu <span className="text-primary">dinheiro render</span> no final do mês aproveitando as ofertas diárias do <span className="text-primary">PromoDay.</span>
                </h2>
              </div>
              <p className="text-[#F7F9F6]/80 font-medium lg:whitespace-nowrap pb-2 lg:pb-4 text-sm sm:text-base">
                Tudo que você precisa, nada além disso.
              </p>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {features.map((feature) => (
                <div
                  key={feature.id}
                  className={`${feature.bgClass} rounded-[24px] lg:rounded-[32px] p-6 lg:p-8 flex flex-col justify-between min-h-[250px] lg:aspect-[4/5] hover:-translate-y-2 transition-transform duration-300 shadow-sm`}
                >
                  <div>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-black/5 flex items-center justify-center mb-4 sm:mb-6 text-[#111827]">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 leading-tight">{feature.title}</h3>
                  </div>
                  <p className="font-medium text-xs sm:text-sm text-[#111827]/80">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SEÇÃO 3: 3 EASY STEPS (Fundo Verde Total) */}
        <section id="how-it-works" className="w-full min-h-screen bg-primary flex flex-col justify-center py-16 sm:py-24 overflow-hidden">
          <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

              {/* Esquerda: Imagem 3D */}
              <div className="w-full lg:w-1/2 flex justify-center relative min-h-[300px] sm:min-h-[350px] z-10 order-2 lg:order-1">
                {/* Glow ajustado */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] bg-white rounded-full blur-[80px] sm:blur-[100px] opacity-30 pointer-events-none"></div>

                <img
                  src="https://kgbcwgfipdbvutcljjwb.supabase.co/storage/v1/object/public/Avatars/Gemini_Generated_Image_gwtaj7gwtaj7gwta-removebg-preview.png"
                  alt="Cupom de Desconto 3D"
                  className="relative z-10 w-full max-w-[260px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[480px] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-4 transition-transform duration-700 ease-in-out"
                />
              </div>

              {/* Direita: Textos e Passos */}
              <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 sm:space-y-10 order-1 lg:order-2">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111827] leading-tight max-w-xl">
                  Comece a Economizar nas suas Compras em 3 Passos Simples
                </h2>

                <div className="space-y-6 sm:space-y-8 w-full max-w-lg">
                  {steps.map((step) => (
                    <div key={step.id} className="flex flex-row items-start gap-4 sm:gap-6 group text-left">
                      {/* Ícone menor no mobile, original no desktop */}
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-foreground flex items-center justify-center shrink-0  transition-all duration-300 shadow-sm mt-1 sm:mt-0">
                        {step.icon}
                      </div>

                      <div className="flex-1 pt-1 sm:pt-2">
                        <h4 className="text-lg sm:text-xl font-bold text-foreground mb-1 sm:mb-2">{step.title}</h4>
                        <p className="text- font-medium text-sm sm:text-base leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SEÇÃO 4: SOBRE NÓS */}
        <section id="sobre" className="w-full min-h-screen bg-background flex flex-col justify-center py-16 sm:py-24 relative overflow-hidden">
          {/* Background Decorativo sutil (Glow) */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="container mx-auto px-4 md:px-8 lg:px-12 max-w-7xl relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

              {/* Esquerda: Missão e Texto */}
              <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 sm:space-y-8">
                <span className="inline-block px-4 py-1.5 sm:px-5 sm:py-2 bg-foreground text-background rounded-full text-xs sm:text-sm font-bold">
                  Nossa Missão
                </span>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground leading-tight max-w-xl">
                  Conectando o comércio local a quem <span className="text-primary">ama economizar.</span>
                </h2>

                <p className="text-foreground/80 font-medium text-base sm:text-lg leading-relaxed max-w-lg px-2 sm:px-0">
                  O PromoDay nasceu com um propósito simples: fortalecer a economia do seu bairro enquanto ajuda o seu dinheiro a render mais. Somos a ponte perfeita entre o estabelecimento que precisa girar estoque e o consumidor que busca a melhor oportunidade do dia.
                </p>


              </div>

              {/* Direita: Grid de Dados / Impacto */}
              <div className="w-full lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">

                {/* Card 1: Valor para o Consumidor (Escuro) */}
                <div className="bg-foreground rounded-[24px] lg:rounded-[32px] p-6 sm:p-8 flex flex-col justify-center hover:-translate-y-2 transition-transform duration-300 shadow-sm">
                  <div className="text-primary mb-3 sm:mb-4">
                    {/* Ícone de Escudo/Segurança/Garantia */}
                    <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-background mb-2">100% Grátis</h3>
                  <p className="text-background/70 font-medium text-xs sm:text-sm">Para consumidores. Navegue e resgate cupons sem pagar taxas.</p>
                </div>

                {/* Card 2: Chamada para Empresas (Verde) */}
                <div className="bg-primary rounded-[24px] lg:rounded-[32px] p-6 sm:p-8 flex flex-col justify-center hover:-translate-y-2 transition-transform duration-300 shadow-sm sm:mt-8 cursor-pointer group">
                  <div className="text-[#111827] mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 origin-left">
                    {/* Ícone de Loja/Negócio */}
                    <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#111827] mb-2">Tem um negócio?</h3>
                  <p className="text-[#111827]/80 font-medium text-xs sm:text-sm">Anuncie suas ofertas e atraia novos clientes da sua região hoje mesmo.</p>
                </div>

                {/* Card 3: Impacto Local (Ocupa 2 colunas) */}
                <div className="sm:col-span-2 border-2 border-foreground/10 dark:border-white/10 rounded-[24px] lg:rounded-[32px] p-6 sm:p-8 flex flex-row items-center gap-4 sm:gap-6 hover:border-primary/50 transition-colors duration-300">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground mb-1">Impacto Local</h3>
                    <p className="text-foreground/70 font-medium text-xs sm:text-sm leading-relaxed">Fomentamos o crescimento de pequenos e médios negócios na sua região.</p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-gray-200 dark:border-gray-800 bg-background">
        <div className="container  mx-auto px-4 py-8 flex flex-col sm:flex-row justify-center items-center gap-4 text-sm font-medium">
          <span className="px-4 py-1.5 bg-[#161B22] text-white rounded-full text-xs font-bold">Promoday © 2026</span>
        </div>
      </footer>

    </div>
  );
}