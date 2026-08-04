const DIAS_SEMANA: {
  [key: string]: { nome: string; abrev: string; ordem: number };
} = {
  domingo: { nome: "Domingo", abrev: "Dom", ordem: 0 },
  segunda: { nome: "Segunda", abrev: "Seg", ordem: 1 },
  terca: { nome: "Terça", abrev: "Ter", ordem: 2 },
  quarta: { nome: "Quarta", abrev: "Qua", ordem: 3 },
  quinta: { nome: "Quinta", abrev: "Qui", ordem: 4 },
  sexta: { nome: "Sexta", abrev: "Sex", ordem: 5 },
  sabado: { nome: "Sábado", abrev: "Sáb", ordem: 6 },
};

export function formatBusinessHours(businessHoursData: any): string {
  if (!businessHoursData) return "Horário não informado";

  let hours = businessHoursData;

  // Se vier como string JSON (FormData/Escapado), faz a conversão
  if (typeof businessHoursData === "string") {
    try {
      hours = JSON.parse(businessHoursData);
    } catch {
      return businessHoursData; // Retorna como string se for texto simples
    }
  }

  // Filtra apenas os dias em que o estabelecimento está ABERTO
  const openDays = Object.entries(hours)
    .filter(
      ([_, value]: [string, any]) =>
        value?.aberto === true && value?.inicio && value?.fim,
    )
    .map(([day, value]: [string, any]) => ({
      key: day,
      info: DIAS_SEMANA[day.toLowerCase()],
      inicio: value.inicio,
      fim: value.fim,
    }))
    .filter((d) => d.info !== undefined)
    .sort((a, b) => a.info.ordem - b.info.ordem);

  if (openDays.length === 0) {
    return "Fechado temporariamente";
  }

  // CASO 1: Todos os dias abertos possuem o mesmo horário de início e fim
  const firstHours = `${openDays[0].inicio} às ${openDays[0].fim}`;
  const sameHoursAllDays = openDays.every(
    (d) => `${d.inicio} às ${d.fim}` === firstHours,
  );

  if (sameHoursAllDays) {
    if (openDays.length === 7) {
      return `Todos os dias: ${firstHours}`;
    }

    // Verifica se os dias são consecutivos (ex: Seg(1), Ter(2), Qua(3))
    const isConsecutive = openDays.every((day, index) => {
      if (index === 0) return true;
      return day.info.ordem === openDays[index - 1].info.ordem + 1;
    });

    if (isConsecutive) {
      const firstDayName = openDays[0].info.abrev;
      const lastDayName = openDays[openDays.length - 1].info.abrev;
      return `${firstDayName} a ${lastDayName}: ${firstHours}`;
    }

    // Se NÃO forem consecutivos (ex: Seg, Qua, Sex), lista os dias separados por vírgula
    const daysList = openDays.map((d) => d.info.abrev).join(", ");
    return `${daysList}: ${firstHours}`;
  }

  // CASO 2: Horários variados por dia -> Pega o horário de HOJE para priorizar contexto útil
  const todayIndex = new Date().getDay(); // 0 = Domingo, 1 = Segunda...
  const todayEntry = openDays.find((d) => d.info.ordem === todayIndex);

  if (todayEntry) {
    return `Hoje (${todayEntry.info.abrev}): ${todayEntry.inicio} às ${todayEntry.fim}`;
  }

  // CASO 3: Se hoje estiver FECHADO, mostra o próximo dia em que abre
  const nextOpen = openDays[0];
  return `${nextOpen.info.abrev}: ${nextOpen.inicio} às ${nextOpen.fim}`;
}
