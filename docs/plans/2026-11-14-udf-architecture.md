# Tribune → атомарная система UDF + сборка Vite: план

> **Для исполнителя:** выполнять по задачам через superpowers:executing-plans (или subagent-driven-development). Шаги отмечены чекбоксами `- [ ]`.

**Цель:** разложить сайт Tribune по слоям атомарного дизайна, как в arkhipovau/Design-Culture (tokens → quarks → atoms → molecules → organisms → superorganisms → templates → bundles). Сайт при этом должен выглядеть и работать пиксель в пиксель как сейчас, а грузиться быстрее.

**Архитектура:** код переезжает в `src/udf/<слой>/<имя>/` с префиксами `q- a- m- o- s- t-`, как в Design-Culture. Подключение отличается: у Design-Culture стили идут цепочкой `@import` прямо в браузер, без сборки (десятки последовательных запросов). У нас Vite собирает на каждую страницу один CSS и один JS с хешем в имени. Шапку и футер страницы берут из шаблона, а не копируют. Сайт выкладывается на GitHub Pages через GitHub Actions из папки `dist/`.

**Технологии:** Vite 8 (multi-page), ES-модули вместо IIFE и `window.*`, `vite-plugin-handlebars` для шаблонов и партиалов, Playwright для визуальной регрессии, three.js и Babylon.js из npm.

**Скиллы:** `superpowers:writing-plans` (структура плана), `vite-patterns` (сборка, задачи 2, 7, 9), `benchmark` (замеры до и после, задачи 1 и 10), `design-system` (три слоя токенов и проверка значений в коде, задачи 3–5 и 10).

**Основа:** этот план. Отдельного документа ТЗ нет. Правила дизайна взяты из `CLAUDE.md` (раздел «Правила дизайна»), структура — из `Design-Culture/src/udf/README.md`.

## Глобальные ограничения

- Внешний вид и поведение не меняются. Любое отличие на скриншоте больше 0,1% пикселей считается регрессией.
- Правила дизайна из `CLAUDE.md` действуют без исключений: без курсива, пилюли скруглены на 1000px с отступом 4px, без обводок фокуса, текст не меньше 12px, боковой отступ `--gutter` 38px (16px на телефоне).
- Именование как в Design-Culture: папка `{слой}/{имя}/`, файл `{префикс}-{имя}.css|js`, элементы по BEM (`m-post__media`), состояния через `.is-active`. У каждого компонента есть `README.md`: разметка, зависимости, где используется.
- `stadium-src/src/stadium.ts` в ветке `3d-stadium` принадлежит 3D-модельщику. Внутреннюю логику модуля не трогаем, сайт только импортирует `mountStadium`.
- Модели GLB не пересжимаем без согласования с модельщиком и Julie (правило проекта стадиона).
- `main` всегда рабочий. Вся работа идёт в ветке `udf`, в `main` она попадает только после полной проверки (задача 11).

## Что проверяем вручную (Review Focus)

1. **Скролл-сцены** (окно стадиона, прилипающий How it works, проявление слов манифеста): скриншоты в покое их не ловят. Нужны отдельные тесты с прокруткой к позициям 0, 25, 50, 75 и 100% каждой сцены.
2. **Путь сайта `/tribune/`** на GitHub Pages: ассеты, модели и ссылки `team.html?id=` должны работать из подпапки, а не только с `localhost:5173/`.
3. **Переход по меню** (затухание и прыжок) и стрелка в открытый стадион должны работать после переезда JS в модули.
4. **Телефон 375px:** мобильные правила сейчас разбросаны по `@media` в конце `style.css`. После раскладки по компонентам их легко потерять.
5. **Кэш:** после перехода на хеши в именах старые `?v=` не нужны, но нельзя сломать заход по старым ссылкам на `/index.html`, `/teams.html` и т. д.

Каждый пункт закрывается тестом в задаче, которая отвечает за этот код (см. задачи 1, 2, 8, 9).

---

## Структура после переезда

