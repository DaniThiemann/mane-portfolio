"""Generate the five J2 case windows and inject them into index.html."""
import html, re

A = 'assets/projects'
def e(s): return html.escape(s, quote=False)
def q(s): return html.escape(s, quote=True)

# ── building blocks ──────────────────────────────────
def head(title, meta, line, link=None):
    l = f'\n      <a class="j2-link" href="{q(link[1])}" target="_blank" rel="noopener">{e(link[0])}</a>' if link else ''
    return (f'    <header class="j2-b j2-head">\n      <h2 class="j2-title">{e("<" + title + ">")}</h2>\n'
            f'      <p class="j2-meta">{e(meta)}</p>\n      <p class="j2-line">{e("> " + line)}</p>{l}\n    </header>\n')

def text(label, body=None):
    b = f'<p>{e("> " + body)}</p>' if body else ''
    return f'    <section class="j2-b j2-text"><h3>{e("<" + label + ">")}</h3>{b}</section>\n'

def m(src, alt='', r='16 / 9', fit=False, bg=None, poster=None, pad=False):
    cls = 'j2-m' + (' fit' if fit else '') + (' pad' if pad else '')
    st = f'--r:{r};' + (f'--bg:{bg};' if bg else '')
    if src.endswith('.mp4'):
        pa = f' poster="{poster}"' if poster else ''
        inner = f'<video data-src="{src}"{pa} muted loop playsinline preload="none"></video>'
    else:
        inner = f'<img src="{src}" alt="{q(alt)}" loading="lazy" decoding="async">'
    return f'<div class="{cls}" style="{st}">{inner}</div>'

def fig(items, cap=None, cls=''):
    c = f'<figcaption>{e("> " + cap)}</figcaption>' if cap else ''
    split = ' j2-split' if len(items) == 2 else (' j2-split j2-trio' if len(items) == 3 else '')
    return f'    <figure class="j2-b j2-fig{split}{cls}">{"".join(items)}{c}</figure>\n'

def tile(inner, cap=None, bg='#0D0D0D', fg='#FFFFFF', r='1', rm=None, w=None, span=None):
    st = f'--bg:{bg};--fg:{fg};--r:{r};' + (f'--rm:{rm};' if rm else '') + (f'--w:{w};' if w else '') + (f'grid-column:span {span};' if span else '')
    c = f'<span class="j2-cap">{e(cap)}</span>' if cap else ''
    return f'<div class="j2-tile" style="{st}">{inner}{c}</div>'

def img(src, alt='', cls=''):
    return f'<img{" class=" + chr(34) + cls + chr(34) if cls else ""} src="{src}" alt="{q(alt)}" loading="lazy" decoding="async">'

def tiles(items, cols='1fr 1fr', bg=None):
    st = f'--cols:{cols};' + (f'background:{bg};' if bg else '')
    return f'    <div class="j2-b j2-tiles" style="{st}">{"".join(items)}</div>\n'

def swatches(sw, note=None, rad=0):
    n = len(sw)
    cells = ''.join(f'<div><i style="--c:{c}"></i><span class="j2-cap">{e(t)}</span></div>' for c, t in sw)
    nt = f'<p class="j2-note">{e("> " + note)}</p>' if note else ''
    return f'    <div class="j2-b"><div class="j2-sw" style="--n:{n};--rad:{rad}px">{cells}</div>{nt}</div>\n'

def typeblock(rows, bg=None, fg=None, fg2=None, line=None):
    st = ''.join(f'--{k}:{v};' for k, v in [('bg', bg), ('fg', fg), ('fg2', fg2), ('line', line)] if v)
    body = ''.join(f'<div>{spec}<div><h4>{e("<" + name + ">")}</h4><span class="j2-cap">{e(role)}</span></div></div>' for spec, name, role in rows)
    dark = ' j2-dark' if bg else ''
    return f'    <div class="j2-b j2-type{dark}" style="{st}">{body}</div>\n'

def raw(h): return f'    {h}\n'

def foot(credits, nxt_id, nxt_name):
    c = '<br>'.join(e(x) for x in credits)
    return (f'    <footer class="j2-b j2-foot"><p class="j2-credits">{c}</p>'
            f'<button class="j2-next" data-next="{nxt_id}">{e("next → <" + nxt_name + ">")}</button></footer>\n')

