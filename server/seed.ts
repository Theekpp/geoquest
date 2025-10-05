import { storage } from "./storage";

async function seed() {
  console.log("Starting seed...");

  const motif = await storage.createMotif({
    name: "Старик Хоттабыч",
    description: "Литературный квест по местам из знаменитой сказки Лазаря Лагина",
    legend: "Волька ибн Алёша обнаружил древний кувшин на дне реки. Из него вырвался джинн, который пролежал там тысячу лет! Пройди по местам, описанным в книге, и помоги Вольке справиться с проделками старика Хоттабыча.",
    theme: {
      primary: "215 85% 55%",
      accent: "45 95% 60%",
      background: "220 15% 12%",
      surface: "220 15% 16%",
      fontDisplay: "Playfair Display",
      fontBody: "Inter"
    },
    isActive: true
  });
  console.log(`Created motif: ${motif.name}`);

  const pois = [
    {
      motifId: motif.id,
      name: "Москва-река",
      description: "Место, где Волька нашел старинный кувшин с джинном. Именно здесь началось невероятное приключение мальчика и могущественного Хоттабыча.",
      quote: "«Волька вдруг заметил под водой какой-то предмет, тускло поблескивавший медью...»",
      latitude: "55.7520",
      longitude: "37.6175",
      order: 1,
      radius: 100,
      points: 50,
      imageUrl: null
    },
    {
      motifId: motif.id,
      name: "Парк имени Баумана",
      description: "Сквер, где Волька впервые увидел Хоттабыча во всем его восточном великолепии. Старик явился в пышном халате с бородой до пояса.",
      quote: "«Из-за кустов сирени вышел высокий старик в золотом халате...»",
      latitude: "55.7630",
      longitude: "37.6790",
      order: 2,
      radius: 100,
      points: 50,
      imageUrl: null
    },
    {
      motifId: motif.id,
      name: "ЦПКиО имени Горького",
      description: "Парк культуры, где происходили многие чудеса Хоттабыча. Здесь старик демонстрировал свою магию, к ужасу и восторгу Вольки.",
      quote: "«Хоттабыч решил показать Вольке все прелести волшебства...»",
      latitude: "55.7309",
      longitude: "37.6019",
      order: 3,
      radius: 150,
      points: 50,
      imageUrl: null
    },
    {
      motifId: motif.id,
      name: "Большой театр",
      description: "Место, куда Хоттабыч привел Вольку, чтобы показать настоящее искусство. Старик был поражен современной музыкой и танцами.",
      quote: "«Это великолепное здание произвело на Хоттабыча огромное впечатление»",
      latitude: "55.7603",
      longitude: "37.6186",
      order: 4,
      radius: 100,
      points: 75,
      imageUrl: null
    },
    {
      motifId: motif.id,
      name: "Стадион Динамо",
      description: "Стадион, где Хоттабыч применил свою магию во время футбольного матча, вызвав невероятную путаницу на поле.",
      quote: "«Хоттабыч решил помочь любимой команде Вольки...»",
      latitude: "55.7916",
      longitude: "37.5589",
      order: 5,
      radius: 150,
      points: 100,
      imageUrl: null
    }
  ];

  for (const poi of pois) {
    const created = await storage.createPoi(poi);
    console.log(`Created POI: ${created.name}`);
  }

  const achievements = [
    {
      name: "Первооткрыватель",
      description: "Посетите первую точку квеста",
      iconUrl: null,
      condition: "visit_first_poi",
      points: 25
    },
    {
      name: "Коллекционер историй",
      description: "Посетите 3 точки любого квеста",
      iconUrl: null,
      condition: "visit_3_pois",
      points: 50
    },
    {
      name: "Мастер маршрута",
      description: "Завершите весь квест 'Старик Хоттабыч'",
      iconUrl: null,
      condition: "complete_hottabych",
      points: 100
    },
    {
      name: "Легенда Москвы",
      description: "Наберите 500 баллов",
      iconUrl: null,
      condition: "reach_500_points",
      points: 150
    },
    {
      name: "Ранняя пташка",
      description: "Посетите точку до 9 утра",
      iconUrl: null,
      condition: "visit_before_9am",
      points: 30
    }
  ];

  for (const achievement of achievements) {
    const created = await storage.createAchievement(achievement);
    console.log(`Created achievement: ${created.name}`);
  }

  console.log("Seed completed successfully!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
