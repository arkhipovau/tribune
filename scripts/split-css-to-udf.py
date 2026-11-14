"""One-off migration: split public/css/*.css into src/udf/<layer>/<name>/ files.

Each top-level rule goes to the component owning the leftmost class in its selector;
rules inside @media go to the same component, wrapped in the same @media.
Order inside a component is preserved. Run once, then delete public/css.
"""
import re, os, collections

SRC = "public/css"
OUT = "src/udf"

# class -> (layer, component)
OWNER = {
  # atoms
  "btn": ("atoms", "button"), "round-btn": ("atoms", "round-btn"), "pill": ("atoms", "pill"),
  "link-under": ("atoms", "link-under"), "label": ("atoms", "label"), "display": ("atoms", "display"),
  "pill-img": ("atoms", "pill-img"), "glass": ("atoms", "glass"), "tick": ("atoms", "tick"),
  "section": ("atoms", "section"), "dot": ("atoms", "dot"), "muted": ("atoms", "text"),
  # molecules
  "video-card": ("molecules", "video-card"), "post": ("molecules", "post"), "step": ("molecules", "step"),
  "role": ("molecules", "role-card"), "slide": ("molecules", "team-slide"), "team-card": ("molecules", "team-slide"),
  "sheet": ("molecules", "sheet"), "expand-btn": ("molecules", "sheet"), "has-sheet": ("molecules", "sheet"),
  "reveal": ("molecules", "reveal-text"), "w": ("molecules", "reveal-text"), "tile": ("molecules", "tile"),
  "team-switch": ("molecules", "team-switch"), "join": ("molecules", "join-card"),
  # organisms
  "hero": ("organisms", "hero"), "stadium": ("organisms", "stadium-window"), "stadium-scroll": ("organisms", "stadium-window"),
  "is-gliding": ("organisms", "stadium-window"),
  "manifesto": ("organisms", "manifesto"), "teams": ("organisms", "teams-carousel"),
  "partners": ("organisms", "partners"), "marquee": ("organisms", "partners"),
  "how": ("organisms", "how"), "steps": ("organisms", "how"),
  "participate": ("organisms", "participate"), "roles": ("organisms", "participate"),
  "posts": ("organisms", "journal"), "founder": ("organisms", "founder"),
  "roster": ("organisms", "roster"), "bento": ("organisms", "roster"), "page-teams": ("organisms", "roster"),
  "team": ("organisms", "team-page"), "page-team": ("organisms", "team-page"), "sep": ("organisms", "team-page"),
  "tp-about": ("organisms", "team-panel"), "tp-credits": ("organisms", "team-panel"), "tp-do": ("organisms", "team-panel"),
  "tp-hero": ("organisms", "team-panel"), "tp-patron": ("organisms", "team-panel"), "tp-row": ("organisms", "team-panel"),
  "arena": ("organisms", "arena"), "about-text": ("organisms", "arena"), "page-about": ("organisms", "arena"),
  # superorganisms
  "header": ("superorganisms", "header"), "footer": ("superorganisms", "footer"), "page-veil": ("superorganisms", "page-veil"),
}
KEYFRAMES = {"marquee": ("organisms", "partners"), "pulse": ("atoms", "dot"),
             "sheet-fade": ("molecules", "sheet"), "sheet-in": ("molecules", "sheet"), "sheet-out": ("molecules", "sheet")}
PREFIX = {"atoms": "a", "molecules": "m", "organisms": "o", "superorganisms": "s"}
TOKEN_GROUP = [(r"^--(ink|tint|bg-|green|dot|shadow)", "colors"), (r"^--display", "typography"),
               (r"^--(gutter|section-pad|radius|cols)", "grid"), (r"^--(ease|dur)", "motion")]

def blocks(css):
    out, i = [], 0
    while True:
        j = css.find("{", i)
        if j < 0: return out
        sel, depth, k = css[i:j].strip(), 1, j + 1
        while depth:
            depth += {"{": 1, "}": -1}.get(css[k], 0); k += 1
        out.append((sel, css[j + 1:k - 1].strip())); i = k

CLASS = re.compile(r"\.([a-z][a-z0-9]*(?:-[a-z0-9]+)*)(?=__|--|[^a-z0-9_-]|$)")
def owner(sel):
    for m in CLASS.finditer(sel):
        name = m.group(1)
        if name in OWNER: return OWNER[name]
        if name.startswith("is-"): continue
    return ("base", "reset")

files = collections.OrderedDict()   # (layer, comp) -> list[str]
tokens = collections.defaultdict(list)  # group -> list of decls / media chunks
def add(key, text): files.setdefault(key, []).append(text)

def fmt(sel, body): return f"{sel} {{ {body} }}" if "\n" not in body and len(body) < 160 else f"{sel} {{\n  {body}\n}}"

for fname in ["style.css", "sheet.css", "teams.css", "team.css", "about.css"]:
    css = re.sub(r"/\*.*?\*/", "", open(os.path.join(SRC, fname)).read(), flags=re.S)
    for sel, body in blocks(css):
        if sel == ":root":
            for decl in [d.strip() for d in body.split(";") if d.strip()]:
                g = next((grp for pat, grp in TOKEN_GROUP if re.match(pat, decl)), "site")
                tokens[g].append(decl + ";")
        elif sel.startswith("@font-face"):
            add(("quarks", "fonts"), f"@font-face {{ {body} }}")
        elif sel.startswith("@keyframes"):
            add(KEYFRAMES[sel.split()[1]], f"{sel} {{ {body} }}")
        elif sel.startswith("@media"):
            grouped = collections.OrderedDict()
            for s2, b2 in blocks(body):
                key = ("tokens", "grid") if s2 == ":root" else owner(s2)
                grouped.setdefault(key, []).append(fmt(s2, b2))
            for key, rules in grouped.items():
                text = sel + " {\n  " + "\n  ".join(rules) + "\n}"
                if key == ("tokens", "grid"): tokens["grid-media"].append(text)
                else: add(key, text)
        else:
            add(owner(sel), fmt(sel, body))

def write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, "w").write(text.rstrip() + "\n")

for g in ["colors", "typography", "grid", "motion", "site"]:
    decls = tokens.get(g, [])
    if not decls and g != "grid": continue
    text = ":root {\n  " + "\n  ".join(decls) + "\n}\n" if decls else ""
    if g == "grid": text += "\n".join(tokens.get("grid-media", []))
    write(f"{OUT}/tokens/{g}.css", text)

for (layer, comp), parts in files.items():
    if layer == "base": path = f"{OUT}/base/reset.css"
    elif layer == "quarks": path = f"{OUT}/quarks/fonts/q-fonts.css"
    else: path = f"{OUT}/{layer}/{comp}/{PREFIX[layer]}-{comp}.css"
    write(path, "\n".join(parts))
    print(path)