def window(slug, url, blocks):
    return (f'  <div id="modal-{slug}" class="modal-panel modal-project j2" role="dialog" aria-hidden="true" data-centered="true" data-url="/work/{url}">\n'
            f'    <button class="modal-close" data-close="modal-{slug}">( x )</button>\n'
            f'    <span class="j2-url">/work/{url}</span>\n'
            f'  <div class="modal-proj-scroll">\n' + ''.join(blocks) + '  </div>\n  </div>\n\n')

# ── f. maeda keiei ───────────────────────────────────
P = f'{A}/fmaeda-keiei'
PENT = [(161.07, 53.69), (53.69, 131.8), (268.44, 131.8), (94.64, 258.42), (227.49, 258.42)]
def fm_symbol(fill='#fff', stroke=None, dots=False, lines=False, scale=1):
    s = ''
    if lines:
        o = [0, 2, 4, 3, 1, 0]
        s += '<path d="M' + 'L'.join(f'{PENT[i][0]} {PENT[i][1]}' for i in o) + f'" fill="none" stroke="#fff" stroke-width="1.2"/>'
    for x, y in PENT:
        s += (f'<circle cx="{x}" cy="{y}" r="53.69" fill="none" stroke="#fff" stroke-width="2"/>' if stroke
              else f'<circle cx="{x}" cy="{y}" r="53.69" fill="{fill}"/>')
        if dots: s += f'<circle cx="{x}" cy="{y}" r="4" fill="#fff"/>'
    return s
def fm_svg(inner, w=70):
    return f'<svg viewBox="-10 -10 342 332" style="width:{w}%;height:auto" aria-hidden="true">{inner}</svg>'

fmaeda = window('fmaeda', 'fmaeda-keiei', [
    head('f. maeda keiei', 'brand identity & web design ; 2026 ; client — f. maeda keiei ; role — brand & web designer',
         'brand identity & website for a cross-border expansion consultancy', ('fmaeda.co ↗', 'https://www.fmaeda.co')),
    text('01 problem', 'expansion rarely fails from lack of ambition — it fails from bad structure. f. maeda keiei steps in before a consumer brand crosses a border: diagnosis, entry model, operational structure. the identity had to perform that discipline, not describe it.'),
    text('02 concept', 'the mark is drawn from the maeda clan kamon: five rings around a centre. it represents discipline, reliability, purpose and the connection between separate operating systems forming the bigger structure.'),
    fig([m(f'{P}/gallery/01.jpg', 'from the maeda clan kamon to the expansion mark', '1'), m(f'{P}/gallery/02.jpg', 'the lockup', '1')],
        'from the maeda clan kamon to the expansion mark ; the lockup'),
    text('03 construction'),
    tiles([tile(fm_svg(fm_symbol(stroke=True, dots=True, lines=True), 62), '5 × same radius ; 1 + 2 + 2 ; linked centres', '#0A0A0A'),
           tile(fm_svg(fm_symbol(), 55), None, '#0A0A0A')]),
    text('04 typography', 'inter, two weights. "f. maeda" in bold carries the name; "keiei" — management, in raw japanese — in light carries the practice. the client asked for simplicity and sobriety: one familiar typeface, and the contrast of weight does the rest.'),
    raw('<div class="j2-b j2-fm-spec"><div class="aa">Aa</div><div class="wm">F. Maeda <span>keiei</span></div><span class="j2-cap">inter ; bold + light ; chosen for sobriety — the client asked for simplicity</span></div>'),
    text('05 colour', 'pure black and pure white. no greys, no tints — a binary palette for a firm that sells clear decisions.'),
    swatches([('#0A0A0A', '#0A0A0A ; pure black'), ('#FFFFFF', '#FFFFFF ; pure white')], 'no greys, no tints, no colour.'),
    text('06 rules', 'horizontal lockup for the site and documents; the symbol stands alone at small sizes — favicon, app icon, blind deboss. the five circles are never redrawn, recoloured or rearranged.'),
    tiles([tile(img(f'{P}/gallery/02.jpg', 'horizontal lockup', 'full'), None, '#0A0A0A', r='740 / 360', rm='16 / 9'),
           tile(fm_svg(fm_symbol(), 18), 'min. 16px', '#0A0A0A', r='1')], '740fr 360fr'),
    text('07 applications', 'a one-page site built around a bonsai — growth that is organic, structured and constant. business cards in black and white, a blind deboss, and five stones raked into a karesansui.'),
    fig([m(f'{P}/cover.jpg', 'fmaeda.co')], 'fmaeda.co — the one-page site'),
    fig([m(f'{P}/gallery/03.jpg', 'bonsai lockup', '1'), m(f'{P}/gallery/04.jpg', 'business cards', '1')], 'bonsai lockup ; business cards'),
    fig([m(f'{P}/gallery/05.jpg', 'blind deboss', '1'), m(f'{P}/gallery/06.jpg', 'five stones, karesansui', '1')], 'blind deboss ; five stones, karesansui'),
    text('08 motion', 'the kamon comes apart and the five circles settle into the pentagon — the mark building itself, the way the firm builds structure.'),
    fig([m(f'{P}/gallery/02.mp4', fit=True, bg='#0A0A0A', poster=f'{P}/gallery/02.jpg')]),
    foot(['design — daniel thiemann', 'client — f. maeda keiei', '2026'], 'modal-nextplay', 'next play'),
])

