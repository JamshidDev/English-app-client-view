import type { WordSet, Word } from '@/types/vocabulary'

export const wordSets: WordSet[] = [
  // ========== BASIC SET 1 ==========
  {
    id: 1,
    titleUz: "Asosiy so'zlar - 1-to'plam",
    titleRu: "Базовые слова - Набор 1",
    titleEn: "Basic Words - Set 1",
    descriptionUz: "Eng ko'p ishlatiladigan oddiy so'zlar",
    descriptionRu: "Самые употребляемые простые слова",
    descriptionEn: "Most commonly used simple words",
    category: 'basic',
    level: 'easy',
    words: [
      { id: 1, word: "apple", transcription: "/ˈæp.əl/", translationUz: "olma", translationRu: "яблоко", exampleEn: "I eat an apple every day.", exampleUz: "Men har kuni olma yeyman.", exampleRu: "Я ем яблоко каждый день.", category: 'basic', level: 'easy' },
      { id: 2, word: "book", transcription: "/bʊk/", translationUz: "kitob", translationRu: "книга", exampleEn: "This book is very interesting.", exampleUz: "Bu kitob juda qiziqarli.", exampleRu: "Эта книга очень интересная.", category: 'basic', level: 'easy' },
      { id: 3, word: "chair", transcription: "/tʃer/", translationUz: "stul", translationRu: "стул", exampleEn: "Please sit on this chair.", exampleUz: "Iltimos, bu stulga o'tiring.", exampleRu: "Пожалуйста, сядьте на этот стул.", category: 'basic', level: 'easy' },
      { id: 4, word: "dog", transcription: "/dɔːɡ/", translationUz: "it", translationRu: "собака", exampleEn: "My dog is very friendly.", exampleUz: "Mening itim juda do'stona.", exampleRu: "Моя собака очень дружелюбная.", category: 'basic', level: 'easy' },
      { id: 5, word: "eat", transcription: "/iːt/", translationUz: "yemoq", translationRu: "есть", exampleEn: "I eat breakfast at 8 AM.", exampleUz: "Men nonushtani soat 8 da yeyman.", exampleRu: "Я завтракаю в 8 утра.", category: 'basic', level: 'easy' },
      { id: 6, word: "family", transcription: "/ˈfæm.əl.i/", translationUz: "oila", translationRu: "семья", exampleEn: "I love my family.", exampleUz: "Men oilamni sevaman.", exampleRu: "Я люблю свою семью.", category: 'basic', level: 'easy' },
      { id: 7, word: "good", transcription: "/ɡʊd/", translationUz: "yaxshi", translationRu: "хороший", exampleEn: "This is a good idea.", exampleUz: "Bu yaxshi fikr.", exampleRu: "Это хорошая идея.", category: 'basic', level: 'easy' },
      { id: 8, word: "house", transcription: "/haʊs/", translationUz: "uy", translationRu: "дом", exampleEn: "Our house is big.", exampleUz: "Bizning uyimiz katta.", exampleRu: "Наш дом большой.", category: 'basic', level: 'easy' },
      { id: 9, word: "ice", transcription: "/aɪs/", translationUz: "muz", translationRu: "лёд", exampleEn: "I need some ice for my drink.", exampleUz: "Ichimligim uchun muz kerak.", exampleRu: "Мне нужен лёд для напитка.", category: 'basic', level: 'easy' },
      { id: 10, word: "jump", transcription: "/dʒʌmp/", translationUz: "sakramoq", translationRu: "прыгать", exampleEn: "Children like to jump.", exampleUz: "Bolalar sakrashni yoqtiradilar.", exampleRu: "Дети любят прыгать.", category: 'basic', level: 'easy' },
      { id: 11, word: "key", transcription: "/kiː/", translationUz: "kalit", translationRu: "ключ", exampleEn: "I lost my key.", exampleUz: "Men kalitimni yo'qotdim.", exampleRu: "Я потерял свой ключ.", category: 'basic', level: 'easy' },
      { id: 12, word: "love", transcription: "/lʌv/", translationUz: "sevgi, sevmoq", translationRu: "любовь, любить", exampleEn: "I love learning English.", exampleUz: "Men ingliz tilini o'rganishni yaxshi ko'raman.", exampleRu: "Я люблю учить английский.", category: 'basic', level: 'easy' },
      { id: 13, word: "money", transcription: "/ˈmʌn.i/", translationUz: "pul", translationRu: "деньги", exampleEn: "Save your money.", exampleUz: "Pulingizni tejang.", exampleRu: "Копите свои деньги.", category: 'basic', level: 'easy' },
      { id: 14, word: "name", transcription: "/neɪm/", translationUz: "ism", translationRu: "имя", exampleEn: "What is your name?", exampleUz: "Ismingiz nima?", exampleRu: "Как вас зовут?", category: 'basic', level: 'easy' },
      { id: 15, word: "open", transcription: "/ˈəʊ.pən/", translationUz: "ochmoq", translationRu: "открывать", exampleEn: "Please open the door.", exampleUz: "Iltimos, eshikni oching.", exampleRu: "Пожалуйста, откройте дверь.", category: 'basic', level: 'easy' },
      { id: 16, word: "play", transcription: "/pleɪ/", translationUz: "o'ynamoq", translationRu: "играть", exampleEn: "Children play in the park.", exampleUz: "Bolalar bog'da o'ynaydilar.", exampleRu: "Дети играют в парке.", category: 'basic', level: 'easy' },
      { id: 17, word: "question", transcription: "/ˈkwes.tʃən/", translationUz: "savol", translationRu: "вопрос", exampleEn: "I have a question.", exampleUz: "Mening savolim bor.", exampleRu: "У меня есть вопрос.", category: 'basic', level: 'easy' },
      { id: 18, word: "read", transcription: "/riːd/", translationUz: "o'qimoq", translationRu: "читать", exampleEn: "I read books every night.", exampleUz: "Men har kecha kitob o'qiyman.", exampleRu: "Я читаю книги каждый вечер.", category: 'basic', level: 'easy' },
      { id: 19, word: "sun", transcription: "/sʌn/", translationUz: "quyosh", translationRu: "солнце", exampleEn: "The sun is bright today.", exampleUz: "Bugun quyosh yorqin.", exampleRu: "Сегодня солнце яркое.", category: 'basic', level: 'easy' },
      { id: 20, word: "table", transcription: "/ˈteɪ.bəl/", translationUz: "stol", translationRu: "стол", exampleEn: "Put it on the table.", exampleUz: "Uni stolga qo'ying.", exampleRu: "Положите это на стол.", category: 'basic', level: 'easy' }
    ]
  },

  // ========== BASIC SET 2 ==========
  {
    id: 2,
    titleUz: "Asosiy so'zlar - 2-to'plam",
    titleRu: "Базовые слова - Набор 2",
    titleEn: "Basic Words - Set 2",
    descriptionUz: "Kundalik hayotda kerak bo'ladigan so'zlar",
    descriptionRu: "Слова для повседневной жизни",
    descriptionEn: "Words for everyday life",
    category: 'basic',
    level: 'easy',
    words: [
      { id: 21, word: "water", transcription: "/ˈwɔː.tər/", translationUz: "suv", translationRu: "вода", exampleEn: "I drink water every day.", exampleUz: "Men har kuni suv ichaman.", exampleRu: "Я пью воду каждый день.", category: 'basic', level: 'easy' },
      { id: 22, word: "walk", transcription: "/wɔːk/", translationUz: "yurmoq", translationRu: "ходить", exampleEn: "I walk to school.", exampleUz: "Men maktabga piyoda boraman.", exampleRu: "Я хожу в школу пешком.", category: 'basic', level: 'easy' },
      { id: 23, word: "work", transcription: "/wɜːk/", translationUz: "ishlamoq", translationRu: "работать", exampleEn: "I work from home.", exampleUz: "Men uydan ishlayman.", exampleRu: "Я работаю из дома.", category: 'basic', level: 'easy' },
      { id: 24, word: "write", transcription: "/raɪt/", translationUz: "yozmoq", translationRu: "писать", exampleEn: "I write letters to my friend.", exampleUz: "Men do'stimga xat yozaman.", exampleRu: "Я пишу письма другу.", category: 'basic', level: 'easy' },
      { id: 25, word: "year", transcription: "/jɪər/", translationUz: "yil", translationRu: "год", exampleEn: "This year is special.", exampleUz: "Bu yil alohida.", exampleRu: "Этот год особенный.", category: 'basic', level: 'easy' },
      { id: 26, word: "young", transcription: "/jʌŋ/", translationUz: "yosh", translationRu: "молодой", exampleEn: "She is very young.", exampleUz: "U juda yosh.", exampleRu: "Она очень молодая.", category: 'basic', level: 'easy' },
      { id: 27, word: "zero", transcription: "/ˈzɪə.rəʊ/", translationUz: "nol", translationRu: "ноль", exampleEn: "Start from zero.", exampleUz: "Noldan boshlang.", exampleRu: "Начните с нуля.", category: 'basic', level: 'easy' },
      { id: 28, word: "time", transcription: "/taɪm/", translationUz: "vaqt", translationRu: "время", exampleEn: "What time is it?", exampleUz: "Soat necha?", exampleRu: "Который час?", category: 'basic', level: 'easy' },
      { id: 29, word: "today", transcription: "/təˈdeɪ/", translationUz: "bugun", translationRu: "сегодня", exampleEn: "Today is a good day.", exampleUz: "Bugun yaxshi kun.", exampleRu: "Сегодня хороший день.", category: 'basic', level: 'easy' },
      { id: 30, word: "school", transcription: "/skuːl/", translationUz: "maktab", translationRu: "школа", exampleEn: "I go to school.", exampleUz: "Men maktabga boraman.", exampleRu: "Я хожу в школу.", category: 'basic', level: 'easy' },
      { id: 31, word: "city", transcription: "/ˈsɪt.i/", translationUz: "shahar", translationRu: "город", exampleEn: "I live in a big city.", exampleUz: "Men katta shaharda yashayman.", exampleRu: "Я живу в большом городе.", category: 'basic', level: 'easy' },
      { id: 32, word: "country", transcription: "/ˈkʌn.tri/", translationUz: "mamlakat", translationRu: "страна", exampleEn: "Uzbekistan is my country.", exampleUz: "O'zbekiston mening mamlakatim.", exampleRu: "Узбекистан - моя страна.", category: 'basic', level: 'easy' },
      { id: 33, word: "friend", transcription: "/frend/", translationUz: "do'st", translationRu: "друг", exampleEn: "He is my best friend.", exampleUz: "U mening eng yaxshi do'stim.", exampleRu: "Он мой лучший друг.", category: 'basic', level: 'easy' },
      { id: 34, word: "food", transcription: "/fuːd/", translationUz: "ovqat", translationRu: "еда", exampleEn: "This food is delicious.", exampleUz: "Bu ovqat mazali.", exampleRu: "Эта еда вкусная.", category: 'basic', level: 'easy' },
      { id: 35, word: "morning", transcription: "/ˈmɔː.nɪŋ/", translationUz: "ertalab", translationRu: "утро", exampleEn: "Good morning!", exampleUz: "Xayrli tong!", exampleRu: "Доброе утро!", category: 'basic', level: 'easy' },
      { id: 36, word: "night", transcription: "/naɪt/", translationUz: "tun", translationRu: "ночь", exampleEn: "Good night!", exampleUz: "Xayrli tun!", exampleRu: "Спокойной ночи!", category: 'basic', level: 'easy' },
      { id: 37, word: "car", transcription: "/kɑːr/", translationUz: "mashina", translationRu: "машина", exampleEn: "I have a new car.", exampleUz: "Mening yangi mashinam bor.", exampleRu: "У меня новая машина.", category: 'basic', level: 'easy' },
      { id: 38, word: "phone", transcription: "/fəʊn/", translationUz: "telefon", translationRu: "телефон", exampleEn: "Call me on my phone.", exampleUz: "Menga telefon qiling.", exampleRu: "Позвоните мне.", category: 'basic', level: 'easy' },
      { id: 39, word: "happy", transcription: "/ˈhæp.i/", translationUz: "baxtli", translationRu: "счастливый", exampleEn: "I am very happy.", exampleUz: "Men juda baxtliman.", exampleRu: "Я очень счастлив.", category: 'basic', level: 'easy' },
      { id: 40, word: "help", transcription: "/help/", translationUz: "yordam", translationRu: "помощь", exampleEn: "Can you help me?", exampleUz: "Menga yordam bera olasizmi?", exampleRu: "Вы можете мне помочь?", category: 'basic', level: 'easy' }
    ]
  },

  // ========== INTERMEDIATE SET 1 ==========
  {
    id: 3,
    titleUz: "O'rta daraja - 1-to'plam",
    titleRu: "Средний уровень - Набор 1",
    titleEn: "Intermediate - Set 1",
    descriptionUz: "O'rta darajadagi so'zlar",
    descriptionRu: "Слова среднего уровня",
    descriptionEn: "Intermediate level words",
    category: 'intermediate',
    level: 'medium',
    words: [
      { id: 41, word: "achieve", transcription: "/əˈtʃiːv/", translationUz: "erishmoq", translationRu: "достигать", exampleEn: "You can achieve your goals.", exampleUz: "Siz maqsadlaringizga erishishingiz mumkin.", exampleRu: "Вы можете достичь своих целей.", category: 'intermediate', level: 'medium' },
      { id: 42, word: "opportunity", transcription: "/ˌɒp.əˈtʃuː.nə.ti/", translationUz: "imkoniyat", translationRu: "возможность", exampleEn: "This is a great opportunity.", exampleUz: "Bu ajoyib imkoniyat.", exampleRu: "Это отличная возможность.", category: 'intermediate', level: 'medium' },
      { id: 43, word: "experience", transcription: "/ɪkˈspɪə.ri.əns/", translationUz: "tajriba", translationRu: "опыт", exampleEn: "I have experience in this field.", exampleUz: "Men bu sohada tajribam bor.", exampleRu: "У меня есть опыт в этой области.", category: 'intermediate', level: 'medium' },
      { id: 44, word: "education", transcription: "/ˌedʒ.uˈkeɪ.ʃən/", translationUz: "ta'lim", translationRu: "образование", exampleEn: "Education is important.", exampleUz: "Ta'lim muhim.", exampleRu: "Образование важно.", category: 'intermediate', level: 'medium' },
      { id: 45, word: "decision", transcription: "/dɪˈsɪʒ.ən/", translationUz: "qaror", translationRu: "решение", exampleEn: "Make a decision now.", exampleUz: "Hozir qaror qabul qiling.", exampleRu: "Примите решение сейчас.", category: 'intermediate', level: 'medium' },
      { id: 46, word: "improve", transcription: "/ɪmˈpruːv/", translationUz: "yaxshilamoq", translationRu: "улучшать", exampleEn: "I want to improve my English.", exampleUz: "Men ingliz tilimni yaxshilamoqchiman.", exampleRu: "Я хочу улучшить свой английский.", category: 'intermediate', level: 'medium' },
      { id: 47, word: "develop", transcription: "/dɪˈvel.əp/", translationUz: "rivojlantirmoq", translationRu: "развивать", exampleEn: "Develop your skills.", exampleUz: "Ko'nikmalaringizni rivojlantiring.", exampleRu: "Развивайте свои навыки.", category: 'intermediate', level: 'medium' },
      { id: 48, word: "environment", transcription: "/ɪnˈvaɪ.rən.mənt/", translationUz: "atrof-muhit", translationRu: "окружающая среда", exampleEn: "Protect the environment.", exampleUz: "Atrof-muhitni himoya qiling.", exampleRu: "Защищайте окружающую среду.", category: 'intermediate', level: 'medium' },
      { id: 49, word: "successful", transcription: "/səkˈses.fəl/", translationUz: "muvaffaqiyatli", translationRu: "успешный", exampleEn: "He is a successful businessman.", exampleUz: "U muvaffaqiyatli biznesmen.", exampleRu: "Он успешный бизнесмен.", category: 'intermediate', level: 'medium' },
      { id: 50, word: "responsible", transcription: "/rɪˈspɒn.sə.bəl/", translationUz: "mas'ul", translationRu: "ответственный", exampleEn: "Be responsible for your actions.", exampleUz: "Xatti-harakatlaringiz uchun mas'ul bo'ling.", exampleRu: "Будьте ответственны за свои действия.", category: 'intermediate', level: 'medium' },
      { id: 51, word: "communicate", transcription: "/kəˈmjuː.nɪ.keɪt/", translationUz: "muloqot qilmoq", translationRu: "общаться", exampleEn: "We need to communicate better.", exampleUz: "Biz yaxshiroq muloqot qilishimiz kerak.", exampleRu: "Нам нужно лучше общаться.", category: 'intermediate', level: 'medium' },
      { id: 52, word: "understand", transcription: "/ˌʌn.dəˈstænd/", translationUz: "tushunmoq", translationRu: "понимать", exampleEn: "I understand your point.", exampleUz: "Men fikringizni tushunaman.", exampleRu: "Я понимаю вашу точку зрения.", category: 'intermediate', level: 'medium' },
      { id: 53, word: "necessary", transcription: "/ˈnes.ə.ser.i/", translationUz: "zarur", translationRu: "необходимый", exampleEn: "This is necessary for success.", exampleUz: "Bu muvaffaqiyat uchun zarur.", exampleRu: "Это необходимо для успеха.", category: 'intermediate', level: 'medium' },
      { id: 54, word: "available", transcription: "/əˈveɪ.lə.bəl/", translationUz: "mavjud", translationRu: "доступный", exampleEn: "Is this product available?", exampleUz: "Bu mahsulot mavjudmi?", exampleRu: "Этот продукт доступен?", category: 'intermediate', level: 'medium' },
      { id: 55, word: "different", transcription: "/ˈdɪf.ər.ənt/", translationUz: "boshqacha", translationRu: "разный", exampleEn: "We have different opinions.", exampleUz: "Bizning fikrlarimiz boshqacha.", exampleRu: "У нас разные мнения.", category: 'intermediate', level: 'medium' },
      { id: 56, word: "important", transcription: "/ɪmˈpɔː.tənt/", translationUz: "muhim", translationRu: "важный", exampleEn: "This is very important.", exampleUz: "Bu juda muhim.", exampleRu: "Это очень важно.", category: 'intermediate', level: 'medium' },
      { id: 57, word: "problem", transcription: "/ˈprɒb.ləm/", translationUz: "muammo", translationRu: "проблема", exampleEn: "We have a problem.", exampleUz: "Bizda muammo bor.", exampleRu: "У нас проблема.", category: 'intermediate', level: 'medium' },
      { id: 58, word: "solution", transcription: "/səˈluː.ʃən/", translationUz: "yechim", translationRu: "решение", exampleEn: "I found a solution.", exampleUz: "Men yechim topdim.", exampleRu: "Я нашёл решение.", category: 'intermediate', level: 'medium' },
      { id: 59, word: "practice", transcription: "/ˈpræk.tɪs/", translationUz: "mashq qilmoq", translationRu: "практиковать", exampleEn: "Practice makes perfect.", exampleUz: "Mashq qilsangiz, mukammallikka erishasiz.", exampleRu: "Практика ведёт к совершенству.", category: 'intermediate', level: 'medium' },
      { id: 60, word: "knowledge", transcription: "/ˈnɒl.ɪdʒ/", translationUz: "bilim", translationRu: "знание", exampleEn: "Knowledge is power.", exampleUz: "Bilim - kuch.", exampleRu: "Знание - сила.", category: 'intermediate', level: 'medium' }
    ]
  },

  // ========== TRAVEL SET ==========
  {
    id: 4,
    titleUz: "Sayohat - 1-to'plam",
    titleRu: "Путешествия - Набор 1",
    titleEn: "Travel - Set 1",
    descriptionUz: "Sayohat uchun zarur so'zlar",
    descriptionRu: "Необходимые слова для путешествий",
    descriptionEn: "Essential words for travel",
    category: 'travel',
    level: 'easy',
    words: [
      { id: 61, word: "airport", transcription: "/ˈeə.pɔːt/", translationUz: "aeroport", translationRu: "аэропорт", exampleEn: "The airport is far from here.", exampleUz: "Aeroport bu yerdan uzoqda.", exampleRu: "Аэропорт далеко отсюда.", category: 'travel', level: 'easy' },
      { id: 62, word: "ticket", transcription: "/ˈtɪk.ɪt/", translationUz: "chipta", translationRu: "билет", exampleEn: "I need to buy a ticket.", exampleUz: "Men chipta sotib olishim kerak.", exampleRu: "Мне нужно купить билет.", category: 'travel', level: 'easy' },
      { id: 63, word: "passport", transcription: "/ˈpɑːs.pɔːt/", translationUz: "pasport", translationRu: "паспорт", exampleEn: "Show me your passport.", exampleUz: "Pasportingizni ko'rsating.", exampleRu: "Покажите ваш паспорт.", category: 'travel', level: 'easy' },
      { id: 64, word: "hotel", transcription: "/həʊˈtel/", translationUz: "mehmonxona", translationRu: "отель", exampleEn: "The hotel is very nice.", exampleUz: "Mehmonxona juda yaxshi.", exampleRu: "Отель очень хороший.", category: 'travel', level: 'easy' },
      { id: 65, word: "luggage", transcription: "/ˈlʌɡ.ɪdʒ/", translationUz: "yuk, bagaj", translationRu: "багаж", exampleEn: "Where is my luggage?", exampleUz: "Mening yukim qayerda?", exampleRu: "Где мой багаж?", category: 'travel', level: 'easy' },
      { id: 66, word: "flight", transcription: "/flaɪt/", translationUz: "parvoz", translationRu: "рейс", exampleEn: "My flight is at 10 AM.", exampleUz: "Mening parvozim soat 10 da.", exampleRu: "Мой рейс в 10 утра.", category: 'travel', level: 'easy' },
      { id: 67, word: "reservation", transcription: "/ˌrez.əˈveɪ.ʃən/", translationUz: "bron qilish", translationRu: "бронирование", exampleEn: "I have a reservation.", exampleUz: "Menda bron bor.", exampleRu: "У меня есть бронь.", category: 'travel', level: 'easy' },
      { id: 68, word: "departure", transcription: "/dɪˈpɑː.tʃər/", translationUz: "jo'nash", translationRu: "отправление", exampleEn: "The departure time is 8 AM.", exampleUz: "Jo'nash vaqti soat 8.", exampleRu: "Время отправления - 8 утра.", category: 'travel', level: 'easy' },
      { id: 69, word: "arrival", transcription: "/əˈraɪ.vəl/", translationUz: "kelish", translationRu: "прибытие", exampleEn: "Arrival time is 5 PM.", exampleUz: "Kelish vaqti soat 5.", exampleRu: "Время прибытия - 5 вечера.", category: 'travel', level: 'easy' },
      { id: 70, word: "destination", transcription: "/ˌdes.tɪˈneɪ.ʃən/", translationUz: "manzil", translationRu: "пункт назначения", exampleEn: "What is your destination?", exampleUz: "Manzilingiz qayerda?", exampleRu: "Какой ваш пункт назначения?", category: 'travel', level: 'easy' },
      { id: 71, word: "tourist", transcription: "/ˈtʊə.rɪst/", translationUz: "sayyoh", translationRu: "турист", exampleEn: "Many tourists visit this place.", exampleUz: "Ko'p sayyohlar bu joyga tashrif buyurishadi.", exampleRu: "Много туристов посещают это место.", category: 'travel', level: 'easy' },
      { id: 72, word: "guide", transcription: "/ɡaɪd/", translationUz: "gid", translationRu: "гид", exampleEn: "The guide is very helpful.", exampleUz: "Gid juda yordamchi.", exampleRu: "Гид очень полезный.", category: 'travel', level: 'easy' },
      { id: 73, word: "map", transcription: "/mæp/", translationUz: "xarita", translationRu: "карта", exampleEn: "I need a map of the city.", exampleUz: "Menga shahar xaritasi kerak.", exampleRu: "Мне нужна карта города.", category: 'travel', level: 'easy' },
      { id: 74, word: "currency", transcription: "/ˈkʌr.ən.si/", translationUz: "valyuta", translationRu: "валюта", exampleEn: "What currency do they use?", exampleUz: "Ular qanday valyuta ishlatishadi?", exampleRu: "Какую валюту они используют?", category: 'travel', level: 'easy' },
      { id: 75, word: "exchange", transcription: "/ɪksˈtʃeɪndʒ/", translationUz: "ayirboshlash", translationRu: "обмен", exampleEn: "Where can I exchange money?", exampleUz: "Men qayerda pul ayirboshlay olaman?", exampleRu: "Где я могу обменять деньги?", category: 'travel', level: 'easy' },
      { id: 76, word: "visa", transcription: "/ˈviː.zə/", translationUz: "viza", translationRu: "виза", exampleEn: "Do I need a visa?", exampleUz: "Menga viza kerakmi?", exampleRu: "Мне нужна виза?", category: 'travel', level: 'easy' },
      { id: 77, word: "customs", transcription: "/ˈkʌs.təmz/", translationUz: "bojxona", translationRu: "таможня", exampleEn: "Go through customs.", exampleUz: "Bojxonadan o'ting.", exampleRu: "Пройдите через таможню.", category: 'travel', level: 'easy' },
      { id: 78, word: "boarding", transcription: "/ˈbɔː.dɪŋ/", translationUz: "samolyotga chiqish", translationRu: "посадка", exampleEn: "Boarding starts at 9 AM.", exampleUz: "Samolyotga chiqish soat 9 da boshlanadi.", exampleRu: "Посадка начинается в 9 утра.", category: 'travel', level: 'easy' },
      { id: 79, word: "suitcase", transcription: "/ˈsuːt.keɪs/", translationUz: "chamadon", translationRu: "чемодан", exampleEn: "My suitcase is heavy.", exampleUz: "Mening chamadonim og'ir.", exampleRu: "Мой чемодан тяжёлый.", category: 'travel', level: 'easy' },
      { id: 80, word: "journey", transcription: "/ˈdʒɜː.ni/", translationUz: "sayohat", translationRu: "путешествие", exampleEn: "Have a safe journey!", exampleUz: "Xavfsiz sayohat!", exampleRu: "Хорошего путешествия!", category: 'travel', level: 'easy' }
    ]
  },

  // ========== BUSINESS SET ==========
  {
    id: 5,
    titleUz: "Biznes - 1-to'plam",
    titleRu: "Бизнес - Набор 1",
    titleEn: "Business - Set 1",
    descriptionUz: "Biznes uchun zarur so'zlar",
    descriptionRu: "Необходимые слова для бизнеса",
    descriptionEn: "Essential business vocabulary",
    category: 'business',
    level: 'medium',
    words: [
      { id: 81, word: "meeting", transcription: "/ˈmiː.tɪŋ/", translationUz: "uchrashuv", translationRu: "встреча", exampleEn: "We have a meeting at 3 PM.", exampleUz: "Bizda soat 3 da uchrashuv bor.", exampleRu: "У нас встреча в 3 часа.", category: 'business', level: 'medium' },
      { id: 82, word: "contract", transcription: "/ˈkɒn.trækt/", translationUz: "shartnoma", translationRu: "контракт", exampleEn: "Please sign the contract.", exampleUz: "Iltimos, shartnomani imzolang.", exampleRu: "Пожалуйста, подпишите контракт.", category: 'business', level: 'medium' },
      { id: 83, word: "salary", transcription: "/ˈsæl.ər.i/", translationUz: "maosh", translationRu: "зарплата", exampleEn: "My salary is paid monthly.", exampleUz: "Maoshim har oy to'lanadi.", exampleRu: "Моя зарплата выплачивается ежемесячно.", category: 'business', level: 'medium' },
      { id: 84, word: "deadline", transcription: "/ˈded.laɪn/", translationUz: "muddat", translationRu: "срок", exampleEn: "The deadline is tomorrow.", exampleUz: "Muddat ertaga.", exampleRu: "Срок - завтра.", category: 'business', level: 'medium' },
      { id: 85, word: "colleague", transcription: "/ˈkɒl.iːɡ/", translationUz: "hamkasb", translationRu: "коллега", exampleEn: "My colleague is very helpful.", exampleUz: "Hamkasbim juda yordamchi.", exampleRu: "Мой коллега очень полезный.", category: 'business', level: 'medium' },
      { id: 86, word: "manager", transcription: "/ˈmæn.ɪ.dʒər/", translationUz: "menejer", translationRu: "менеджер", exampleEn: "The manager is in a meeting.", exampleUz: "Menejer uchrashuvda.", exampleRu: "Менеджер на встрече.", category: 'business', level: 'medium' },
      { id: 87, word: "project", transcription: "/ˈprɒdʒ.ekt/", translationUz: "loyiha", translationRu: "проект", exampleEn: "This project is important.", exampleUz: "Bu loyiha muhim.", exampleRu: "Этот проект важен.", category: 'business', level: 'medium' },
      { id: 88, word: "client", transcription: "/ˈklaɪ.ənt/", translationUz: "mijoz", translationRu: "клиент", exampleEn: "The client is satisfied.", exampleUz: "Mijoz mamnun.", exampleRu: "Клиент доволен.", category: 'business', level: 'medium' },
      { id: 89, word: "profit", transcription: "/ˈprɒf.ɪt/", translationUz: "foyda", translationRu: "прибыль", exampleEn: "The company made a profit.", exampleUz: "Kompaniya foyda oldi.", exampleRu: "Компания получила прибыль.", category: 'business', level: 'medium' },
      { id: 90, word: "investment", transcription: "/ɪnˈvest.mənt/", translationUz: "investitsiya", translationRu: "инвестиция", exampleEn: "This is a good investment.", exampleUz: "Bu yaxshi investitsiya.", exampleRu: "Это хорошая инвестиция.", category: 'business', level: 'medium' },
      { id: 91, word: "budget", transcription: "/ˈbʌdʒ.ɪt/", translationUz: "byudjet", translationRu: "бюджет", exampleEn: "We need to review the budget.", exampleUz: "Biz byudjetni ko'rib chiqishimiz kerak.", exampleRu: "Нам нужно пересмотреть бюджет.", category: 'business', level: 'medium' },
      { id: 92, word: "report", transcription: "/rɪˈpɔːt/", translationUz: "hisobot", translationRu: "отчёт", exampleEn: "I need to write a report.", exampleUz: "Men hisobot yozishim kerak.", exampleRu: "Мне нужно написать отчёт.", category: 'business', level: 'medium' },
      { id: 93, word: "strategy", transcription: "/ˈstræt.ə.dʒi/", translationUz: "strategiya", translationRu: "стратегия", exampleEn: "We need a new strategy.", exampleUz: "Bizga yangi strategiya kerak.", exampleRu: "Нам нужна новая стратегия.", category: 'business', level: 'medium' },
      { id: 94, word: "negotiate", transcription: "/nɪˈɡəʊ.ʃi.eɪt/", translationUz: "muzokara qilmoq", translationRu: "вести переговоры", exampleEn: "We need to negotiate the price.", exampleUz: "Biz narxni muhokama qilishimiz kerak.", exampleRu: "Нам нужно обсудить цену.", category: 'business', level: 'medium' },
      { id: 95, word: "partnership", transcription: "/ˈpɑːt.nə.ʃɪp/", translationUz: "hamkorlik", translationRu: "партнёрство", exampleEn: "Let's build a partnership.", exampleUz: "Keling, hamkorlik qilaylik.", exampleRu: "Давайте построим партнёрство.", category: 'business', level: 'medium' },
      { id: 96, word: "competition", transcription: "/ˌkɒm.pəˈtɪʃ.ən/", translationUz: "raqobat", translationRu: "конкуренция", exampleEn: "The competition is strong.", exampleUz: "Raqobat kuchli.", exampleRu: "Конкуренция сильная.", category: 'business', level: 'medium' },
      { id: 97, word: "marketing", transcription: "/ˈmɑː.kɪ.tɪŋ/", translationUz: "marketing", translationRu: "маркетинг", exampleEn: "Marketing is very important.", exampleUz: "Marketing juda muhim.", exampleRu: "Маркетинг очень важен.", category: 'business', level: 'medium' },
      { id: 98, word: "revenue", transcription: "/ˈrev.ən.juː/", translationUz: "daromad", translationRu: "доход", exampleEn: "Revenue increased this year.", exampleUz: "Bu yil daromad oshdi.", exampleRu: "Доход вырос в этом году.", category: 'business', level: 'medium' },
      { id: 99, word: "employee", transcription: "/ɪmˈplɔɪ.iː/", translationUz: "xodim", translationRu: "сотрудник", exampleEn: "We have 50 employees.", exampleUz: "Bizda 50 ta xodim bor.", exampleRu: "У нас 50 сотрудников.", category: 'business', level: 'medium' },
      { id: 100, word: "entrepreneur", transcription: "/ˌɒn.trə.prəˈnɜːr/", translationUz: "tadbirkor", translationRu: "предприниматель", exampleEn: "He is a successful entrepreneur.", exampleUz: "U muvaffaqiyatli tadbirkor.", exampleRu: "Он успешный предприниматель.", category: 'business', level: 'medium' }
    ]
  },

  // ========== IELTS SET ==========
  {
    id: 6,
    titleUz: "IELTS - 1-to'plam",
    titleRu: "IELTS - Набор 1",
    titleEn: "IELTS - Set 1",
    descriptionUz: "IELTS imtihoni uchun so'zlar",
    descriptionRu: "Слова для экзамена IELTS",
    descriptionEn: "Words for IELTS exam",
    category: 'ielts',
    level: 'ielts',
    words: [
      { id: 101, word: "phenomenon", transcription: "/fəˈnɒm.ɪ.nən/", translationUz: "hodisa", translationRu: "феномен", exampleEn: "This is a natural phenomenon.", exampleUz: "Bu tabiiy hodisa.", exampleRu: "Это природный феномен.", category: 'ielts', level: 'ielts' },
      { id: 102, word: "significant", transcription: "/sɪɡˈnɪf.ɪ.kənt/", translationUz: "muhim, sezilarli", translationRu: "значительный", exampleEn: "There was a significant change.", exampleUz: "Sezilarli o'zgarish bo'ldi.", exampleRu: "Произошло значительное изменение.", category: 'ielts', level: 'ielts' },
      { id: 103, word: "approximately", transcription: "/əˈprɒk.sɪ.mət.li/", translationUz: "taxminan", translationRu: "приблизительно", exampleEn: "It costs approximately $100.", exampleUz: "Bu taxminan 100 dollar turadi.", exampleRu: "Это стоит приблизительно $100.", category: 'ielts', level: 'ielts' },
      { id: 104, word: "consequently", transcription: "/ˈkɒn.sɪ.kwənt.li/", translationUz: "natijada", translationRu: "следовательно", exampleEn: "Consequently, we need to change.", exampleUz: "Natijada, biz o'zgarishimiz kerak.", exampleRu: "Следовательно, нам нужно измениться.", category: 'ielts', level: 'ielts' },
      { id: 105, word: "nevertheless", transcription: "/ˌnev.ə.ðəˈles/", translationUz: "shunga qaramay", translationRu: "тем не менее", exampleEn: "Nevertheless, we succeeded.", exampleUz: "Shunga qaramay, biz muvaffaq bo'ldik.", exampleRu: "Тем не менее, мы преуспели.", category: 'ielts', level: 'ielts' },
      { id: 106, word: "furthermore", transcription: "/ˌfɜː.ðəˈmɔːr/", translationUz: "bundan tashqari", translationRu: "более того", exampleEn: "Furthermore, it is cheaper.", exampleUz: "Bundan tashqari, bu arzonroq.", exampleRu: "Более того, это дешевле.", category: 'ielts', level: 'ielts' },
      { id: 107, word: "whereas", transcription: "/weərˈæz/", translationUz: "holbuki", translationRu: "тогда как", exampleEn: "I like tea, whereas she likes coffee.", exampleUz: "Men choyni yoqtiraman, holbuki u qahvani yoqtiradi.", exampleRu: "Я люблю чай, тогда как она любит кофе.", category: 'ielts', level: 'ielts' },
      { id: 108, word: "predominantly", transcription: "/prɪˈdɒm.ɪ.nənt.li/", translationUz: "asosan", translationRu: "преимущественно", exampleEn: "The area is predominantly rural.", exampleUz: "Bu hudud asosan qishloq.", exampleRu: "Этот район преимущественно сельский.", category: 'ielts', level: 'ielts' },
      { id: 109, word: "sustainable", transcription: "/səˈsteɪ.nə.bəl/", translationUz: "barqaror", translationRu: "устойчивый", exampleEn: "We need sustainable development.", exampleUz: "Bizga barqaror rivojlanish kerak.", exampleRu: "Нам нужно устойчивое развитие.", category: 'ielts', level: 'ielts' },
      { id: 110, word: "infrastructure", transcription: "/ˈɪn.frəˌstrʌk.tʃər/", translationUz: "infratuzilma", translationRu: "инфраструктура", exampleEn: "The infrastructure is developing.", exampleUz: "Infratuzilma rivojlanmoqda.", exampleRu: "Инфраструктура развивается.", category: 'ielts', level: 'ielts' },
      { id: 111, word: "hypothesis", transcription: "/haɪˈpɒθ.ə.sɪs/", translationUz: "gipoteza", translationRu: "гипотеза", exampleEn: "The hypothesis was proven.", exampleUz: "Gipoteza isbotlandi.", exampleRu: "Гипотеза была доказана.", category: 'ielts', level: 'ielts' },
      { id: 112, word: "criteria", transcription: "/kraɪˈtɪə.ri.ə/", translationUz: "mezonlar", translationRu: "критерии", exampleEn: "What are the criteria?", exampleUz: "Mezonlar qanday?", exampleRu: "Какие критерии?", category: 'ielts', level: 'ielts' },
      { id: 113, word: "analysis", transcription: "/əˈnæl.ə.sɪs/", translationUz: "tahlil", translationRu: "анализ", exampleEn: "The analysis showed results.", exampleUz: "Tahlil natijalarni ko'rsatdi.", exampleRu: "Анализ показал результаты.", category: 'ielts', level: 'ielts' },
      { id: 114, word: "perspective", transcription: "/pəˈspek.tɪv/", translationUz: "nuqtai nazar", translationRu: "перспектива", exampleEn: "From my perspective, it's good.", exampleUz: "Mening nuqtai nazarimdan, bu yaxshi.", exampleRu: "С моей точки зрения, это хорошо.", category: 'ielts', level: 'ielts' },
      { id: 115, word: "demonstrate", transcription: "/ˈdem.ən.streɪt/", translationUz: "ko'rsatmoq", translationRu: "демонстрировать", exampleEn: "I will demonstrate the process.", exampleUz: "Men jarayonni ko'rsataman.", exampleRu: "Я продемонстрирую процесс.", category: 'ielts', level: 'ielts' },
      { id: 116, word: "conclude", transcription: "/kənˈkluːd/", translationUz: "xulosa qilmoq", translationRu: "заключить", exampleEn: "We can conclude that...", exampleUz: "Biz xulosa qilishimiz mumkinki...", exampleRu: "Мы можем заключить, что...", category: 'ielts', level: 'ielts' },
      { id: 117, word: "emphasize", transcription: "/ˈem.fə.saɪz/", translationUz: "ta'kidlamoq", translationRu: "подчёркивать", exampleEn: "I want to emphasize this point.", exampleUz: "Men bu fikrni ta'kidlamoqchiman.", exampleRu: "Я хочу подчеркнуть этот момент.", category: 'ielts', level: 'ielts' },
      { id: 118, word: "controversial", transcription: "/ˌkɒn.trəˈvɜː.ʃəl/", translationUz: "bahsli", translationRu: "спорный", exampleEn: "This is a controversial topic.", exampleUz: "Bu bahsli mavzu.", exampleRu: "Это спорная тема.", category: 'ielts', level: 'ielts' },
      { id: 119, word: "substantial", transcription: "/səbˈstæn.ʃəl/", translationUz: "sezilarli", translationRu: "существенный", exampleEn: "There was substantial growth.", exampleUz: "Sezilarli o'sish bo'ldi.", exampleRu: "Был существенный рост.", category: 'ielts', level: 'ielts' },
      { id: 120, word: "perception", transcription: "/pəˈsep.ʃən/", translationUz: "idrok", translationRu: "восприятие", exampleEn: "Perception varies among people.", exampleUz: "Idrok odamlar orasida farq qiladi.", exampleRu: "Восприятие различается у людей.", category: 'ielts', level: 'ielts' }
    ]
  }
]

export const categories = [
  { key: 'basic', labelKey: 'vocabulary.categories.basic' },
  { key: 'intermediate', labelKey: 'vocabulary.categories.intermediate' },
  { key: 'advanced', labelKey: 'vocabulary.categories.advanced' },
  { key: 'ielts', labelKey: 'vocabulary.categories.ielts' },
  { key: 'travel', labelKey: 'vocabulary.categories.travel' },
  { key: 'business', labelKey: 'vocabulary.categories.business' },
  { key: 'it', labelKey: 'vocabulary.categories.it' },
  { key: 'daily', labelKey: 'vocabulary.categories.daily' }
]