```
src/
  pages/            index.html, teams.html, team.html, about.html (только разметка страницы)
  udf/
    tokens/         colors.css, typography.css, grid.css, motion.css, site.css
    quarks/         icons/*.svg, fonts/fonts.css
    atoms/          button, round-btn, pill, link-under, label, display, pill-img, glass, tick, section
    molecules/      video-card, tile, post, step, role-card, team-slide, team-switch, sheet, reveal-text
    organisms/      hero, stadium-window, manifesto, teams-carousel, partners, how, participate,
                    journal, founder, roster, team-panel, team-gallery, arena
    superorganisms/ header, footer, page-veil
    templates/      t-site.hbs (head + header + footer + слоты)
    bundles/        home.js, teams.js, team.js, about.js (точки входа страниц)
    runtime/        reduced-motion.js, dom.js (el/img-хелперы)
  data/             teams.js, journal.js, manifesto.js (ES-модули)
public/             assets/img, models, env, fonts (копируются как есть)
tests/visual/       Playwright: скриншоты, скролл-сцены, консоль
```

Соответствие текущему коду:

| Сейчас | Куда |
|---|---|
| `:root` в `css/style.css` | `tokens/*` |
| `assets/svg/*` | `quarks/icons/` |
| `.btn`, `.round-btn`, `.pill`, `.link-under`, `.label`, `.display`, `.pill-img`, `.glass`, `.tick` | `atoms/*` |
| `.video-card`, `.tile`, `.post`, `.step`, `.role`, слайд карусели, `.team-switch`, `.sheet` | `molecules/*` |
| разделы `style.css` (hero, stadium, manifesto, teams, marquee, how, participate, journal), `teams.css`, `team.css`, `about.css` | `organisms/*` |
| header, footer, `.page-veil` | `superorganisms/*` |
| `js/main.js` (steps, reveal, journal, anchor jumps) | `organisms/how`, `molecules/reveal-text`, `organisms/journal`, `superorganisms/page-veil` |
| `js/carousel.js`, `marquee.js`, `dialogs.js`, `stadium-loader.js`, `teams-page.js`, `team-page.js`, `about-stadium.js` | одноимённые организмы и молекулы |
| `js/*-data.js` (`window.TRIBUNE*`) | `src/data/*.js` (export) |

---

### Task 1 (Задача 1): Эталон — визуальная регрессия до любых изменений

**Файлы:**
- Создать: `package.json` (в корне), `playwright.config.ts`, `tests/visual/pages.spec.ts`, `tests/visual/scroll-scenes.spec.ts`

**Интерфейсы:**
- Даёт: `npm run test:visual` (сравнение с эталоном), `npm run test:visual:update` (перезапись эталона). Проекты Playwright `desktop` 1440×900 и `mobile` 375×812.

- [ ] **Шаг 1:** тест `pages.spec.ts`: для каждой страницы (`/`, `/teams.html`, `/team.html?id=carabell`, `/about.html`) сделать скриншот всей страницы через `toHaveScreenshot({ fullPage: true, maxDiffPixelRatio: 0.001 })` с отключёнными анимациями (`animations: "disabled"`) и проверить, что в консоли 0 ошибок.
- [ ] **Шаг 2:** тест `scroll-scenes.spec.ts`: для `#stadium` и `#how` прокрутить к 0, 25, 50, 75 и 100% высоты секции и снять скриншот видимой области. Для стадиона маскировать `canvas`: WebGL недетерминирован, проверяем окно и карточку, а не сцену. Отдельный тест: клик по `a[href="#journal"]` за 800 мс приводит `#journal` к `top: 0` (±2px).
- [ ] **Шаг 3:** снять эталон на текущем `main`: `npm run test:visual:update`. Ожидается: создана папка снимков, тесты зелёные.
- [ ] **Шаг 3а (benchmark):** `scripts/perf-baseline.mjs` (Playwright + CDP, троттлинг «Fast 4G», 3 прогона, медиана) для 4 страниц записывает в `.ecc/benchmarks/baseline.json` LCP, CLS, INP, FCP, TTFB, вес страницы до прокрутки (отдельно JS, CSS, шрифты, картинки), число запросов и блокирующие отрисовку ресурсы. Файл коммитится: с ним сравниваются задачи 9 и 10.
- [ ] **Шаг 4:** закоммитить в ветку `udf`: `test: visual and perf baseline before UDF refactor`.

### Task 2 (Задача 2): Vite multi-page и деплой через Actions

**Файлы:**
- Создать: `vite.config.ts`, `.github/workflows/deploy.yml`
- Перенести: `index.html`, `teams.html`, `team.html`, `about.html` → `src/pages/`; `assets/` → `public/assets/`
- Удалить: все `?v=ГГГГММДДЧЧММ` из HTML

