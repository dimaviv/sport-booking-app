import { PrismaClient, sport_type, covering_type, facility_type } from '@prisma/client';

const prisma = new PrismaClient();

const facilitiesData = [
    {
        name: "Морська Хвиля",
        districtId: 1,
        address: "Вул. Портова, 5",
        sportType: [sport_type.basketball, sport_type.volleyball],
        coveringType: covering_type.parquet,
        facilityType: facility_type.indoor,
        description: "Сучасний спортивний комплекс з професійним обладнанням для баскетболу.",
        location: "48.516880,35.038001",
        minBookingTime: 60,
        ownerId: 1,
    },
    {
        name: "Енергетик",
        districtId: 2,
        address: "Вул. Індустріальна, 12",
        sportType: [sport_type.tennis, sport_type.soccer],
        coveringType: covering_type.artificial_lawn,
        facilityType: facility_type.outdoor,
        description: "Відкритий тенісний корт зі штучним покриттям, ідеально підходить для любителів тенісу.",
        location: "48.477033, 35.011601",
        minBookingTime: 90,
        ownerId: 1,
    },
    {
        name: "Суворий Фіт",
        districtId: 5,
        address: "Проспект Героїв, 27",
        sportType: [sport_type.volleyball],
        coveringType: covering_type.sand,
        facilityType: facility_type.outdoor,
        description: "Пляжний волейбол в серці міста - ідеальне місце для активного відпочинку.",
        location: "48.489011, 35.056701",
        minBookingTime: 70,
        ownerId: 1,
    },
    // {
    //     name: "Київський Круїз",
    //     districtId: 3,
    //     address: "Вул. Лісна, 14",
    //     sportType: sport_type.soccer,
    //     coveringType: covering_type.natural_lawn,
    //     facilityType: facility_type.outdoor,
    //     description: "Просторий футбольний майданчик з натуральним газоном для дружніх матчів.",
    //     location: "48.504880, 35.078001",
    //     minBookingTime: 120,
    //     ownerId: 1,
    // },
    // {
    //     name: "Азур",
    //     districtId: 3,
    //     address: "Вул. Пляжна, 3",
    //     sportType: sport_type.tennis,
    //     coveringType: covering_type.rubber,
    //     facilityType: facility_type.indoor,
    //     description: "Тенісний корт з якісним гумовим покриттям, забезпечує комфорт та безпеку гри.",
    //     location: "48.517880, 35.032001",
    //     minBookingTime: 60,
    //     ownerId: 1,
    // },
    // {
    //     name: "Малиновий Пік",
    //     districtId: 3,
    //     address: "Вул. Садова, 8",
    //     sportType: sport_type.basketball,
    //     coveringType: covering_type.parquet,
    //     facilityType: facility_type.indoor,
    //     description: "Критий баскетбольний майданчик, ідеальний для тренувань та змагань.",
    //     location: "48.463880, 35.046001",
    //     minBookingTime: 120,
    //     ownerId: 1,
    // },
    // {
    //     name: "Гарт",
    //     districtId: 3,
    //     address: "Вул. Суворова, 15",
    //     sportType: sport_type.volleyball,
    //     coveringType: covering_type.artificial_lawn,
    //     facilityType: facility_type.outdoor,
    //     description: "Затишний майданчик для волейболу зі штучним покриттям, підходить для всіх вікових груп.",
    //     location: "48.472220, 35.042001",
    //     minBookingTime: 60,
    //     ownerId: 1,
    // },
    // {
    //     name: "Сталь",
    //     districtId: 3,
    //     address: "Вул. Залізнична, 22",
    //     sportType: sport_type.soccer,
    //     coveringType: covering_type.natural_lawn,
    //     facilityType: facility_type.outdoor,
    //     description: "Професійне футбольне поле для проведення тренувань та чемпіонатів.",
    //     location: "48.508880, 35.095001",
    //     minBookingTime: 30,
    //     ownerId: 1,
    // },
    // {
    //     name: "Прибій",
    //     districtId: 3,
    //     address: "Вул. Морський бульвар, 11",
    //     sportType: sport_type.basketball,
    //     coveringType: covering_type.rubber,
    //     facilityType: facility_type.indoor,
    //     description: "Баскетбольний зал з високоякісним гумовим покриттям для комфортної гри.",
    //     location: "48.515971, 35.028001",
    //     minBookingTime: 90,
    //     ownerId: 1
    // },
    // {
    //     name: "Геркулес",
    //     districtId: 3,
    //     address: "Вул. Промислова, 9",
    //     sportType: sport_type.tennis,
    //     coveringType: covering_type.parquet,
    //     facilityType: facility_type.indoor,
    //     description: "Внутрішній тенісний корт з паркетним покриттям, ідеальний для річного круглого гри.",
    //     location: "48.478015, 35.013601",
    //     minBookingTime: 60,
    //     ownerId: 1
    // },
    // {
    //     name: "Вікторія",
    //     districtId: 3,
    //     address: "Проспект Слави, 6",
    //     sportType: sport_type.volleyball,
    //     coveringType: covering_type.artificial_lawn,
    //     facilityType: facility_type.outdoor,
    //     description: "Відкритий волейбольний майданчик з комфортабельним штучним покриттям.",
    //     location: "48.473002, 35.059701",
    //     minBookingTime: 120,
    //     ownerId: 1
    // },
    // {
    //     name: "Непереможний",
    //     districtId: 3,
    //     address: "Вул. Перемоги, 18",
    //     sportType: sport_type.soccer,
    //     coveringType: covering_type.natural_lawn,
    //     facilityType: facility_type.outdoor,
    //     description: "Зелене футбольне поле з натуральним газоном, ідеальне для місцевих турнірів.",
    //     location: "48.501788, 35.087002",
    //     minBookingTime: 90,
    //     ownerId: 1
    // },
    // {
    //     name: "Одіссей",
    //     districtId: 3,
    //     address: "Вул. Грецька, 20",
    //     sportType: sport_type.tennis,
    //     coveringType: covering_type.rubber,
    //     facilityType: facility_type.indoor,
    //     description: "Закритий тенісний корт з гумовим покриттям, забезпечує відмінне зчеплення.",
    //     location: "48.517980, 35.040001",
    //     minBookingTime: 60,
    //     ownerId: 1
    // },
    // {
    //     name: "Титан",
    //     districtId: 3,
    //     address: "Вул. Червоноармійська, 17",
    //     sportType: sport_type.basketball,
    //     coveringType: covering_type.parquet,
    //     facilityType: facility_type.indoor,
    //     description: "Сучасний критий баскетбольний майданчик для командних тренувань та змагань.",
    //     location: "48.467900, 35.054001",
    //     minBookingTime: 120,
    //     ownerId: 1
    // },
    // {
    //     name: "Олімпієць",
    //     districtId: 3,
    //     address: "Вул. Спортивна, 2",
    //     sportType: sport_type.volleyball,
    //     coveringType: covering_type.sand,
    //     facilityType: facility_type.outdoor,
    //     description: "Ідеальне місце для пляжного волейболу з професійним пісковим покриттям.",
    //     location: "48.471001, 35.046701",
    //     minBookingTime: 60,
    //     ownerId: 1
    // },
    // {
    //     name: "Київська Фортеця",
    //     districtId: 3,
    //     address: "Вул. Героїв, 13",
    //     sportType: sport_type.soccer,
    //     coveringType: covering_type.artificial_lawn,
    //     facilityType: facility_type.outdoor,
    //     description: "Просторе футбольне поле з штучним покриттям, підходить для різноманітних спортивних заходів.",
    //     location: "48.504910, 35.067001",
    //     minBookingTime: 90,
    //     ownerId: 1
    // },
    // {
    //     name: "Бриз",
    //     districtId: 3,
    //     address: "Вул. Корабельна, 16",
    //     sportType: sport_type.tennis,
    //     coveringType: covering_type.parquet,
    //     facilityType: facility_type.indoor,
    //     description: "Елітний тенісний клуб з якісним паркетом для професійних та любительських гравців.",
    //     location: "48.518880, 35.036001",
    //     minBookingTime: 60,
    //     ownerId: 1
    // },
    // {
    //     name: "Малина",
    //     districtId: 3,
    //     address: "Вул. Ягідна, 4",
    //     sportType: sport_type.basketball,
    //     coveringType: covering_type.rubber,
    //     facilityType: facility_type.indoor,
    //     description: "Ідеальний закритий майданчик для баскетболу з професійним покриттям.",
    //     location: "48.462880, 35.038001",
    //     minBookingTime: 120,
    //     ownerId: 1
    // },
    // {
    //     name: "Спартанець",
    //     districtId: 3,
    //     address: "Вул. Воїнів, 7",
    //     sportType: sport_type.volleyball,
    //     coveringType: covering_type.natural_lawn,
    //     facilityType: facility_type.outdoor,
    //     description: "Зелений волейбольний майданчик на свіжому повітрі з натуральним газоном.",
    //     location: "48.475880, 35.053001",
    //     minBookingTime: 60,
    //     ownerId: 1
    // },
    // {
    //     name: "Лідер",
    //     districtId: 3,
    //     address: "Вул. Воїнська, 23",
    //     sportType: sport_type.basketball,
    //     coveringType: covering_type.parquet,
    //     facilityType: facility_type.indoor,
    //     description: "Критий баскетбольний майданчик із професійним покриттям для інтенсивних ігор.",
    //     location: "48.470001, 35.051002",
    //     minBookingTime: 90,
    //     ownerId: 1
    // },
    // {
    //     name: "Атлант",
    //     districtId: 3,
    //     address: "Проспект Миру, 19",
    //     sportType: sport_type.tennis,
    //     coveringType: covering_type.rubber,
    //     facilityType: facility_type.outdoor,
    //     description: "Зовнішній тенісний корт із якісним гумовим покриттям, ідеально підходить для всіх рівнів гравців.",
    //     location: "48.506002, 35.079003",
    //     minBookingTime: 60,
    //     ownerId: 1
    // },
    // {
    //     name: "Фортуна",
    //     districtId: 3,
    //     address: "Вул. Берегова, 8",
    //     sportType: sport_type.soccer,
    //     coveringType: covering_type.natural_lawn,
    //     facilityType: facility_type.outdoor,
    //     description: "Футбольне поле на свіжому повітрі з натуральним газоном для любителів футболу.",
    //     location: "48.515003, 35.030004",
    //     minBookingTime: 120,
    //     ownerId: 1
    // },
    // {
    //     name: "Дельта",
    //     districtId: 3,
    //     address: "Вул. Річкова, 12",
    //     sportType: sport_type.volleyball,
    //     coveringType: covering_type.sand,
    //     facilityType: facility_type.outdoor,
    //     description: "Відкритий волейбольний майданчик з натуральним піском для пляжного волейболу.",
    //     location: "48.477004, 35.012005",
    //     minBookingTime: 60,
    //     ownerId: 1
    // },
    // {
    //     name: "Галактика",
    //     districtId: 3,
    //     address: "Проспект Космічний, 33",
    //     sportType: sport_type.basketball,
    //     coveringType: covering_type.rubber,
    //     facilityType: facility_type.indoor,
    //     description: "Сучасний критий баскетбольний майданчик із гумовим покриттям для безпечної гри.",
    //     location: "48.472005, 35.050006",
    //     minBookingTime: 90,
    //     ownerId: 1
    // },
    // {
    //     name: "Оріон",
    //     districtId: 3,
    //     address: "Вул. Зоряна, 21",
    //     sportType: sport_type.tennis,
    //     coveringType: covering_type.artificial_lawn,
    //     facilityType: facility_type.indoor,
    //     description: "Критий тенісний корт із штучним газоном, забезпечує комфортну гру в будь-яку погоду.",
    //     location: "48.508006, 35.078007",
    //     minBookingTime: 60,
    //     ownerId: 1
    // },
    // {
    //     name: "Зеніт",
    //     districtId: 3,
    //     address: "Вул. Морська, 17",
    //     sportType: sport_type.soccer,
    //     coveringType: covering_type.natural_lawn,
    //     facilityType: facility_type.outdoor,
    //     description: "Професійний футбольний майданчик з якісним натуральним газоном для змагань і тренувань.",
    //     location: "48.516007, 35.031008",
    //     minBookingTime: 120,
    //     ownerId: 1
    // },
    // {
    //     name: "Вавілон",
    //     districtId: 3,
    //     address: "Вул. Історична, 22",
    //     sportType: sport_type.volleyball,
    //     coveringType: covering_type.parquet,
    //     facilityType: facility_type.indoor,
    //     description: "Критий волейбольний зал з паркетним покриттям, ідеальний для проведення турнірів.",
    //     location: "48.479008, 35.013009",
    //     minBookingTime: 90,
    //     ownerId: 1
    // },
    // {
    //     name: "Фенікс",
    //     districtId: 3,
    //     address: "Вул. Перемоги, 30",
    //     sportType: sport_type.basketball,
    //     coveringType: covering_type.rubber,
    //     facilityType: facility_type.indoor,
    //     description: "Баскетбольний зал з високоякісним гумовим покриттям для комфортної гри.",
    //     location: "48.473009, 35.051010",
    //     minBookingTime: 60,
    //     ownerId: 1
    // },
    // {
    //     name: "Кентавр",
    //     districtId: 3,
    //     address: "Проспект Незалежності, 14",
    //     sportType: sport_type.tennis,
    //     coveringType: covering_type.artificial_lawn,
    //     facilityType: facility_type.outdoor,
    //     description: "Відкритий тенісний корт з штучним покриттям, підходить для гравців усіх рівнів.",
    //     location: "48.510010, 35.079011",
    //     minBookingTime: 90,
    //     ownerId: 1
    // },
    // {
    //     name: "Гермес",
    //     districtId: 3,
    //     address: "Вул. Торгова, 5",
    //     sportType: sport_type.soccer,
    //     coveringType: covering_type.natural_lawn,
    //     facilityType: facility_type.outdoor,
    //     description: "Футбольне поле для аматорських і професійних матчів з відмінним натуральним газоном.",
    //     location: "48.518011, 35.032012",
    //     minBookingTime: 120,
    //     ownerId: 1
    // },
    // {
    //     name: "Артеміда",
    //     districtId: 3,
    //     address: "Вул. Лісова, 19",
    //     sportType: sport_type.volleyball,
    //     coveringType: covering_type.sand,
    //     facilityType: facility_type.outdoor,
    //     description: "Пляжний волейбольний майданчик з якісним піском, ідеальний для літніх змагань.",
    //     location: "48.480012, 35.014013",
    //     minBookingTime: 60,
    //     ownerId: 1
    // },
    // {
    //     name: "Динамо",
    //     districtId: 3,
    //     address: "Проспект Військовий, 19",
    //     sportType: sport_type.soccer,
    //     coveringType: covering_type.natural_lawn,
    //     facilityType: facility_type.outdoor,
    //     description: "Просторе футбольне поле з натуральним газоном, ідеальне для командних ігор.",
    //     location: "48.474890, 35.058702",
    //     minBookingTime: 90,
    //     ownerId: 1
    // },
    // {
    //     name: "Галактика",
    //     districtId: 3,
    //     address: "Вул. Космічна, 27",
    //     sportType: sport_type.volleyball,
    //     coveringType: covering_type.sand,
    //     facilityType: facility_type.outdoor,
    //     description: "Сучасний волейбольний майданчик з пісковим покриттям для аматорських матчів.",
    //     location: "48.509801, 35.079901",
    //     minBookingTime: 60,
    //     ownerId: 1
    // },
    // {
    //     name: "Темп",
    //     districtId: 3,
    //     address: "Вул. Швидка, 5",
    //     sportType: sport_type.tennis,
    //     coveringType: covering_type.rubber,
    //     facilityType: facility_type.indoor,
    //     description: "Індор тенісний корт з професійним гумовим покриттям для змагань.",
    //     location: "48.518880, 35.034501",
    //     minBookingTime: 90,
    //     ownerId: 1
    // },
    // {
    //     name: "Фортуна",
    //     districtId: 3,
    //     address: "Вул. Щаслива, 16",
    //     sportType: sport_type.basketball,
    //     coveringType: covering_type.natural_lawn,
    //     facilityType: facility_type.outdoor,
    //     description: "Відкритий баскетбольний майданчик з натуральним покриттям для дружніх ігор.",
    //     location: "48.465901, 35.049002",
    //     minBookingTime: 120,
    //     ownerId: 1
    // },
    // {
    //     name: "Зірка",
    //     districtId: 3,
    //     address: "Вул. Космонавтів, 8",
    //     sportType: sport_type.volleyball,
    //     coveringType: covering_type.rubber,
    //     facilityType: facility_type.indoor,
    //     description: "Критий волейбольний майданчик з якісним гумовим покриттям для професійних ігор.",
    //     location: "48.473210, 35.056302",
    //     minBookingTime: 60,
    //     ownerId: 1
    // },
    // {
    //     name: "Перемога",
    //     districtId: 3,
    //     address: "Вул. Героїчна, 22",
    //     sportType: sport_type.soccer,
    //     coveringType: covering_type.artificial_lawn,
    //     facilityType: facility_type.outdoor,
    //     description: "Футбольний майданчик з штучним покриттям, ідеальний для молодіжних ліг.",
    //     location: "48.506902, 35.068302",
    //     minBookingTime: 90,
    //     ownerId: 1
    // },
    // {
    //     name: "Океан",
    //     districtId: 3,
    //     address: "Вул. Морська, 12",
    //     sportType: sport_type.tennis,
    //     coveringType: covering_type.parquet,
    //     facilityType: facility_type.indoor,
    //     description: "Елегантний закритий тенісний корт з паркетним покриттям для всіх рівнів гравців.",
    //     location: "48.519922, 35.031003",
    //     minBookingTime: 60,
    //     ownerId: 1
    // },
    // {
    //     name: "Рекорд",
    //     districtId: 3,
    //     address: "Вул. Спортивна, 34",
    //     sportType: sport_type.basketball,
    //     coveringType: covering_type.rubber,
    //     facilityType: facility_type.indoor,
    //     description: "Професійний баскетбольний зал з високоякісним гумовим покриттям.",
    //     location: "48.462901, 35.042003",
    //     minBookingTime: 120,
    //     ownerId: 1
    // },
    // {
    //     name: "Олімп",
    //     districtId: 3,
    //     address: "Проспект Героїв, 29",
    //     sportType: sport_type.volleyball,
    //     coveringType: covering_type.sand,
    //     facilityType: facility_type.outdoor,
    //     description: "Великий волейбольний майданчик з пісковим покриттям для аматорських ігор.",
    //     location: "48.475010, 35.058303",
    //     minBookingTime: 60,
    //     ownerId: 1
    // },
    // {
    //     name: "Екстрем",
    //     districtId: 3,
    //     address: "Вул. Екстремальна, 15",
    //     sportType: sport_type.soccer,
    //     coveringType: covering_type.natural_lawn,
    //     facilityType: facility_type.outdoor,
    //     description: "Футбольне поле з натуральним газоном, призначене для екстремальних футбольних матчів.",
    //     location: "48.508003, 35.075404",
    //     minBookingTime: 90,
    //     ownerId: 1
    // },
    // {
    //     name: "Квант",
    //     districtId: 3,
    //     address: "Вул. Наукова, 17",
    //     sportType: sport_type.tennis,
    //     coveringType: covering_type.rubber,
    //     facilityType: facility_type.indoor,
    //     description: "Сучасний закритий тенісний корт з гумовим покриттям для професійних турнірів.",
    //     location: "48.520933, 35.033504",
    //     minBookingTime: 60,
    //     ownerId: 1
    // },
    // {
    //     name: "Синій Дельфін",
    //     districtId: 3,
    //     address: "Вул. Хвильова, 18",
    //     sportType: sport_type.volleyball,
    //     coveringType: covering_type.sand,
    //     facilityType: facility_type.outdoor,
    //     description: "Відкритий майданчик для пляжного волейболу з видом на море, ідеальний для літніх турнірів.",
    //     location: "48.523001, 35.040004",
    //     minBookingTime: 60,
    //     ownerId: 1
    // },
    // {
    //     name: "Королівський Корт",
    //     districtId: 3,
    //     address: "Вул. Королівська, 22",
    //     sportType: sport_type.tennis,
    //     coveringType: covering_type.parquet,
    //     facilityType: facility_type.indoor,
    //     description: "Закритий тенісний корт з вишуканим паркетним покриттям для любителів та професіоналів.",
    //     location: "48.465002, 35.026701",
    //     minBookingTime: 90,
    //     ownerId: 1
    // },
    // {
    //     name: "Грім Футбольний Клуб",
    //     districtId: 3,
    //     address: "Проспект Спортивний, 11",
    //     sportType: sport_type.soccer,
    //     coveringType: covering_type.natural_lawn,
    //     facilityType: facility_type.outdoor,
    //     description: "Велике футбольне поле з натуральним газоном, підходить для шкільних та аматорських команд.",
    //     location: "48.472003, 35.056304",
    //     minBookingTime: 120,
    //     ownerId: 1
    // },
    // {
    //     name: "Морська Зірка",
    //     districtId: 3,
    //     address: "Вул. Морська, 27",
    //     sportType: sport_type.basketball,
    //     coveringType: covering_type.rubber,
    //     facilityType: facility_type.indoor,
    //     description: "Сучасний баскетбольний зал з гумовим покриттям, підходить для всіх вікових категорій.",
    //     location: "48.509804, 35.079902",
    //     minBookingTime: 90,
    //     ownerId: 1
    // },
    // {
    //     name: "Тихий Оазис",
    //     districtId: 3,
    //     address: "Вул. Тиха, 8",
    //     sportType: sport_type.tennis,
    //     coveringType: covering_type.artificial_lawn,
    //     facilityType: facility_type.outdoor,
    //     description: "Затишний тенісний корт зі штучним покриттям, розташований у тихому районі міста.",
    //     location: "48.518905, 35.034502",
    //     minBookingTime: 60,
    //     ownerId: 1
    // },
    // {
    //     name: "Золотий Гол",
    //     districtId: 3,
    //     address: "Вул. Переможна, 33",
    //     sportType: sport_type.soccer,
    //     coveringType: covering_type.rubber,
    //     facilityType: facility_type.indoor,
    //     description: "Критий футбольний майданчик з сучасним гумовим покриттям для тренувань у будь-яку погоду.",
    //     location: "48.470014, 35.020602",
    //     minBookingTime: 120,
    //     ownerId: 1
    // },
    // {
    //     name: "Арена Зірок",
    //     districtId: 3,
    //     address: "Вул. Океанська, 21",
    //     sportType: sport_type.basketball,
    //     coveringType: covering_type.parquet,
    //     facilityType: facility_type.indoor,
    //     description: "Високоякісний баскетбольний зал з паркетним покриттям для тренувань та змагань.",
    //     location: "48.520910, 35.041002",
    //     minBookingTime: 120,
    //     ownerId: 1
    // },
    // {
    //     name: "Тенісний Клуб Прем'єр",
    //     districtId: 3,
    //     address: "Вул. Гірська, 33",
    //     sportType: sport_type.tennis,
    //     coveringType: covering_type.artificial_lawn,
    //     facilityType: facility_type.outdoor,
    //     description: "Професійний тенісний корт на відкритому повітрі з штучним покриттям.",
    //     location: "48.470011, 35.020601",
    //     minBookingTime: 60,
    //     ownerId: 1
    // },
    // {
    //     name: "Футбольний Клуб Динамо",
    //     districtId: 3,
    //     address: "Проспект Військовий, 19",
    //     sportType: sport_type.soccer,
    //     coveringType: covering_type.natural_lawn,
    //     facilityType: facility_type.outdoor,
    //     description: "Просторе футбольне поле з натуральним газоном, ідеальне для командних ігор.",
    //     location: "48.474890, 35.058702",
    //     minBookingTime: 90,
    //     ownerId: 1
    // },
    // {
    //     name: "Волейбольний Комплекс Галактика",
    //     districtId: 3,
    //     address: "Вул. Космічна, 27",
    //     sportType: sport_type.volleyball,
    //     coveringType: covering_type.sand,
    //     facilityType: facility_type.outdoor,
    //     description: "Сучасний волейбольний майданчик з пісковим покриттям для аматорських матчів.",
    //     location: "48.509801, 35.079901",
    //     minBookingTime: 60,
    //     ownerId: 1
    // },
    // {
    //     name: "Тенісний Центр Темп",
    //     districtId: 3,
    //     address: "Вул. Швидка, 5",
    //     sportType: sport_type.tennis,
    //     coveringType: covering_type.rubber,
    //     facilityType: facility_type.indoor,
    //     description: "Індор тенісний корт з професійним гумовим покриттям для змагань.",
    //     location: "48.518880, 35.034501",
    //     minBookingTime: 90,
    //     ownerId: 1
    // },
    // {
    //     name: "Баскетбольний Клуб Фортуна",
    //     districtId: 3,
    //     address: "Вул. Щаслива, 16",
    //     sportType: sport_type.basketball,
    //     coveringType: covering_type.natural_lawn,
    //     facilityType: facility_type.outdoor,
    //     description: "Відкритий баскетбольний майданчик з натуральним покриттям для дружніх ігор.",
    //     location: "48.465901, 35.049002",
    //     minBookingTime: 120,
    //     ownerId: 1
    // },
    // {
    //     name: "Волейбольна Арена Зірка",
    //     districtId: 3,
    //     address: "Вул. Космонавтів, 8",
    //     sportType: sport_type.volleyball,
    //     coveringType: covering_type.rubber,
    //     facilityType: facility_type.indoor,
    //     description: "Критий волейбольний майданчик з якісним гумовим покриттям для професійних ігор.",
    //     location: "48.473210, 35.056302",
    //     minBookingTime: 60,
    //     ownerId: 1
    // },
    // {
    //     name: "Футбольна Арена Перемога",
    //     districtId: 3,
    //     address: "Вул. Героїчна, 22",
    //     sportType: sport_type.soccer,
    //     coveringType: covering_type.artificial_lawn,
    //     facilityType: facility_type.outdoor,
    //     description: "Футбольний майданчик з штучним покриттям, ідеальний для молодіжних ліг.",
    //     location: "48.506902, 35.068302",
    //     minBookingTime: 90,
    //     ownerId: 1
    // },
    // {
    //     name: "Тенісний Клуб Океан",
    //     districtId: 3,
    //     address: "Вул. Морська, 12",
    //     sportType: sport_type.tennis,
    //     coveringType: covering_type.parquet,
    //     facilityType: facility_type.indoor,
    //     description: "Елегантний закритий тенісний корт з паркетним покриттям для всіх рівнів гравців.",
    //     location: "48.519922, 35.031003",
    //     minBookingTime: 60,
    //     ownerId: 1
    // },
    // {
    //     name: "Баскетбольний Клуб Рекорд",
    //     districtId: 3,
    //     address: "Вул. Спортивна, 34",
    //     sportType: sport_type.basketball,
    //     coveringType: covering_type.rubber,
    //     facilityType: facility_type.indoor,
    //     description: "Професійний баскетбольний зал з високоякісним гумовим покриттям.",
    //     location: "48.462901, 35.042003",
    //     minBookingTime: 120,
    //     ownerId: 1
    // },

];
const roles = [
    { id: 1, value: 'USER', description: 'Usual user' },
    { id: 2, value: 'ADMIN', description: 'Admin user' },
    { id: 3, value: 'OWNER', description: 'Owner of the facility' },
];

