// Page entry: wires the page's components, in the order the old scripts ran.
import { initArenaText } from "../organisms/arena/o-arena-text.js";
import { initSheets } from "../molecules/sheet/m-sheet.js";
import { initArena } from "../organisms/arena/o-arena.js";

initArenaText();
initSheets();
initArena();
