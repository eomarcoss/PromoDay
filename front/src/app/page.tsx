import Image from "next/image";
import Link from "next/link";

export default function Home() {
  // DRY: Array de objetos para os cartões de recursos (Features Grid)
  const features = [
    {
      id: 1,
      title: "Promoções Exclusivas",
      description: "Acesse ofertas únicas selecionadas para você todos os dias em nossa plataforma.",
      // Usando SVG inline padrão para não depender de bibliotecas externas de ícones
      icon: (
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      bgClass: "bg-[#88E713]/40", // Variação de opacidade para gerar o gradiente visual de verde
    },
    {
      id: 2,
      title: "Alertas Inteligentes",
      description: "Receba notificações em tempo real assim que um desconto imperdível for publicado.",
      icon: (
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      bgClass: "bg-[#88E713]", // Cor sólida primária
    },
    {
      id: 3,
      title: "Painel Unificado",
      description: "Veja todos os seus cupons e descontos salvos em uma única interface intuitiva.",
      icon: (
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      bgClass: "bg-[#88E713]/80",
    },
    {
      id: 4,
      title: "Sugestões Personalizadas",
      description: "Receba recomendações focadas baseadas no seu histórico de compras e interesses.",
      icon: (
        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      bgClass: "bg-[#88E713]/60",
    }
  ];

  // DRY: Array para os passos da seção 3
  const steps = [
    {
      id: 1,
      title: "Cadastre-se e Conecte",
      description: "Crie sua conta em segundos e conecte seus interesses para ver ofertas personalizadas.",
      icon: (
        <svg className="w-6 h-6 text-[#161B22]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      id: 2,
      title: "Explore Ofertas Inteligentes",
      description: "Nosso sistema destaca os melhores descontos de eletrônicos, supermercado e mais.",
      icon: (
        <svg className="w-6 h-6 text-[#161B22]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      id: 3,
      title: "Economize com Segurança",
      description: "Todos os cupons são testados. Suas compras seguras e sempre em conta.",
      icon: (
        <svg className="w-6 h-6 text-[#161B22]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-[#F7F9F6] text-[#111827] font-sans selection:bg-[#88E713] selection:text-black">
      {/* HEADER / NAVIGATION */}
      <header className="container mx-auto px-4 md:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo */}
          <div className="text-2xl font-black tracking-tighter text-[#88E713] uppercase flex items-center gap-1">
            PromoDay
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 font-medium text-sm">
          <Link href="#features" className="hover:text-[#88E713] transition-colors">Recursos</Link>
          <Link href="#how-it-works" className="hover:text-[#88E713] transition-colors">Como Funciona</Link>
          <Link href="#pricing" className="hover:text-[#88E713] transition-colors">Preços</Link>
          <Link href="#about" className="hover:text-[#88E713] transition-colors">Sobre</Link>
          <Link href="#testimonials" className="hover:text-[#88E713] transition-colors">Depoimentos</Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/auth/login" className="font-semibold text-sm hover:text-[#88E713] transition-colors">
            Log In
          </Link>
          <Link href="/auth/register" className="px-5 py-2.5 rounded-full border border-[#111827] font-semibold text-sm hover:bg-[#111827] hover:text-white transition-all">
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <button className="lg:hidden p-2">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      <main>
        {/* SEÇÃO 1: HERO SECTION */}
        <section className="container mx-auto px-4 md:px-6 lg:px-8 pt-12 pb-20 lg:pt-20 lg:pb-32 flex flex-col lg:flex-row items-center gap-16 lg:gap-8 overflow-hidden">
          {/* Hero Texto (Esquerda) */}
          <div className="w-full lg:w-1/2 flex flex-col items-start text-left space-y-8 z-10">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              Seu Parceiro em <br />
              <span className="text-[#88E713]">Economias</span> Inteligentes
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-lg font-medium">
              Assuma o controle do seu dinheiro com ferramentas projetadas para ajudar você a economizar mais, comprar com inteligência e planejar o futuro — sem esforço.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 bg-[#88E713] text-[#111827] rounded-full font-bold text-lg hover:bg-[#76c910] transition-colors shadow-lg shadow-[#88E713]/20">
                Falar com Especialista
              </button>
              <button className="w-full sm:w-auto px-8 py-4 flex items-center justify-center gap-3 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors">
                <span className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#111827]">
                  <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
                Assistir Vídeo
              </button>
            </div>

            {/* Pílulas de Tags */}
            <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-200 mt-4">
              {["Eletrônicos", "Supermercado", "Cupons", "Descontos", "Viagens", "Dicas Expert"].map((tag) => (
                <span key={tag} className="px-5 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-600 hover:border-[#88E713] hover:text-[#111827] transition-colors cursor-pointer bg-white">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Hero Gráficos (Direita) - Tickets de Promoção Flutuantes */}
          <div className="w-full lg:w-1/2 relative min-h-[400px] md:min-h-[550px] flex items-center justify-center">
            {/* Círculo Verde de Fundo (Blur) */}
            <div className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-[#88E713] rounded-full blur-[100px] opacity-30 z-0 border-[1px] border-[#88E713]"></div>
            {/* Círculos com borda fina como no design */}
            <div className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] rounded-full border border-[#88E713]/30 z-0"></div>
            <div className="absolute w-[500px] h-[500px] md:w-[800px] md:h-[800px] rounded-full border border-[#88E713]/10 z-0"></div>

            <div className="relative z-10 w-full max-w-lg">

              {/* Ticket 1: Supermercado (Topo Direita) */}
              <div className="absolute top-0 right-4 md:-right-8 transform rotate-6 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-2xl border-l-8 border-[#88E713] w-64 md:w-72">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-black text-gray-800 text-sm tracking-widest">SUPERMERCADO</span>
                  <svg className="w-6 h-6 text-[#88E713]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-black text-[#111827] mb-1">R$ 50 OFF</div>
                <div className="text-sm font-medium text-gray-500 flex items-center justify-between">
                  <span>Em compras acima de R$200</span>
                  <span className="bg-[#88E713] text-[#111827] px-2 py-0.5 rounded text-xs font-bold">HOJE</span>
                </div>
              </div>

              {/* Ticket 2: Eletrônicos (Centro Esquerda) */}
              <div className="absolute top-32 left-0 md:-left-12 transform -rotate-3 bg-[#161B22] p-6 rounded-3xl shadow-2xl w-72 md:w-80 text-white border border-gray-800">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-[#88E713] rounded-xl flex items-center justify-center text-[#161B22]">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold tracking-widest text-gray-400 block mb-1">ELETRÔNICOS</span>
                    <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs">Cupom 15%</span>
                  </div>
                </div>
                <div className="text-gray-400 text-sm mb-1">Smartphone Ultra Pro</div>
                <div className="text-3xl font-bold text-white tracking-tight">R$ 3.499<span className="text-lg text-gray-500">,00</span></div>

                <div className="mt-6 pt-4 border-t border-gray-800 flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <span className="w-2 h-2 rounded-full bg-[#88E713]"></span> Válido no APP
                  </div>
                  <div className="text-[#88E713] font-bold">Copiar Código</div>
                </div>
              </div>

              {/* Elemento flutuante Extra (Embaixo Direita) */}
              <div className="absolute -bottom-4 right-10 md:right-0 bg-white px-5 py-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce border border-gray-100">
                <div className="w-10 h-10 bg-[#88E713] rounded-full flex items-center justify-center text-[#111827]">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-sm text-[#111827]">Oferta Relâmpago</div>
                  <div className="text-xs text-gray-500">Expira em 02:45:10</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PARCEIROS (Lojas) */}
        <section className="container mx-auto px-4 md:px-6 lg:px-8 pb-24">
          <div className="text-center mb-8 relative">
            <span className="text-sm font-bold text-[#88E713] tracking-widest uppercase bg-[#F7F9F6] px-4 relative z-10">Lojas Parceiras</span>
            <div className="absolute top-1/2 left-0 w-full h-px bg-gray-200 -z-0"></div>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="text-2xl font-black tracking-tighter">AMAZON</div>
            <div className="text-2xl font-black italic">MERCADO LIVRE</div>
            <div className="text-2xl font-black tracking-widest">MAGALU</div>
            <div className="text-2xl font-black">AMERICANAS</div>
            <div className="text-2xl font-black tracking-tight">SHOPEE</div>
          </div>
        </section>

        {/* SEÇÃO 2: GRID DE RECURSOS */}
        <section id="features" className="container mx-auto px-4 md:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-6">
            <div className="max-w-3xl">
              <span className="inline-block px-5 py-2 bg-[#161B22] text-white rounded-full text-sm font-bold mb-6">
                Recursos
              </span>
              <h2 className="text-3xl md:text-5xl font-bold leading-tight">
                Alcance a <span className="text-[#88E713]">clareza nas compras</span> e assuma o controle do seu orçamento com ferramentas criadas para simplificar e personalizar sua <span className="text-[#20B2AA]">gestão de economia</span>.
              </h2>
            </div>
            <p className="text-[#111827] font-medium whitespace-nowrap">
              Tudo que você precisa, nada além disso.
            </p>
          </div>

          {/* Grid DRY com Map */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.id}
                className={`${feature.bgClass} rounded-[32px] p-8 flex flex-col justify-between aspect-[4/5] hover:-translate-y-2 transition-transform duration-300 shadow-sm`}
              >
                <div>
                  <div className="w-16 h-16 rounded-2xl bg-black/5 flex items-center justify-center mb-6 text-[#111827]">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 leading-tight">{feature.title}</h3>
                </div>
                <p className="font-medium text-sm text-[#111827]/80">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* SEÇÃO 3: 3 EASY STEPS (Fundo Verde Total) */}
        <section id="how-it-works" className="bg-[#88E713] py-24 w-full mt-12">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

              {/* Esquerda: Mockup Cartão Escuro (#161B22) */}
              <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
                <div className="bg-[#161B22] rounded-[40px] p-8 md:p-10 w-full max-w-[550px] shadow-2xl text-white">
                  {/* Mockup Header */}
                  <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/5">
                      <span className="text-xl">🇺🇸</span>
                      <span className="text-sm font-semibold">US Dollar</span>
                    </div>
                    <div className="w-12 h-12 rounded-full border border-gray-600 flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                  </div>

                  {/* Mockup Content */}
                  <div className="mb-3 text-sm font-medium text-gray-400">Total Economizado (Anual)</div>
                  <div className="text-5xl md:text-6xl font-black mb-12 tracking-tight">$ 4,586.32</div>

                  {/* Mockup Buttons */}
                  <div className="flex items-center gap-3 md:gap-4">
                    <button className="flex-1 bg-transparent border border-gray-700 hover:bg-white/10 transition-colors py-4 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      Sacar
                    </button>
                    <button className="flex-1 bg-transparent border border-gray-700 hover:bg-white/10 transition-colors py-4 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Transferir
                    </button>
                    <button className="w-16 h-16 shrink-0 bg-[#88E713] text-[#161B22] rounded-2xl flex items-center justify-center shadow-lg hover:bg-white transition-colors">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Direita: Textos e Passos (Contraste escuro sobre o verde claro) */}
              <div className="w-full lg:w-1/2 flex flex-col space-y-10">
                <h2 className="text-4xl md:text-5xl font-black text-[#111827] leading-tight max-w-lg">
                  Comece a Gerenciar suas Compras em 3 Passos Fáceis
                </h2>

                <div className="space-y-8">
                  {steps.map((step) => (
                    <div key={step.id} className="flex items-start gap-6 group">
                      {/* Ícone com fundo escuro semi-transparente para dar contraste com o verde */}
                      <div className="w-16 h-16 rounded-2xl bg-[#111827]/10 flex items-center justify-center shrink-0 group-hover:bg-[#111827]/20 transition-colors">
                        {step.icon}
                      </div>
                      <div className="pt-1">
                        <h4 className="text-xl font-bold text-[#111827] mb-2">{step.title}</h4>
                        <p className="text-[#111827]/80 font-medium leading-relaxed max-w-md">
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

      </main>

      {/* FOOTER (Simple just to finish the page) */}
      <footer className="container mx-auto px-4 py-12 flex justify-between items-center text-sm font-medium border-t border-gray-200 mt-12">
        <span className="px-4 py-1.5 bg-[#161B22] text-white rounded-full text-xs font-bold">Pricing</span>
        <span className="text-gray-500">Try it free. Upgrade anytime.</span>
      </footer>
    </div>
  );
}
1