export const R1_DATA = [
  {
    topic: "Психология", costs: [100, 200, 300],
    questions: [
      { cost: 100, text: "назови 3 признака стабильной самооценки", answer: "1. Уверенность без крайностей\n2. Независимость от чужого мнения\n3. Спокойное отношение к ошибкам", modifier: false },
      { cost: 200, text: "Типы темпераментов", answer: "1. Сангвиник\n2. Холерик\n3. Флегматик\n4. Меланхолик", modifier: false },
      { cost: 300, text: "За 10 секунд назови пять писателей на букву \"Т\"", answer: "Толстой, Тургенев, Тютчев, Твардовский, Толкин...", modifier: true, modifierType: "МОДИФИКАТОР" },
    ]
  },
  {
    topic: "Что по встрече?", costs: [100, 200, 300],
    questions: [
      { cost: 100, text: "(нужно назвать, какая это встреча по фото)", answer: "Выставка “Сны Алены”", image: "image18.png", modifier: false },
      { cost: 200, text: "(нужно назвать, какая это встреча по фото)", answer: "Музей Фаберже в Питере", image: "image20.png", modifier: false },
      { cost: 300, text: "(нужно назвать, какая это встреча по фото)", answer: "Дукаты в Краснодаре", image: "image19.png", modifier: false }
    ]
  },
  {
    topic: "Мамский чат", costs: [100, 200, 300],
    questions: [
      { cost: 100, text: "Кто приемная мать мамонтенка?", answer: "Слон", modifier: false },
      { cost: 200, text: "Китайская суперзвезда мамского чата", answer: "Нина", modifier: false },
      { cost: 300, text: "Цитата: \"Растет все и ничего не выпадает - потом выпадает все, потому что не выпадало\". О чем речь?", answer: "Стикер крыса в розовом парике", modifier: false }
    ]
  },
  {
    topic: "Угадай мем", costs: [100, 200, 300],
    questions: [
      { cost: 100, text: "Угадай мем", answerImage: "image2.png", image: "image2.png", modifier: false },
      { cost: 200, text: "Угадай мем", answerImage: "image4.png", image: "image4.png", modifier: false },
      { cost: 300, text: "Угадай мем", answerImage: "image1.png", image: "image1.png", modifier: false }
    ]
  },
  {
    topic: "Нейроболваны", costs: [100, 200, 300],
    questions: [
      { cost: 100, text: "(какие ии зашифрованы в виде смайликов)\n\n🖼️🧠🪄🌟", answer: "Midjourney", modifier: false },
      { cost: 200, text: "Пропой песню из диснеевских сериалов или мультфильмов.\nполучишь 600 баллов. С подсказкой - 400 баллов", answer: "Песня", modifier: true, modifierType: "МОДИФИКАТОР" },
      { cost: 300, text: "🧠💬⚖️🔍", answer: "Claude", modifier: false }
    ]
  }
];

