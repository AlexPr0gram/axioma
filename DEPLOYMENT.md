# Публикация сайта АКСИОМА

Проверено 1 ноября 2026 года. Ничего не зарегистрировано и не опубликовано в рамках этой инструкции.

## Где лежат файлы

- Исходники: `/Users/aleksejvasilev/Documents/ChatGPT/Аксиома/axioma/`
- Готовый статический сайт: `/Users/aleksejvasilev/Documents/ChatGPT/Аксиома/axioma/dist/`
- Архив проекта: `/Users/aleksejvasilev/Documents/ChatGPT/Аксиома/axioma-site.zip`

В корне репозитория должны лежать `package.json`, `package-lock.json`, `astro.config.mjs`, `.npmrc`, `.gitignore`, папки `src` и `public`. `node_modules`, `.astro`, `.git` и локальные снимки предпросмотра загружать не нужно. `dist` генерируется сборкой и исключён из Git.

## Домены

Прямой запрос к WHOIS реестра `whois.tcinet.ru:43` дал:

| Имя | Ответ |
| --- | --- |
| hackermatrix.ru | No entries found — не зарегистрирован |
| hacker-matrix.ru | No entries found — не зарегистрирован |
| axioma-it.ru | No entries found — не зарегистрирован |
| axioma-tech.ru | No entries found — не зарегистрирован |
| aksioma-it.ru | No entries found — не зарегистрирован |
| aksioma-lab.ru | No entries found — не зарегистрирован |
| axioma-lab.ru | REGISTERED — занят |

Это снимок состояния реестра, а не резервирование или гарантия регистрации. Перед оплатой проверьте имя у регистратора ещё раз. Проверка регистрации не является проверкой товарных знаков.

Рекомендация: `axioma-it.ru` для компании, `hackermatrix.ru` для продукта. Если нужен один адрес для текущего корпоративного лендинга — `axioma-it.ru`. Для лендинга, ориентированного прежде всего на название продукта, — `hackermatrix.ru`. Вариант без дефиса лучше для названия HackerMatrix. `aksioma` соответствует транслитерации, но расходится с AXIOMA в фирменном написании.

Регистрировать на ООО «АКСИОМА» через корпоративный кабинет, включить автопродление. Сравнивать стоимость продления, а не только первого года. Домен .ru сам по себе не определяет страну размещения сайта или доступность у каждого российского оператора.

## Рекомендуемая схема

GitHub или GitFlic хранит исходники → российский хостинг собирает сайт → домен направлен на хостинг.

Практический вариант: GitFlic + Timeweb Cloud App Platform через Dockerfile. GitHub можно использовать вместо GitFlic с тем же проектом. В App Platform режим HTML/CSS/JS принимает готовый сайт, без команды сборки; для исходников Astro используем Dockerfile.

### 1. Создать репозиторий

На GitHub: New repository, имя `axioma-site`, доступ Private, без README и шаблонов.
На GitFlic: создать пустой приватный проект `axioma-site` и скопировать HTTPS- или SSH-адрес из интерфейса.

В Терминале:

```sh
cd '/Users/aleksejvasilev/Documents/ChatGPT/Аксиома/axioma'
git init -b main
git add .
git commit -m 'Initial Axioma website'
```

Затем выполните команду `git remote add origin ...` с точным адресом из созданного репозитория и:

```sh
git push -u origin main
```

Для GitHub HTTPS используйте поддерживаемый менеджер авторизации или токен, для GitFlic — способ авторизации из его интерфейса. Не добавляйте токен в код или адрес remote. Альтернатива — SSH-ключ.

### 2. Подготовить сборку на хостинге

Создайте в корне `Dockerfile`:

```dockerfile
FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV ASTRO_TELEMETRY_DISABLED=1
COPY package.json package-lock.json .npmrc ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

И `.dockerignore`:

```text
node_modules
dist
.astro
.git
.DS_Store
```

Это пример конфигурации для публикации; контейнер в текущей сессии не собирался. В production-контейнере работает только статический веб-сервер, Node нужен на этапе сборки. База данных не требуется.

Добавьте файлы и отправьте изменения:

```sh
git add Dockerfile .dockerignore
git commit -m 'Configure production deployment'
git push
```

### 3. Опубликовать через Timeweb Cloud

1. Откройте App Platform → создать приложение.
2. Подключите GitHub или укажите ссылку на репозиторий GitFlic. Для приватного GitFlic настройте доступ согласно инструкции провайдера.
3. Выберите ветку `main`, директорию проекта — корень репозитория.
4. Выберите способ сборки/фреймворк `Dockerfile`, файл `Dockerfile`, порт контейнера `80`.
5. Выберите российский регион, если он доступен в выбранном тарифе. Проверьте стоимость в панели до запуска.
6. Включите автодеплой при обновлении ветки и запустите публикацию.
7. Откройте технический домен, проверьте логотипы, галерею, увеличение скриншотов и реквизиты.

Не запускайте `npm run preview` как production-сервер. Он предназначен для локальной проверки.

### 4. Привязать домен

1. Зарегистрируйте выбранный домен.
2. В App Platform откройте приложение → настройки доменов → добавьте основной домен, затем `www` при необходимости.
3. В DNS-панели регистратора внесите записи, показанные App Platform. Значения зависят от вашего приложения: не используйте IP из чужого примера. Для корневого домена обычно используется A-запись, для `www` — запись, указанная хостингом.
4. Если оставляете DNS у регистратора, смена NS не нужна. Если переносите DNS на хостинг, предварительно перенесите существующие записи, особенно почтовые MX/TXT.
5. Дождитесь проверки DNS и выпуска бесплатного сертификата Let's Encrypt. Настройте основной адрес и переадресацию с www/без www.
6. Проверьте HTTPS, обе формы адреса, картинки и ссылки. Проверьте сайт с домашнего интернета и мобильной сети.

### 5. Указать основной адрес Astro

После выбора домена добавьте `site` в `astro.config.mjs`, например:

```js
export default defineConfig({
  site: 'https://axioma-it.ru',
  output: 'static',
  vite: { plugins: [tailwindcss()] },
});
```

Для собственного домена в корне `base` не нужен. Сейчас ресурсы сайта используют корневые пути `/images/...`, поэтому не публикуйте проект в подпапке без изменения путей.

После изменений: `npm run check`, `npm run build`, затем commit и push. При включённом автодеплое хостинг опубликует новую версию.

## Упрощённый способ без контейнера

Соберите локально `npm ci` и `npm run build`. Загрузите СОДЕРЖИМОЕ `dist/` в корень сайта на обычном российском статическом/виртуальном хостинге. `index.html` должен быть прямо в корне сайта, а не внутри папки `dist`. Репозиторий GitHub/GitFlic в этом случае хранит исходники; обновления сайта загружаются отдельно.

Для App Platform HTML/CSS/JS можно подключить отдельный репозиторий готовой сборки. Его корень должен содержать `index.html`, `_astro` и `images`. Это отличается от репозитория исходников Astro. Не выбирайте HTML/CSS/JS для исходников, рассчитывая, что платформа выполнит `npm run build`.

## Вариант GitHub Pages

Astro поддерживает публикацию статических сайтов через GitHub Actions. Официальная инструкция ниже содержит актуальный workflow. Settings → Pages → Source: GitHub Actions. Для собственного домена укажите `site`, оставьте сайт в корне, затем в Pages → Custom domain задайте домен.

DNS для корня по документации GitHub:

```text
A @ 185.199.108.153
A @ 185.199.109.153
A @ 185.199.110.153
A @ 185.199.111.153
CNAME www ИМЯ_АККАУНТА.github.io
```

Сначала настройте домен в GitHub, затем DNS. После проверки включите Enforce HTTPS. Для проекта по адресу `account.github.io/repo/` потребуется настройка `base` и путей ресурсов; текущий проект проще публиковать сразу на собственном домене.

GitHub Pages имеет ограничения на использование в качестве бесплатного хостинга бизнеса, коммерческих транзакций и SaaS. Для рабочего сайта компании рекомендую отдельный хостинг; GitHub при этом остаётся местом хранения кода. В документации GitFlic я не подтвердил наличие аналогичного встроенного Pages-хостинга, поэтому инструкция не предполагает, что репозиторий автоматически станет сайтом.

## Источники

- WHOIS реестра: https://tcinet.ru/whois/
- Подключение GitHub/GitFlic: https://timeweb.cloud/docs/apps/connecting-repositories
- Dockerfile: https://timeweb.cloud/docs/apps/deploying-with-dockerfile
- Режим готового статического сайта: https://timeweb.cloud/docs/apps/deploying-frontend-apps/static-website
- Домен: https://timeweb.cloud/docs/apps/domain
- SSL: https://timeweb.cloud/docs/apps/ssl-certificates
- Astro + GitHub Pages: https://docs.astro.build/en/guides/deploy/github/
- Домен GitHub Pages: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site
- Ограничения Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