const users = [
    {id:1, email:'test@example.com',
        password:'$2b$10$idiPBeBGGVCNd5VBt1JqxOmNQA/U7XO.GGCPMzKVu/zllvxFX7uMu',
        activationLink:'164ffe0c-d029-42c1-b964-5bf9d27c305f',
        createdAt: new Date(),
        updatedAt: new Date(),},
    {id:2, email:'test1@example.com',
        password:'$2b$10$idiPBeBGGVCNd5VBt1JqxOmNQA/U7XO.GGCPMzKVu/zllvxFX7uMu',
        activationLink:'164ffe0c-d029-42c1-b964-5bf9d27caaaa',
        createdAt: new Date(),
        updatedAt: new Date(),}
]

const cities = [
    { id: 1, name: 'Одеса', location:'46.470151, 30.730946'},
    { id: 2, name: 'Київ' },
    { id: 3, name: 'Дніпро' },
    { id: 4, name: 'Львів' },
    { id: 5, name: 'Харків' },
];

const districts = [
    { id: 1, name: 'Приморський', cityId:1, location:'46.466667, 30.750000' },
    { id: 2, name: 'Хаджибейський', cityId:1, location:'46.457806, 30.683306' },
    { id: 3, name: 'Пересипський', cityId:1, location:'46.525917, 30.728861' },
    { id: 4, name: 'Київський', cityId:1, location:'46.466670, 30.733330' },
    { id: 5, name: 'Голосіївський', cityId:2 },
    { id: 7, name: 'Оболонський', cityId:2 },
    { id: 8, name: 'Печерський', cityId:2 },
    { id: 9, name: 'Подільський', cityId:2 },
    { id: 10, name: 'Святошинський', cityId:2 },
    { id: 11, name: 'Солом\'янський', cityId:2 },
    { id: 12, name: 'Шевченківський', cityId:2 },
    { id: 13, name: 'Дарницький', cityId:2 },
    { id: 14, name: 'Деснянський', cityId:2 },
    { id: 16, name: 'Дніпровський', cityId:2 },
    { id: 17, name: 'Амур-Нижньодніпровський', cityId:3 },
    { id: 18, name: 'Індустріальний', cityId:3 },
    { id: 19, name: 'Новокодацький', cityId:3 },
    { id: 20, name: 'Самарський', cityId:3 },
    { id: 21, name: 'Соборний', cityId:3 },
    { id: 22, name: 'Центральний', cityId:3 },
    { id: 23, name: 'Чечелівський', cityId:3 },
    { id: 24, name: 'Шевченківський', cityId:4 },
    { id: 25, name: 'Личаківський', cityId:4 },
    { id: 26, name: 'Сихівський', cityId:4 },
    { id: 27, name: 'Франківський', cityId:4 },
    { id: 28, name: 'Залізничний' , cityId:4 },
    { id: 29, name: 'Галицький', cityId:4 },
    { id: 30, name: 'Холодногірський', cityId:5 },
    { id: 30, name: 'Шевченківський', cityId:5 },
    { id: 30, name: 'Київський', cityId:5 },
    { id: 30, name: 'Салтівський', cityId:5 },
    { id: 30, name: 'Немишлянський', cityId:5 },
    { id: 30, name: 'Індустріальний', cityId:5 },
    { id: 30, name: 'Слобідський', cityId:5 },
    { id: 30, name: 'Основ\'янський', cityId:5 },
    { id: 30, name: 'Новобаварський', cityId:5 },
]