export const R2_DATA = [
  {
    topic: "Куда течет река", costs: [200, 400, 600, 800, 1000],
    questions: [
      { cost: 200, text: "(нужно по элементу угадать, река это или нет)", answerImage: "image3.png", image: "image3.png", modifier: false },
      { cost: 400, text: "(нужно по элементу угадать, река это или нет)", answerImage: "image11.png", image: "image11.png", modifier: false },
      { cost: 600, text: "Отдай человеку, фамилия которого ниже твоей по алфавиту на 2 и более букв (например, Иванов отдает баллы Лаврову), 500 баллов", answer: "Отдано 500 баллов", modifier: true, modifierType: "МОДИФИКАТОР" },
      { cost: 800, text: "(нужно по элементу угадать, река это или нет)", answerImage: "image8.png", image: "image8.png", modifier: false },
      { cost: 1000, text: "(нужно по элементу угадать, река это или нет)", answerImage: "image14.png", image: "image14.png", modifier: false }
    ]
  },
  {
    topic: "Оффлайн", costs: [200, 400, 600, 800, 1000],
    questions: [
      { cost: 200, text: "Назовите три оффлайн мероприятия клуба, которые организовала Ксения.", answer: "Каток в ДФФ, Кофе рейв, Симач", modifier: false },
      { cost: 400, text: "На каком мероприятии вы могли съесть вкусные пряники?", answer: "Кофе рейв", modifier: false },
      { cost: 600, text: "Куда ходили питерские дукаты вместе с Ксенией?", answer: "Музей Фаберже", modifier: false },
      { cost: 800, text: "Видел ли кто-то Виталия?", answer: "Нет/мало вероятно/кто это/человек в зеленом костюме/ии/я питерский, я видел", modifier: false },
      { cost: 1000, text: "Где вы можете узнать о всех активностях клуба?", answer: "Канал и календарь клуба", modifier: false }
    ]
  },
  {
    topic: "Брендомания", costs: [200, 400, 600, 800, 1000],
    questions: [
      { cost: 200, text: "(угадайте зашифрованные логотипы брендов)", answer: "Rolex, Mersedes", image: "image21.png", modifier: false },
      { cost: 400, text: "(угадайте зашифрованные логотипы брендов)", answer: "RedBull, Starbucks", image: "image9.png", modifier: false },
      { cost: 600, text: "(угадайте зашифрованные логотипы брендов)", answer: "Т-банк, Билайн", image: "image6.png", modifier: false },
      { cost: 800, text: "Переход хода. Выберем участника, который будет следующим выбирать вопрос вместо тебя", answer: "Переход хода", modifier: true, modifierType: "МОДИФИКАТОР" },
      { cost: 1000, text: "(угадайте зашифрованные логотипы брендов)", answer: "BMW, Meta, Spotify", image: "image17.png", modifier: false }
    ]
  },
  {
    topic: "Знатоки чата", costs: [200, 400, 600, 800, 1000],
    questions: [
      { cost: 200, text: "Назовите пять человек, которые чаще всего вы видите в переписках в чате", answer: "Элеонора, Кристина, Наташа Рэн, Шуша, Марина МАШИНА, Леся, Елена Чечет, Виталий.", modifier: false },
      { cost: 400, text: "С каким животным ассоциируется чат?", answer: "Крыска/крыса", modifier: false },
      { cost: 600, text: "По мотивам какого фильма была создана обложка чата канала клуба?", answer: "Бойцовский клуб", modifier: false },
      { cost: 800, text: "Была ли ветка \"Пушистика\" с самого начала?", answer: "Нет", modifier: false },
      { cost: 1000, text: "Какая тема была затронута/ часто мелькала в марте в ветке Бьюти?", answer: "Ноготочки", modifier: false }
    ]
  },
  {
    topic: "Стиль", costs: [200, 400, 600, 800, 1000],
    questions: [
      { cost: 200, text: "С кем был прямой эфир по макияжу?", answer: "Анна Монахова", modifier: false },
      { cost: 400, text: "Отдай все баллы человеку с наименьшим количеством баллов", answer: "Баллы отданы", modifier: true, modifierType: "МОДИФИКАТОР" },
      { cost: 600, text: "Кто был спикером на эфире по прическам?", answer: "Дмитрий Абрамович", modifier: false },
      { cost: 800, text: "Какой тест клубчане проходили, чтобы понять свой типаж?", answer: "Кибби", modifier: false },
      { cost: 1000, text: "Как называется ветка чата, где можно отдать/продать вещи в хорошие руки?", answer: "СВОП", modifier: false }
    ]
  }
];

export const SUPER_GAME_DATA = [
  { topic: "Подруги", text: "Кто входил в состав ведущих в первых выпусках шоу?", answer: "Ксения, Карина, Татьяна" },
  { topic: "Групповое задание", text: "Популярный мультик из прошлого задания месяца", answer: "Шрек" },
  { topic: "Где поесть?", text: "Какой ресторан дукаты бронировали чаще всего?", answer: "jpan/ava" },
  { topic: "Гороскоп", text: "Перечислите огненные знаки", answer: "Овен, Лев, Стрелец" },
  { topic: "Самое популярное слово", text: "Сколько раз слово “дукаты” встречается в чате с ветками? Назовите диапозон", answer: "174" },
  { topic: "Смешарики", text: "В ноябре, на старте клуба участники массово проходили опрос \"Какой ты смешарик\" и даже заполнили форму. Какой смешарик большинство?", answer: "Лосяш" }
];
