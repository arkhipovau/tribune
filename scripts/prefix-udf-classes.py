"""One-off migration: rename component classes to UDF prefixes (a- m- o- s-).
Touches CSS selectors in src/udf, class attributes in src/pages + partials, and
class/selector strings in src JS. Content text is never touched."""
import re, glob

MAP = {
  "btn": "a-button", "round-btn": "a-round-btn", "pill": "a-pill", "link-under": "a-link-under", "label": "a-label",
  "display": "a-display", "pill-img": "a-pill-img", "glass": "a-glass", "tick": "a-tick", "section": "a-section",
  "dot": "a-dot", "muted": "a-muted",
  "video-card": "m-video-card", "post": "m-post", "step": "m-step", "role": "m-role-card", "slide": "m-team-slide",
  "team-card": "m-team-card", "sheet": "m-sheet", "expand-btn": "m-expand-btn", "reveal": "m-reveal", "w": "m-reveal-word",
  "tile": "m-tile", "team-switch": "m-team-switch", "join": "m-join-card",
  "hero": "o-hero", "stadium": "o-stadium", "stadium-scroll": "o-stadium-scroll", "manifesto": "o-manifesto",
  "teams": "o-teams", "partners": "o-partners", "marquee": "o-marquee", "how": "o-how", "steps": "o-steps",
  "participate": "o-participate", "roles": "o-roles", "posts": "o-posts", "founder": "o-founder", "roster": "o-roster",
  "bento": "o-bento", "page-teams": "o-page-teams", "team": "o-team", "page-team": "o-page-team", "sep": "o-sep",
  "tp-about": "o-tp-about", "tp-credits": "o-tp-credits", "tp-do": "o-tp-do", "tp-hero": "o-tp-hero",
  "tp-patron": "o-tp-patron", "tp-row": "o-tp-row", "arena": "o-arena", "about-text": "o-about-text", "page-about": "o-page-about",
  "header": "s-header", "footer": "s-footer", "page-veil": "s-page-veil",
}
NAMES = sorted(MAP, key=len, reverse=True)
ALT = "|".join(re.escape(n) for n in NAMES)
TOKEN = re.compile(rf"(?<![A-Za-z0-9_-])({ALT})(?=__|--|$|[^A-Za-z0-9_-])")
SEL = re.compile(rf"\.({ALT})(?=__|--|[^A-Za-z0-9_-]|$)")

def fix_class_list(value):  # "post post__media is-on" -> prefixed
    return TOKEN.sub(lambda m: MAP[m.group(1)], value)

import sys
ONLY_JS = "--js" in sys.argv
for path in ([] if ONLY_JS else glob.glob("src/udf/**/*.css", recursive=True)):
    s = open(path).read()
    s = re.sub(r'url\([^)]*\)|[^{}]+(?=\{)', lambda m: m.group(0) if m.group(0).startswith("url(") else SEL.sub(lambda k: "." + MAP[k.group(1)], m.group(0)), s)
    open(path, "w").write(s)

for path in ([] if ONLY_JS else glob.glob("src/pages/*.html") + glob.glob("src/udf/templates/partials/*.hbs")):
    s = open(path).read()
    s = re.sub(r'class="([^"]*)"', lambda m: 'class="' + fix_class_list(m.group(1)) + '"', s)
    open(path, "w").write(s)

STR = re.compile(r'''(["'`])((?:(?!\1)[^\\\n]|\\.)*)\1''')
CLASSY = re.compile(r"^[a-z0-9_ .#:>\[\]=()${}-]*$")
for path in glob.glob("src/udf/**/*.js", recursive=True) + glob.glob("src/data/*.js"):
    s = open(path).read()
    def repl(m):
        q, body = m.group(1), m.group(2)
        before = s[max(0, m.start() - 40):m.start()]
        # ids, not classes: getElementById("how"), id: "how", el.id = "how"
        if re.search(r'(getElementById\(|\bid\s*[:=]\s*|setAttribute\("id",\s*)$', before): return m.group(0)
        if not body or not CLASSY.match(body) or body.startswith(("./", "../", "http")) or "/" in body: return m.group(0)
        if "." in body or "#" in body or "[" in body:  # selector
            new = SEL.sub(lambda k: "." + MAP[k.group(1)], body)
        else:
            new = fix_class_list(body)
        return q + new + q
    s = STR.sub(repl, s)
    open(path, "w").write(s)
print("done")
