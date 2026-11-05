"""
Sincroniza noticias desde el portal oficial de INJUV (injuv.gob.cl) hacia la API
de la plataforma. Uso:

  python backend/scripts/sync_noticias.py [--max N] [--api URL] [--dry-run]

Requiere Python 3.9+ (solo libreria estandar).
"""
import json
import re
import sys
import urllib.request
import urllib.parse
import uuid
from html import unescape

BASE_PORTAL = 'https://www.injuv.gob.cl'
LISTADO = BASE_PORTAL + '/personas/noticias/'
API_BASE_DEFAULT = 'https://plataforma-web-injuv.onrender.com/api'
UA = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

MESES = {
    'enero': 1, 'febrero': 2, 'marzo': 3, 'abril': 4, 'mayo': 5, 'junio': 6,
    'julio': 7, 'agosto': 8, 'septiembre': 9, 'octubre': 10, 'noviembre': 11,
    'diciembre': 12,
}


def fetch(url, binary=False):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        data = r.read()
        return data if binary else data.decode('utf-8', 'ignore')


def strip_tags(html):
    txt = re.sub(r'<(script|style)[^>]*>.*?</\1>', ' ', html, flags=re.S | re.I)
    txt = re.sub(r'<[^>]+>', ' ', txt)
    return re.sub(r'\s+', ' ', unescape(txt)).strip()


def listar_articulos():
    html = fetch(LISTADO)
    links = re.findall(r'href="(/personas/noticias/[^"?#]+)"', html)
    vistos, orden = set(), []
    for l in links:
        if l != '/personas/noticias/' and l not in vistos:
            vistos.add(l)
            orden.append(l)
    return orden


def parsear_articulo(url):
    html = fetch(url)
    t = re.search(r'<title>(.*?)</title>', html, re.S)
    titulo = strip_tags(t.group(1)).split('|')[0].strip() if t else None

    img = None
    m = re.search(r'src="(https://www\.injuv\.gob\.cl/sites/default/files/styles/[^"]*?/noticias/[^"?]+)', html)
    if m:
        img = m.group(1).replace('&amp;', '&')
    else:
        m = re.search(r'property="og:image"\s+content="([^"]+)"', html)
        if m:
            img = m.group(1)

    fecha = None
    m = re.search(r'(\d{1,2}) de ([a-záéíóú]+) de (20\d{2})', html, re.I)
    if m:
        mes = MESES.get(m.group(2).lower())
        if mes:
            fecha = f"{m.group(3)}-{mes:02d}-{int(m.group(1)):02d}"

    parrafos = re.findall(r'<p[^>]*>(.*?)</p>', html, re.S)
    cuerpo = []
    for p in parrafos:
        txt = strip_tags(p)
        if len(txt) < 150:
            continue
        if '(current)' in txt or txt.count('  ') > 8 or txt.startswith('Personas'):
            continue
        cuerpo.append(txt)
    contenido = '\n\n'.join(cuerpo)

    resumen = None
    m = re.search(r'name="description"\s+content="([^"]+)"', html)
    if m:
        resumen = unescape(m.group(1)).split('|')[0].strip()[:490]
    if not resumen and contenido:
        resumen = contenido[:490]

    return titulo, contenido, resumen, img, fecha


def api_json(path, payload=None, method=None):
    req = urllib.request.Request(
        API_BASE + path,
        data=json.dumps(payload).encode() if payload is not None else None,
        headers={'Content-Type': 'application/json', **UA},
        method=method or ('POST' if payload is not None else 'GET'),
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


def subir_imagen(img_url, titulo):
    data = fetch(img_url, binary=True)
    ext = '.jpg'
    m = re.search(r'\.(jpe?g|png|webp|gif)(\?|$)', img_url, re.I)
    if m:
        ext = '.' + m.group(1).lower().replace('jpeg', 'jpg')
    fname = f"noticia_{uuid.uuid4().hex[:8]}{ext}"
    boundary = uuid.uuid4().hex
    body = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="imagen"; filename="{fname}"\r\n'
        f"Content-Type: application/octet-stream\r\n\r\n"
    ).encode() + data + f"\r\n--{boundary}--\r\n".encode()
    req = urllib.request.Request(
        API_BASE + '/noticias/upload-imagen',
        data=body,
        headers={'Content-Type': f'multipart/form-data; boundary={boundary}', **UA},
        method='POST',
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        resp = json.loads(r.read())
    if resp.get('success'):
        return resp['filename']
    raise RuntimeError(f"upload-imagen fallo: {resp}")


def main():
    global API_BASE
    args = sys.argv[1:]
    dry = '--dry-run' in args
    maxn = 6
    if '--max' in args:
        maxn = int(args[args.index('--max') + 1])
    if '--api' in args:
        API_BASE = args[args.index('--api') + 1].rstrip('/')
    else:
        API_BASE = API_BASE_DEFAULT

    existentes = set()
    if not dry:
        resp = api_json('/noticias?estado=todas')
        existentes = {n.get('titulo', '').strip().lower() for n in resp.get('noticias', [])}

    links = listar_articulos()[:maxn]
    print(f"Articulos en listado: {len(links)}")
    creadas = 0
    for link in links:
        url = BASE_PORTAL + link
        try:
            titulo, contenido, resumen, img, fecha = parsear_articulo(url)
        except Exception as e:
            print(f"  [skip] {link[:60]} -> {e}")
            continue
        if not titulo or not contenido:
            print(f"  [skip] sin titulo/contenido: {link[:60]}")
            continue
        if titulo.lower() in existentes:
            print(f"  [dup] {titulo[:60]}")
            continue
        print(f"  -> {titulo[:70]}")
        if dry:
            print(f"     resumen={bool(resumen)} img={bool(img)} fecha={fecha} len={len(contenido)}")
            continue
        filename = None
        if img:
            try:
                filename = subir_imagen(img, titulo)
            except Exception as e:
                print(f"     [warn] imagen no subida: {e}")
        payload = {
            'titulo': titulo,
            'contenido': contenido,
            'resumen': resumen or '',
            'estado': 'activa',
            'fecha_publicacion': fecha or '',
        }
        if filename:
            payload['imagen_url'] = filename
        try:
            resp = api_json('/noticias', payload)
            if resp.get('success'):
                creadas += 1
                print(f"     OK id={resp['noticia']['id']} img={filename}")
            else:
                print(f"     [err] {resp}")
        except Exception as e:
            print(f"     [err] POST: {e}")
    print(f"Noticias creadas: {creadas}")


if __name__ == '__main__':
    main()