**Интерфейсы:**
- Даёт: `npm run dev` (localhost:5173), `npm run build` → `dist/`, `npm run preview`. `base: "/tribune/"`. Входы `build.rolldownOptions.input` (в Vite 8 это `rolldownOptions`, не `rollupOptions`): `index`, `teams`, `team`, `about`. `dist/` и `node_modules/.vite` добавлены в `.gitignore`. Исходники карт не публикуются (`build.sourcemap: false`).

- [ ] **Шаг 1:** в `pages.spec.ts` добавить тест `old-urls`: запросы `/tribune/index.html`, `/tribune/teams.html`, `/tribune/team.html?id=ffk` и `/tribune/about.html` к `vite preview` отдают 200.
- [ ] **Шаг 2:** запустить тест на текущем состоянии. Ожидается FAIL: нет `vite preview`.
- [ ] **Шаг 3:** настроить Vite: `root: "src/pages"`, `publicDir: "../../public"`, `outDir: "../../dist"`, `base: "/tribune/"`. Старые CSS и JS пока подключить как есть, без изменений.
- [ ] **Шаг 4:** в Playwright поменять `baseURL` на `http://localhost:4173/tribune/` через `webServer: npm run build && npm run preview`. Запустить `npm run test:visual`. Ожидается: PASS, всё совпадает с эталоном.
- [ ] **Шаг 5:** `deploy.yml`: при пуше в `main` выполнить `npm ci && npx tsc --noEmit -p stadium-src && npm run build` (Vite не проверяет типы при сборке, поэтому проверка отдельным шагом), затем `actions/upload-pages-artifact` (`dist`) и `actions/deploy-pages`. **Julie переключает** Settings → Pages → Source на «GitHub Actions». До переключения живой сайт работает по-старому.
- [ ] **Шаг 6:** коммит `build: vite multi-page, deploy dist via actions`.

### Task 3 (Задача 3): Токены и кварки

**Файлы:**
- Создать: `src/udf/tokens/{colors,typography,grid,motion,site}.css` и `README.md`; `src/udf/quarks/icons/` (svg из `assets/svg`); `src/udf/quarks/fonts/fonts.css` с `@font-face`
- Изменить: `css/style.css` (убрать `:root` и `@font-face`, подключить токены)

**Интерфейсы:**
- Даёт переменные с прежними именами: `--ink --ink-muted --ink-soft --tint --bg-hero --bg-grey --bg-white --green --dot --shadow` (colors), `--display` (typography), `--gutter --section-pad --radius-card --radius-tile --cols-3` (grid), `--ease --ease-slide --dur` (motion). Имена не переименовываем: на них завязан весь CSS.

- [ ] **Шаг 1:** перенести значения 1:1 из `:root` в `style.css` (строки 22–45), мобильное переопределение `--section-pad: 80px; --gutter: 16px` — в `grid.css` под `@media (max-width: 900px)`.
- [ ] **Шаг 1а (design-system, три слоя):** сейчас мимо переменных прописано 53 цвета, 20 скруглений и 22 размера шрифта (аудит 14.11.2026). Завести слой базовых значений (`--c-ink-900: #17100e`, `--c-grey-100: #f0f0f0`, `--c-green-200: #c8edbd`…; `--fs-12 --fs-14 --fs-16 --fs-17` и крупные `--fs-28 --fs-34 --fs-40 --fs-44 --fs-56 --fs-80`; `--r-card: 30px --r-tile: 16px --r-pill: 1000px`). Текущие имена (`--ink`, `--tint`, `--radius-card`…) становятся смысловым слоем поверх них. Повторяющиеся значения из аудита (`rgba(23,16,14,.08)` ×3, `rgba(0,0,0,.06)` ×3, `#f5f5f4`, `#e4ecf3`…) получают смысловые токены (`--tint-hover`, `--shadow-soft`…). Значения не меняются, меняется только запись.
- [ ] **Шаг 2:** `npm run test:visual`. Ожидается: PASS.
- [ ] **Шаг 3:** коммит `refactor(udf): tokens and quarks`.

### Task 4 (Задача 4): Атомы

**Файлы:**
- Создать: `src/udf/atoms/{button,round-btn,pill,link-under,label,display,pill-img,glass,tick,section}/a-*.css` и `README.md` в каждой
- Изменить: `css/style.css` (вырезать раздел `shared`, строки 64–175)