async function main() {
    // Roles
    try {
        for (const role of roles) {
            const roleCreation = await prisma.role.create({
                data: role,
            });
            console.log(`Inserted role: ${roleCreation.value}`);
        }
    }catch (e){
        console.log('Roles were not created')
    }

    // Users
    try {
        for (const user of users) {
            const role = await prisma.role.findUnique({where:{value:'USER'}})

            const userCreation = await prisma.user.create({
                data: {
                    email: user.email,
                    password: user.password,
                    activationLink: user.activationLink,
                    avatar: null,
                    createdAt:user.createdAt,
                    updatedAt: user.updatedAt,
                    roles: {
                        connect:{
                            id: role.id
                        }
                    }
                },
                include: {
                    roles: true,
                },
            });
            console.log(`Inserted user: ${userCreation.email}`);
        }

    }catch (e){
        console.log('Users were not created')
    }

    // Cities
    try {
        for (const city of cities) {
            const cityCreation = await prisma.city.create({
                data: city,
            });
            console.log(`Inserted city: ${cityCreation.name}`);
        }
    }catch (e){
        console.log(e)
        console.log('Cities were not created')
    }

    // Districts
    try {
        for (const district of districts) {
            const districtCreation = await prisma.district.create({
                data: district,
            });
            console.log(`Inserted district: ${districtCreation.name}`);
        }
    }catch (e){
       // console.log(e)
        console.log('Districts were not created')
    }

    // Facilities
    try {
        for (const facility of facilitiesData) {
            const facilityCreation = await prisma.facility.create({
                data: facility,
            });
            console.log(`Inserted facility: ${facilityCreation.name}`);
        }
    }catch (e){
        console.log(e)
        console.log('Facilities were not created')
    }

}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
