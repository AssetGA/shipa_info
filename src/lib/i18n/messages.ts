import type { Locale } from "./locale";

const messages = {
  ru: {
    siteName: "Shipa Info",
    navList: "Весь список",
    homeTitle: "Информация для сотрудников Шипагер",
    homeSubtitle:
      "Последняя опубликованная запись. Полный архив — кнопкой ниже.",
    loadError: "Не удалось загрузить данные. Проверьте подключение к MongoDB.",
    emptyPost:
      "Пока нет опубликованных записей. Добавьте материал через Telegram-бота.",
    refresh: "Обновить",
    refreshing: "Загрузка...",
    viewAllList: "Посмотреть весь список информации",
    backHome: "← На главную",
    listTitle: "Весь список информации",
    listSubtitle: "Все опубликованные записи, от новых к старым.",
    listLoadError: "Не удалось загрузить список. Проверьте MongoDB.",
    listEmpty: "Записей пока нет.",
    langRu: "Рус",
    langKk: "Қаз",
    langSwitchLabel: "Язык интерфейса",
    postLangRu: "Русский",
    postLangKk: "Қазақша",
    postStoredNote: "В базе хранится только русский текст.",
    translationPending: "Перевод на казахский...",
    translationFailed: "Перевод временно недоступен, показан русский текст.",
  },
  kk: {
    siteName: "Shipa Info",
    navList: "Барлық тізім",
    homeTitle: "Шипагер қызметкерлері үшін ақпарат",
    homeSubtitle:
      "Соңғы жарияланған жазба. Толық мұрағат — төмендегі батырмамен.",
    loadError: "Деректер жүктелмеді. MongoDB қосылымын тексеріңіз.",
    emptyPost:
      "Жарияланған жазбалар әлі жоқ. Telegram-бот арқылы материал қосыңыз.",
    refresh: "Жаңарту",
    refreshing: "Жүктелуде...",
    viewAllList: "Барлық ақпарат тізімін қарау",
    backHome: "← Басты бет",
    listTitle: "Бүкіл ақпарат тізімі",
    listSubtitle: "Барлық жарияланған жазбалар, жаңадан ескіге.",
    listLoadError: "Тізім жүктелмеді. MongoDB қосылымын тексеріңіз.",
    listEmpty: "Жазбалар әлі жоқ.",
    langRu: "Рус",
    langKk: "Қаз",
    langSwitchLabel: "Интерфейс тілі",
    postLangRu: "Орысша",
    postLangKk: "Қазақша",
    postStoredNote: "Дерекқорда тек орысша мәтін сақталады.",
    translationPending: "Қазақша аударма...",
    translationFailed: "Аударма уақытша қолжетімсіз, орысша көрсетілуде.",
  },
};

export type MessageKey = keyof (typeof messages)["ru"];
export type Messages = Record<MessageKey, string>;

export function getMessages(locale: Locale): Messages {
  return messages[locale];
}