**Интерфейсы:**
- Классы сохраняют текущие имена (`.btn`, `.btn--lg`, `.round-btn`, `.pill`, `.pill__item`…). Переименование в `a-button` и т. д. — отдельный шаг 6 этой задачи, через поиск и замену по всем HTML и JS.

- [ ] **Шаг 1:** разнести правила по файлам атомов, мобильные правила этих классов из блока `responsive` — в тот же файл атома.
- [ ] **Шаг 2:** `npm run test:visual`. Ожидается: PASS.
- [ ] **Шаг 3:** переименовать в UDF-префиксы: `.btn`→`.a-button`, `.round-btn`→`.a-round-btn`, `.pill`→`.a-pill`, `.link-under`→`.a-link-under`, `.label`→`.a-label`, `.display`→`.a-display`, `.pill-img`→`.a-pill-img`, `.glass`→`.a-glass`, `.tick`→`.a-tick`. Модификаторы по BEM: `.a-button--lg`, `.a-button--green`.
- [ ] **Шаг 4:** `rg -n '\b(btn|round-btn|pill|link-under|label|display|pill-img|glass|tick)\b' src css js` не находит старых классов в разметке и селекторах.
- [ ] **Шаг 5:** `npm run test:visual`. Ожидается: PASS.
- [ ] **Шаг 6:** коммит `refactor(udf): atoms`.

### Task 5 (Задача 5): Молекулы (CSS + JS)

**Файлы:**
- Создать: `src/udf/molecules/{video-card,tile,post,step,role-card,team-slide,team-switch,sheet,reveal-text}/`
- Создать: `src/udf/runtime/dom.js`

**Интерфейсы:**
- `runtime/dom.js`: `export function el(tag: string, className?: string, text?: string): HTMLElement`, `export function img(src: string, className?: string, alt?: string): HTMLImageElement` (вынести из `main.js`).
- `molecules/post/m-post.js`: `export function renderPost(post: JournalPost, profile: {user: string, avatar: string}): HTMLAnchorElement`.
- `molecules/reveal-text/m-reveal-text.js`: `export function initRevealText(root: ParentNode = document): void`.
- `molecules/sheet/m-sheet.js`: `export function initSheets(root: ParentNode = document): void` (логика `[data-opens]` из `dialogs.js`).
- `molecules/tile/m-tile.js`: `export function tile(opts: {href, wide?, surfaceClass?, surface, title, note, extra?}): HTMLElement` (из `teams-page.js`).

- [ ] **Шаг 1:** разнести CSS молекул и мобильные правила, переименовать в `m-*` (`.post`→`.m-post`, `.tile`→`.m-tile`, `.role`→`.m-role-card`, `.step`→`.m-step`, `.sheet`→`.m-sheet`, `.video-card`→`.m-video-card`, `.team-switch`→`.m-team-switch`).
- [ ] **Шаг 2:** перенести JS молекул в ES-модули с указанными сигнатурами. Пока старые файлы не удалены, подключать их через временный `src/udf/bundles/legacy.js`.
- [ ] **Шаг 3:** `npm run test:visual`. Ожидается: PASS, в консоли 0 ошибок.
- [ ] **Шаг 4:** коммит `refactor(udf): molecules`.

### Task 6 (Задача 6): Данные как модули

**Файлы:**
- Создать: `src/data/teams.js` (`export const TEAMS, FOUNDATIONS, DESIGNERS`), `src/data/journal.js` (`export const JOURNAL_POSTS, JOURNAL_PROFILE`), `src/data/manifesto.js` (`export const MANIFESTO`)
- Удалить: `js/teams-data.js`, `js/journal-data.js`, `js/about-content.js` и все `window.TRIBUNE*`

- [ ] **Шаг 1:** тест `tests/unit/data.spec.ts` (Vitest): у каждой команды в `TEAMS` есть `id`, `name`, `href` или `null`. `id` уникальны. Каждый путь картинки в `JOURNAL_POSTS[].images` существует в `public/`.
- [ ] **Шаг 2:** запустить. Ожидается FAIL: модулей ещё нет.
- [ ] **Шаг 3:** перенести данные 1:1, заменить обращения к `window.TRIBUNE*` на импорты.
- [ ] **Шаг 4:** `npx vitest run && npm run test:visual`. Ожидается: PASS.
- [ ] **Шаг 5:** коммит `refactor(udf): data as modules`.