# ── next play ────────────────────────────────────────
P = f'{A}/nextplay'; C = f'{P}/case'
NB = '#0D0D0D'
nextplay = window('nextplay', 'next-play', [
    head('next play', 'branding & identity ; 2026 ; client — n sports (fictional) ; role — brand designer ; with — joana ribeiro',
         'identity & broadcast system for a brazilian esports network', ('@aprenderdesign ↗', 'https://www.aprender.design/')),
    text('01 brief', 'n sports wanted an esports channel of its own: one home for championships, roundtables and highlights, built to bring a young, digital-native audience into a sports broadcaster. digital-first, charismatic, spontaneous — and brazilian without the stereotypes.'),
    text('02 concept', 'next play believes in convergence: the meeting point between gamer culture and the credibility of n sports. two game commands carry the idea — the + and the play ▷ — and the symbol is a portal: a stretched hexagon, like a broadcast lens, framing whatever it holds.'),
    fig([m(f'{C}/cover-loop.mp4', r='4 / 3', bg=NB, poster=f'{P}/cover.jpg')]),
    text('03 two directions', 'before the mark, two wordmark directions: a split one, solid letters against outlined ones, and a wide geometric one. the final mark keeps the weight of the second and the attitude of the first, and condenses both into N▷ locked inside the portal.'),
    fig([m(f'{C}/direction-1.png', 'first direction — nxtplay', '1', fit=True, bg='#FFFFFF'), m(f'{C}/direction-2.png', 'second direction — next play', '1', fit=True, bg='#FFFFFF')], 'first direction — nxtplay, solid + outline ; second direction — next play, wide geometric'),
    text('04 the mark', 'three pieces: a geometric N with rounded terminals, a play chevron standing in for the P with the same weight and radius, and the stretched hexagon that holds them. never split, rotated or placed below the wordmark.'),
    tiles([tile(img(f'{C}/badge.svg', 'next play badge'), 'N + ▷ + portal ; #F22F25', NB, r='740 / 360', rm='16 / 9', w='76%'),
           tile('<div class="j2-row" style="width:78%">' + ''.join(img(f'{C}/{n}.svg', n) for n in ['espadasroxas', 'headsetverde', 'labaredavermelha']) + '</div>',
                '3 symbols', NB, r='1')], '740fr 360fr'),
    text('05 typography', 'legibility with attitude: heavy, compressed type that fills the space with confidence, balanced by a neutral workhorse for everything else. three families, three jobs.'),
    typeblock([(img(f'{C}/type-gravity.svg', 'ABC Gravity XX Compressed specimen'), 'abc gravity xx compressed', 'display ; headlines ; placards'),
               (img(f'{C}/type-monument.svg', 'Monument Extended Bold specimen'), 'monument extended bold', 'brand display ; titles ; primary text'),
               (img(f'{C}/type-plex.svg', 'IBM Plex Sans specimen'), 'ibm plex sans', 'secondary text ; captions ; data')],
              bg=NB, fg='#FFFFFF', fg2='#9A9A9A', line='rgba(255,255,255,0.18)'),
    text('06 colour', 'vibrant chroma, high contrast, nothing neutral. one red for the brand, and one colour per content line — never mixed inside the same symbol.'),
    swatches([('#F22F25', '#F22F25 ; red ; brand + highlights'), ('#5900D9', '#5900D9 ; violet ; championships'),
              ('#B2DF20', '#B2DF20 ; lime ; roundtable'), ('#0D0D0D', '#0D0D0D ; near-black ; base')]),
    text('07 sub-brands', 'the channel unfolds into three content lines, each with one icon and one colour: crossed swords for championships, a headset for the roundtable, a flame for the highlights of the week.'),
    tiles([tile(img(f'{C}/espadasroxas.svg', 'swords'), '<campeonatos> swords ; violet ; dia de jogo, ao vivo', NB, w='40%'),
           tile(img(f'{C}/headsetverde.svg', 'headset'), '<mesa redonda> headset ; lime ; análise, os especialistas falam', NB, w='40%'),
           tile(img(f'{C}/labaredavermelha.svg', 'flame'), '<destaques> flame ; red ; o que rolou, melhores momentos', NB, w='40%')], '1fr 1fr 1fr'),
    text('08 rules', 'never split the mark, rotate it or put it below the wordmark ; never change what sits inside the portal ; never use a content icon as a logo ; never pair low-contrast colours ; never mix colours inside one symbol.'),
    text('09 applications'),
    fig([m(f'{P}/gallery/03.jpg', 'aspas poster', '1'), m(f'{P}/gallery/04.jpg', 'campeonato posters', '1')], 'photography mode — aspas ; typographic mode — campeonato, dia de jogo'),
    fig([m(f'{P}/gallery/05.jpg', 'metro panel', '1'), m(f'{P}/gallery/06.jpg', 'community poster', '1')], 'out-of-home — metro panel ; community mode — o universo dos esports na sua tela'),
    fig([m(f'{P}/gallery/01.jpg', 'badge in three dimensions', '1'), m(f'{P}/gallery/02.jpg', 'mark in three dimensions', '1')], 'the badge in three dimensions ; the mark as an object'),
    text('10 motion'),
    fig([m(f'{P}/gallery/08.mp4', fit=True, bg='#000000', poster=f'{P}/gallery/02.jpg')]),
    text('11 broadcast', 'the championship feed. scorebug, kill feed, team panels and the observed player all sit on stretched-hexagon plates; the violet swords mark the competition, lime and white split the two teams. the map is a generated plate, no real game footage.'),
    fig([m(f'{C}/broadcast-hud.jpg', 'in-game hud')], 'live — the in-game hud over the observer feed'),
    fig([m(f'{C}/broadcast-versus.jpg', 'match day card'), m(f'{C}/broadcast-intervalo.jpg', 'half-time')], 'match day — the typographic mode as a full-screen card ; half-time — the countdown lives inside the portal'),
    text('12 transitions'),
    fig([m(f'{C}/broadcast-01-abertura.mp4', poster=f'{C}/broadcast-01-abertura.jpg')], 'show open, 11 s — the portal ignites and the camera flies through it, the headline cuts on the beat, the match-up opens through the hexagon and the badge turns in to sign off'),
    fig([m(f'{C}/broadcast-02-stinger-replay.mp4', poster=f'{C}/broadcast-02-stinger-replay.jpg'), m(f'{C}/broadcast-03-ace.mp4', poster=f'{C}/broadcast-03-ace.jpg')],
        'replay stinger, 3.5 s — the portal punches through the live feed ; ace, 6 s — five kills, one callout'),
    foot(['design — daniel thiemann & joana ribeiro', 'course — design for communication @aprenderdesign', '2026'], 'modal-zhive', 'z-hive'),
])

