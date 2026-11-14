// Page entry: wires the page's components, in the order the old scripts ran.
import { initTeamsCarousel } from "../organisms/teams-carousel/o-teams-carousel.js";
import { initHow } from "../organisms/how/o-how.js";
import { initPageVeil } from "../superorganisms/page-veil/s-page-veil.js";
import { initRevealText } from "../molecules/reveal-text/m-reveal-text.js";
import { initJournal } from "../organisms/journal/o-journal.js";
import { initStadiumWindow } from "../organisms/stadium-window/o-stadium-window.js";
import { initSheets } from "../molecules/sheet/m-sheet.js";
import { initPartners } from "../organisms/partners/o-partners.js";

initTeamsCarousel();
initHow();
initPageVeil();
initRevealText();
initJournal();
initStadiumWindow();
initSheets();
initPartners();