### Task 7 (Задача 7): Организмы

**Файлы:**
- Создать: `src/udf/organisms/{hero,stadium-window,manifesto,teams-carousel,partners,how,participate,journal,founder,roster,team-panel,team-gallery,arena}/` (`o-*.css`, `o-*.js`, `README.md`)
- Удалить: `css/style.css`, `css/teams.css`, `css/team.css`, `css/about.css`, все `js/*.js`, кроме переехавших

**Интерфейсы:**
- Каждый JS-организм экспортирует `export function init<Name>(root: HTMLElement): void` и ничего не делает при импорте. Например: `initHow(section)` (`organisms/how`), `initStadiumWindow(section, {mountStadium})` (`organisms/stadium-window`, бывший `stadium-loader.js`), `initTeamsCarousel(section, teams)`, `initPartners(section)`, `initJournal(section, posts, profile)`, `initRoster(root, data)`, `initTeamPage(root, teams)`, `initArena(root, manifesto)`.
- Стадион: `organisms/stadium-window` подключает модуль динамически: `import("../../../../stadium-src/src/stadium.ts")`. Vite выносит его в отдельный чанк, который грузится только при подходе к секции. Модели лежат в `public/assets/stadium/models` (их копирует скрипт `npm run sync:stadium` из `stadium-src/public/models`).
- three.js для About берётся из npm (`import * as THREE from "three"`, версия 0.160), а не из CDN через importmap. Через `manualChunks` выделить два чанка: `vendor-three` (только About) и `vendor-babylon` (только стадион), чтобы общий JS страниц их не тянул.
- Динамический импорт стадиона ловит ошибку загрузки чанка (после новой выкладки старое имя файла исчезает) и один раз перезагружает страницу (`sessionStorage`-флаг, чтобы не зациклиться).

- [ ] **Шаг 1:** в `scroll-scenes.spec.ts` проверить, что секция `#stadium` пока выше экрана не запрашивает `*.glb` (`page.on("request")`) и запрашивает их после прокрутки к ней.
- [ ] **Шаг 2:** запустить. Ожидается PASS на старом коде (это фиксирует текущее поведение ленивой загрузки).
- [ ] **Шаг 3:** перенести организмы по одному и после каждого запускать `npm run test:visual`. Переименовать в `o-*`.
- [ ] **Шаг 4:** `npm run test:visual`. Ожидается: PASS по всем страницам и сценам.
- [ ] **Шаг 5:** коммит на каждый организм: `refactor(udf): o-<name>`.

### Task 8 (Задача 8): Суперорганизмы и шаблон страницы

**Файлы:**
- Создать: `src/udf/superorganisms/{header,footer,page-veil}/`, `src/udf/templates/t-site.hbs`, `src/udf/templates/partials/{head,header,footer}.hbs`
- Изменить: 4 страницы в `src/pages/` (оставить только `{{#> t-site title=... bundle=...}}` + содержимое `main`)

**Интерфейсы:**
- Слоты шаблона: `title`, `description`, `bodyClass`, `bundle` (имя точки входа), `{{> @partial-block}}` для `main`.
- `superorganisms/page-veil/s-page-veil.js`: `export function initPageVeil(): void` (бывший `initAnchorJumps`).

- [ ] **Шаг 1:** тест: на всех 4 страницах шапка (`s-header`) и футер (`s-footer`) дают одинаковый `outerHTML` (кроме активного пункта меню).
- [ ] **Шаг 2:** запустить. Если тест зелёный, шапки совпадают и перенос безопасен. Если красный, расхождения из-за копирования нужно разобрать с Julie до шага 3, а не молча унифицировать.
- [ ] **Шаг 3:** вынести шапку и футер в партиалы, подключить `vite-plugin-handlebars`.
- [ ] **Шаг 4:** `npm run test:visual` и тест шапки. Ожидается: PASS.
- [ ] **Шаг 5:** коммит `refactor(udf): superorganisms and t-site template`.

### Task 9 (Задача 9): Бандлы страниц

**Файлы:**
- Создать: `src/udf/bundles/{home,teams,team,about}.js`, `src/udf/bundles/shell.css`, `src/udf/bundles/README.md`
- Удалить: `src/udf/bundles/legacy.js`