# ── z-hive ───────────────────────────────────────────
P = f'{A}/zhive'; C = f'{P}/case'
NV = '#0A1420'
zhive = window('zhive', 'z-hive', [
    head('z-hive', 'brand identity & web design ; 2026 ; client — z-hive, curitiba ; role — brand & web designer',
         'identity & website for a high-end home automation studio', ('the live site ↗', 'https://website-delta-lemon-kcmfovjt1z.vercel.app/')),
    text('01 brief', 'z-hive installs home automation that runs entirely inside the house — no cloud, no subscriptions, no latency. the promise is a home that responds instantly and then gets out of the way, so the design had to feel naturally integrated.'),
        text('02 concept', 'rotina em fluxo — routine in flow. every device answers to one hub, so the logo is one path too: a single ribbon that folds back on itself and forms both a z and an hexagon at once, giving the idea of a connected path.'),
    fig([m(f'{P}/cover.jpg', 'the z-hive symbol', bg=NV)], 'the symbol, as the loading sequence leaves it'),
        text('03 the mark'),
    tiles([tile(img(f'{C}/mark-construction.svg', 'construction on the 60° lattice', 'full'), 'one path ; 60° lattice ; rounded terminals', NV, '#8EC5F5'),
           tile(img(f'{C}/mark-lit.svg', 'the symbol', 'full'), 'signal white on #0A1420', NV, '#BCC7DE')]),
        text('04 typography'),
    typeblock([(img(f'{C}/type-roboto.svg', 'Rotina em Fluxo — Roboto ExtraLight'), 'roboto extralight', 'display ; one promise per screen'),
               (img(f'{C}/type-manrope.svg', 'A sua casa, no seu ritmo — Manrope'), 'manrope', 'bold — headings ; regular — text ; bold caps +0.2em — labels')],
              bg=NV, fg='#FFFFFF', fg2='#8EC5F5', line='rgba(142,197,245,0.18)'),
        text('05 colour'),
    swatches([('#0A1420', '#0A1420 ; navy-black ; base'), ('#8EC5F5', '#8EC5F5 ; ice blue ; the system'),
              ('#E8A552', '#E8A552 ; warm amber ; the home'), ('#FFFFFF', '#FFFFFF ; signal white ; the mark')],
             'cool is the system, warm is the home — never both on one surface.', rad=16),
    text('06 the website', 'the site walks through the house the way the system does. an isometric blueprint maps one hub and its satellites — luz, cam, tv, persiana, clima — with light pulsing along the connections; a scene simulator lets you switch the moment of the day and watch the room answer.'),
    fig([m(f'{C}/hero.jpg', 'z-hive website — hero', bg=NV)]),
    fig([m(f'{P}/gallery/05.svg', 'the isometric blueprint, animated', fit=True, bg=NV)], 'um ecossistema, um fluxo — the blueprint draws itself, then light pulses from the hub to every device'),
    fig([m(f'{C}/cenas.jpg', 'z-hive website — scene simulator', bg=NV)], 'cenas — bom dia, chegando, cinema, jantar, boa noite, férias, foco: pick a moment and the room answers'),
        text('07 applications'),
    fig([m(f'{P}/gallery/01.jpg', 'app splash', '1'), m(f'{P}/gallery/02.jpg', 'business cards', '1')]),
    fig([m(f'{P}/gallery/03.jpg', 'wall panel in walnut', '1'), m(f'{P}/gallery/04.mp4', r='1', bg=NV)]),
    text('08 motion', 'the loading sequence: light runs along the path, the outline closes, and the ribbon fills and switches on.'),
    fig([m(f'{P}/cover.mp4', fit=True, bg=NV, poster=f'{P}/cover.jpg')], 'the site’s loading sequence'),
    foot(['design — daniel thiemann', 'client — z-hive, curitiba', '2026'], 'modal-brunge', 'brunge'),
])

