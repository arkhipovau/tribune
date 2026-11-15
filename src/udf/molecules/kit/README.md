# m-kit

Молекула UDF: форма команды спереди и сзади, две карточки рядом.

- Стили: `m-kit.css`
- Подключается в бандлах: `team.css`
- Разметка: `section.m-kit > .m-kit__label + .m-kit__shirts > figure.m-kit__shirt × 2` (img `.m-kit__front` / `.m-kit__back`)
- Заполняется в `organisms/team-page/o-team-page.js` из `team.kit` (`src/data/teams.js`); без формы блок скрыт.