**Интерфейсы:**
- `shell.css` импортирует токены, кварки, атомы и суперорганизмы. `home.js` импортирует `shell.css`, CSS своих организмов и вызывает их `init*`. Остальные бандлы устроены так же. На странице остаются один `<script type="module" src="../udf/bundles/<page>.js">` и, после сборки, один CSS-файл.

- [ ] **Шаг 1:** тест: в собранном `dist/index.html` ровно один `<link rel="stylesheet">` и один `<script type="module">` (не считая preload).
- [ ] **Шаг 2:** запустить. Ожидается FAIL.
- [ ] **Шаг 3:** собрать бандлы.
- [ ] **Шаг 4:** `npm run build && npm run test:visual`. Ожидается: PASS. На телефоне (проект `mobile`) — тоже PASS.
- [ ] **Шаг 5:** коммит `refactor(udf): page bundles`.

### Task 10 (Задача 10): Оптимизация загрузки

**Файлы:**
- Создать: `scripts/optimize-images.mjs`, `scripts/check-udf.mjs`, `tests/perf/budget.spec.ts`
- Изменить: `public/assets/fonts` (woff2), разметка картинок в организмах

- [ ] **Шаг 1:** тест бюджета `budget.spec.ts` для каждой страницы (desktop и mobile, без прокрутки, «Fast 4G»): LCP < 2,5 с, CLS < 0,1, INP < 200 мс, FCP < 1,8 с; вес страницы до прокрутки < 1 МБ (3D-стадион грузится лениво и в бюджет не входит); JS < 200 КБ gzip (цель для главной — 60 КБ); CSS < 25 КБ gzip; шрифты < 150 КБ; ни одного запроса `*.glb` и three.js до нужной секции или страницы.
- [ ] **Шаг 2:** запустить на результате задачи 9. `scripts/perf-baseline.mjs --compare` печатает таблицу «Метрика | До (baseline.json) | После | Разница | Вердикт». Ожидается FAIL по шрифтам: `ttf` и `otf` весят 508 КБ.
- [ ] **Шаг 3:** шрифты: `ttf`/`otf` → `woff2` с подмножеством латиницы (`pyftsubset`), `font-display: swap`, `<link rel="preload">` только для Youth Medium.
- [ ] **Шаг 4:** картинки: `optimize-images.mjs` (sharp) делает варианты 1x и 2x и AVIF и WebP с явными `width` и `height`. Всё ниже первого экрана получает `loading="lazy"` и `decoding="async"`, hero — `fetchpriority="high"`.
- [ ] **Шаг 5:** `check-udf.mjs`: у каждой папки компонента есть `README.md` и файл с правильным префиксом; в CSS компонентов нет цветов, скруглений и размеров шрифта числами (только `var(--…)`, по правилу design-system), нет `font-style: italic`, нет `outline`, кроме `outline: 0`, нет `font-size` меньше 12px; нет «бочек» `index.js`, которые реэкспортируют всё подряд (vite-patterns). Подключить в `npm run check`.
- [ ] **Шаг 6:** `npm run check && npm run test:visual && npx playwright test tests/perf`. Ожидается: PASS.
- [ ] **Шаг 7:** коммит `perf: fonts woff2, responsive images, budgets, udf checks`.
- [ ] **Шаг 8 (решение Julie и модельщика):** модели стадиона сейчас весят 25 МБ без сжатия. Сжатие meshopt без изменения текстур уменьшает только геометрию и визуально незаметно. Делать только после их «да» и сравнения скриншотов `?diagnostics=1` до и после.

### Task 11 (Задача 11): Приёмка и выкладка

- [ ] **Шаг 1:** полный прогон `npm run check && npx vitest run && npm run test:visual && npx playwright test tests/perf` на ветке `udf`.
- [ ] **Шаг 2:** открыть `npm run preview` в браузере, вручную пройти пункты Review Focus 1–5, проверить в Safari и Firefox.
- [ ] **Шаг 3:** Julie смотрит превью и даёт «ок».
- [ ] **Шаг 4:** влить `udf` в `main`. Julie переключает Pages на «GitHub Actions», если ещё не переключила. Проверить живой сайт `https://arkhipovau.github.io/tribune/` тем же тестом с `baseURL` живого сайта.
- [ ] **Шаг 5:** обновить `CLAUDE.md`: новая структура, команды `npm run dev / build / check`, правило «новый компонент = папка + README + префикс».
