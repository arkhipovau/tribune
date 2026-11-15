# m-filter

Молекула UDF: фильтр облаком тегов (как Fonts In Use). Сверху пилюля срезов, под ней крупные теги со счётчиком надстрочно.

- Стили: `m-filter.css`, логика: `m-filter.js` → `initFilter(root, { facets, total, onChange })`
- Подключается в бандлах: `teams.css` (используется в `organisms/roster`)
- Выбор хранится в адресе (`?country=kenya`, `?foundation=ffh`, `?type=girls`)
- Перестройка сетки анимируется через View Transitions (без анимации при `prefers-reduced-motion`)
