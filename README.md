# Shipa Info

Информационный сайт на **Next.js** (деплой на **Vercel**) и **Telegram-бот** для добавления материалов. Данные хранятся в **MongoDB** на вашем сервере (Docker с постоянным томом).

## Архитектура

| Компонент | Где работает |
|-----------|----------------|
| Сайт (`/`, `/list`) | Vercel |
| API только на чтение (`GET /api/posts`) | Vercel |
| MongoDB | Сервер (Docker, volume `mongo_data`) |
| Telegram-бот | Сервер (long polling, пишет в MongoDB) |

Запись на сайт **только через бота** (список `TELEGRAM_ADMIN_IDS`). Публичного API для создания записей нет.

## Локальная разработка

1. Скопируйте переменные:

   ```bash
   cp .env.example .env
   ```

   Задайте надёжные пароли в `.env`.

2. Запустите MongoDB:

   ```bash
   npm run docker:up
   ```

3. Сайт:

   ```bash
   npm install
   npm run dev
   ```

   Откройте [http://localhost:3000](http://localhost:3000).

4. Бот (отдельный терминал):

   ```bash
   cp .env .env   # тот же .env или симлинк
   cd bot && npm install && npm run dev
   ```

## Работа с ботом

1. Создайте бота у [@BotFather](https://t.me/BotFather), токен в `TELEGRAM_BOT_TOKEN`.
2. Узнайте свой Telegram user id ([@userinfobot](https://t.me/userinfobot)) → `TELEGRAM_ADMIN_IDS`.
3. Отправьте боту текст:
   - **первая строка** — заголовок;
   - **остальные строки** — содержание.
4. Бот сохранит **черновик**. Команда **`/publish`** публикует последний черновик (или `/publish <mongo_id>`, или ответ `/publish` на сообщение бота с ID).
5. На сайте на главной — последняя опубликованная запись, на `/list` — весь список.

## MongoDB на сервере

1. Склонируйте репозиторий на сервер (например `/opt/shipa_info`).
2. Настройте `.env` (пароли, `MONGODB_URI` для локального доступа бота).
3. `docker compose up -d` — данные в volume `mongo_data` сохраняются при перезапуске.

**Безопасность (рекомендуется):**

- В `docker-compose.yml` по умолчанию порт `127.0.0.1:27017` — доступ только с сервера (бот на том же хосте).
- Если Vercel должен ходить в Mongo напрямую, откройте порт **только** для [IP Vercel](https://vercel.com/docs/security/firewall) или используйте VPN/SSH-туннель / MongoDB Atlas. Не выставляйте Mongo в интернет без firewall и сильных паролей.
- Отдельный пользователь приложения (`MONGO_APP_*`) с правами только на БД `shipa_info`.

## Деплой на Vercel

1. Импортируйте репозиторий в [Vercel](https://vercel.com/new).
2. **Environment variables** (Production **и** Preview, если нужно):
   - `MONGODB_URI` — URI к Mongo **на публичном IP/DNS сервера**, не `127.0.0.1`.
   - `MONGODB_DB_NAME` — `shipa_info` (если не задано в URI).
3. **Redeploy** после изменения переменных (Deployments → … → Redeploy).
4. Проверка: `https://ВАШ-ДОМЕН.vercel.app/api/health` → `{"mongo":"ok"}`.

### Почему Vercel не видит Mongo «на сервере»

По умолчанию в `docker-compose.yml` порт Mongo: **`127.0.0.1:27017`** — с интернета (и с Vercel) он **недоступен**. Это нормально для бота на том же сервере, но **не для Vercel**.

**На сервере:**

```bash
docker compose -f docker-compose.yml -f docker-compose.vercel-access.yml up -d
```

Откройте firewall **точечно** (пример UFW):

```bash
sudo ufw allow from ВАШ_IP to any port 27017 proto tcp
# или временно для проверки — потом сузить; лучше Atlas/VPN
```

**В Vercel → Settings → Environment Variables:**

```env
MONGODB_URI=mongodb://shipa_app:ПАРОЛЬ@123.45.67.89:27017/shipa_info?authSource=shipa_info
```

- `@123.45.67.89` — **внешний IP сервера**, не `localhost` / `127.0.0.1`.
- Спецсимволы в пароле — [URL-encode](https://www.urlencoder.org/) (`@` → `%40`, `#` → `%23`).
- Пароль должен совпадать с `MONGO_APP_PASSWORD` из `.env` на сервере.

**Типичные ошибки в `/api/health`:**

| Сообщение | Решение |
|-----------|---------|
| `MONGODB_URI is not set` | Добавить переменную в Vercel и redeploy |
| `connect ECONNREFUSED` | Mongo не слушает снаружи / firewall / неверный IP |
| `Authentication failed` | Неверный логин/пароль или нет `?authSource=shipa_info` |
| `timed out` | Порт 27017 закрыт провайдером или firewall |

Более безопасная альтернатива без открытия 27017 в интернет — **MongoDB Atlas** (бесплатный tier): тот же `MONGODB_URI` в Vercel и на сервере для бота.

Файл `vercel.json` не обязателен; при необходимости добавьте регион поближе к серверу с Mongo.

## Бот на сервере (systemd)

```bash
sudo cp deploy/shipa-info-bot.service /etc/systemd/system/
# Отредактируйте User, WorkingDirectory, EnvironmentFile
sudo systemctl daemon-reload
sudo systemctl enable --now shipa-info-bot
```

В `.env` на сервере для бота:

```env
MONGODB_URI=mongodb://shipa_app:PASSWORD@127.0.0.1:27017/shipa_info?authSource=shipa_info
TELEGRAM_BOT_TOKEN=...
TELEGRAM_ADMIN_IDS=...
```

## Переменные окружения

| Переменная | Где нужна | Описание |
|------------|-----------|----------|
| `MONGODB_URI` | Vercel, бот | Строка подключения MongoDB |
| `MONGODB_DB_NAME` | Vercel, бот | Имя БД (по умолчанию `shipa_info`) |
| `TELEGRAM_BOT_TOKEN` | Только бот | Токен от BotFather |
| `TELEGRAM_ADMIN_IDS` | Только бот | ID админов через запятую |
| `MONGO_*` | Только docker compose | Root и app-пользователь для init |