# ── brunge ───────────────────────────────────────────
P = f'{A}/brunge'; C = f'{P}/case'
PAPER, INK = '#E8E8E8', '#111111'
brunge = window('brunge', 'brunge', [
    head('brunge', 'branding & packaging ; 2026 ; client — brunge, specialty coffee roasters ; role — founding partner & brand developer',
         'hand-drawn identity and packaging for a disruptive coffee roastery'),
    text('01 brief', 'brunge is a micro-scale specialty coffee roasting operation that i helped found. it wasn’t born from a business plan, but from an impulse: to roast, to learn, to publish the results. small batches, unconventional coffees, nothing to hide.'),
    text('02 concept', '“run the tests. make the mistakes. publish the numbers.” the identity takes the manifesto literally: the chaotic energy of the coffee nerd behind it, drawn by hand, against the dense technical data of every roast, set in type. a raw language that tells you everything about the coffee.'),
    fig([m(f'{P}/cover.jpg', 'brunge — we roast coffee', '3 / 2')], 'brunge — we roast coffee.'),
    text('03 the hand', 'everything that carries the voice is drawn by hand and vectorised by hand — the wordmark, the character, the lettering, and one seal for every lot.'),
    tiles([tile('<div style="width:78%;display:flex;flex-direction:column;gap:28px;align-items:center">' + img(f'{C}/logo.svg', 'BRUNGE wordmark') + img(f'{C}/weroast.svg', 'WE ROAST lettering') + '</div>',
                'logo', PAPER, INK, r='740 / 360', rm='4 / 3'),
           tile(img(f'{C}/personagem.svg', 'the character'), 'character', PAPER, INK, r='1', w='34%')], '740fr 360fr'),
    text('04 typography', 'two typefaces and a hand. helvetica neue is the voice — lowercase, tight, full stop. space grotesk bold carries the data — every number on the label. the hand draws the rest.'),
    tiles([tile(img(f'{C}/pitch-weroast.png', 'we roast. — helvetica neue', ''), 'helvetica neue ; the voice', PAPER, INK, r='740 / 440', rm='4 / 3', w='80%'),
           tile(img(f'{C}/lot-card.svg', 'lot card set in space grotesk bold'), 'space grotesk bold ; the data', PAPER, INK, r='360 / 440', rm='1', w='86%')], '740fr 360fr'),
    text('05 the numbers', 'every lot is published on its label: origin, variety, process, altitude, tasting notes, roast date — and the roast itself: green weight, roast yield, agtron colour of the whole bean and of the ground coffee. the label is a spec sheet.'),
    fig([m(f'{P}/gallery/01.jpg', 'lot card ye-333', '1'), m(f'{P}/gallery/02.jpg', 'the back of the card', '1')]),
        text('06 applications'),
    fig([m(f'{P}/gallery/03.jpg', 'lot cards and a coffee', '1'), m(f'{P}/gallery/04.jpg', 'cards and a marker', '1')]),
    fig([m(f'{P}/gallery/05.jpg', 'the affective form', '1'), m(f'{P}/gallery/06.jpg', 'sample 004', '1')]),
    foot(['design — daniel thiemann', 'client — brunge', '2026'], 'modal-tarot', 'the major arcana of design'),
])

