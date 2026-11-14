"""One-off migration: classic IIFE scripts in public/js -> ES modules in src/udf and src/data.
Bodies move unchanged; IIFEs become exported init functions; window.TRIBUNE* become imports."""
import re, os

JS = "public/js"
def read(f): return open(os.path.join(JS, f)).read()
def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True); open(path, "w").write(text.rstrip() + "\n")
def unwrap(src):
    """Strip the outer `(() => { "use strict"; ... })();` and return (leading comments, body)."""
    i = src.index("(() => {"); head = src[:i]
    body = src[i + len("(() => {"):src.rindex("})();")]
    body = re.sub(r'^\s*"use strict";\n', "", body)
    return head, body

# ---------- data ----------
t = read("teams-data.js"); head, body = unwrap(t)
body = body.replace("window.TRIBUNE = Object.freeze(", "export const TRIBUNE = Object.freeze(")
write("src/data/teams.js", head + re.sub(r"(?m)^  ", "", body))
j = read("journal-data.js").replace("window.TRIBUNE_JOURNAL = [", "export const JOURNAL = [")
write("src/data/journal.js", j)
m = read("about-content.js"); cut = m.index("// Plain-text version")
write("src/data/manifesto.js", m[:cut].replace("window.TRIBUNE_MANIFESTO = [", "export const MANIFESTO = ["))
txt = m[cut:]
txt = txt.replace('document.addEventListener("DOMContentLoaded", () => {', 'export function initArenaText() {')
txt = txt.replace("window.TRIBUNE_MANIFESTO.forEach", "MANIFESTO.forEach")
txt = txt[:txt.rindex("});")] + "}"
write("src/udf/organisms/arena/o-arena-text.js", 'import { MANIFESTO } from "../../../data/manifesto.js";\n\n' + txt)

# ---------- simple IIFE modules ----------
def module(src_file, path, fn, imports="", replace=()):
    head, body = unwrap(read(src_file))
    for a, b in replace: body = body.replace(a, b)
    write(path, head + imports + f"export function {fn}() {{\n" + body.rstrip() + "\n}")

T = 'import { TRIBUNE } from "{rel}data/teams.js";\n\n'
module("carousel.js", "src/udf/organisms/teams-carousel/o-teams-carousel.js", "initTeamsCarousel",
       T.replace("{rel}", "../../../"), [("(window.TRIBUNE && window.TRIBUNE.teams)", "TRIBUNE.teams"), ("= window.TRIBUNE;", "= TRIBUNE;")])
module("marquee.js", "src/udf/organisms/partners/o-partners.js", "initPartners")
module("dialogs.js", "src/udf/molecules/sheet/m-sheet.js", "initSheets",
       replace=[("  initDialogs();\n", "  initDialogs();\n")])
module("stadium-loader.js", "src/udf/organisms/stadium-window/o-stadium-window.js", "initStadiumWindow",
       T.replace("{rel}", "../../../"), [("= window.TRIBUNE;", "= TRIBUNE;")])
module("teams-page.js", "src/udf/organisms/roster/o-roster.js", "initRoster",
       T.replace("{rel}", "../../../"), [("= window.TRIBUNE;", "= TRIBUNE;")])
module("team-page.js", "src/udf/organisms/team-page/o-team-page.js", "initTeamPage",
       T.replace("{rel}", "../../../"), [("= window.TRIBUNE;", "= TRIBUNE;")])

# ---------- main.js: split by section ----------
head, body = unwrap(read("main.js"))
def section(start, end=None):
    a = body.index(start); b = body.index(end) if end else len(body)
    return re.sub(r"(?m)^  ", "", body[a:b]).strip() + "\n"
helpers = '''// Small DOM helpers shared by components.
export const el = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};

export const img = (src, className = "", alt = "") => {
  const node = el("img", className);
  node.src = src;
  node.alt = alt;
  return node;
};

export const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
'''
write("src/udf/runtime/dom.js", helpers)
how = section("/* ---------- How it works", "/* ---------- In-page links")
how = how.replace("function initSteps()", "export function initHow()")
write("src/udf/organisms/how/o-how.js", how)
veil = section("/* ---------- In-page links", "/* ---------- Word-by-word")
veil = veil.replace("function initAnchorJumps()", "export function initPageVeil()")
write("src/udf/superorganisms/page-veil/s-page-veil.js", 'import { el } from "../../runtime/dom.js";\n\n' + veil)
rev = section("/* ---------- Word-by-word", "/* ---------- Journal")
rev = rev.replace("function initReveal()", "export function initRevealText()")
write("src/udf/molecules/reveal-text/m-reveal-text.js", 'import { prefersReducedMotion as reducedMotion } from "../../runtime/dom.js";\n\nconst prefersReducedMotion = reducedMotion();\n\n' + rev)
jr = section("/* ---------- Journal", "initSteps();")
jr = jr.replace("function renderPost(p)", "export function renderPost(p)").replace("function initJournal()", "export function initJournal()")
jr = jr.replace("window.TRIBUNE_JOURNAL || []", "JOURNAL")
write("src/udf/organisms/journal/o-journal.js", 'import { el, img } from "../../runtime/dom.js";\nimport { JOURNAL } from "../../../data/journal.js";\n\n' + jr)
print("ok")