# ── the major arcana of design ───────────────────────
P = f'{A}/tarot'
RED, CREAM, BLK = '#AF3131', '#F6E4D6', '#171717'
tarot = window('tarot', 'major-arcana', [
    head('the major arcana of design', 'linocut & editorial ; 2025 ; course — @aprenderdesign ; role — printmaker & editorial designer',
         'a linocut tarot card and presentation for the campana brothers', ('@aprenderdesign ↗', 'https://www.aprender.design/')),
    text('01 brief', 'the major arcana of design: draw the tarot card of the guide you follow in the design practice. a project for @aprenderdesign’s course.'),
    text('02 the guide', 'humberto and fernando campana — brazilian designers of design-art, built on reuse, natural materials and objects that refuse to be conventional. from desconfortáveis, their first show, in a warehouse in vila madalena in 1989, to moma in 1998. their attention to sustainability and conservation is what put them on the card.'),
    fig([m(f'{P}/gallery/03.jpg', 'o arcano maior do design — the card', '3 / 2', fit=True, bg=RED)], 'o arcano maior do design — os irmãos'),
    text('03 the matrix', 'carved by hand into lino, 16 × 9 cm'),
    fig([m(f'{P}/gallery/01.jpg', 'the lino matrix', '1', fit=True, bg='#000000'), m(f'{P}/gallery/02.jpg', 'the print beside the matrix', '1')], 'the matrix ; the print beside it'),
        text('04 the presentation'),
    fig([m(f'{P}/gallery/04.jpg', 'irmãos campana spread', '3 / 2', fit=True, bg=RED)], 'irmãos campana — desconfortáveis, 1989'),
    fig([m(f'{P}/gallery/05.jpg', 'the spreads', '1', fit=True, bg=BLK), m(f'{P}/gallery/06.jpg', 'matriz', '1', fit=True, bg=RED)]),
        text('05 colour'),
    swatches([(RED, RED), (CREAM, CREAM), (BLK, BLK)]),
    foot(['design — daniel thiemann', 'course — @aprenderdesign', '2025'], 'modal-fmaeda', 'f. maeda keiei'),
])

# ── inject ───────────────────────────────────────────
import os
p = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'index.html')
s = open(p).read()
a = s.index('  <!-- Case windows (J2)') if '<!-- Case windows (J2)' in s else s.index('  <!-- Brunge Project Modal')
b = s.index('  <!-- Curriculum Modal')
block = ('  <!-- Case windows (J2) — generated by tools/build_cases.py; one per project, own URL /work/<slug> -->\n'
         + brunge + tarot + fmaeda + nextplay + zhive)
s = s[:a] + block + s[b:]
open(p, 'w').write(s)
print('ok', len(s), s.count('class="modal-panel modal-project j2"'))
