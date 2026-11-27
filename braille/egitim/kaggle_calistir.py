"""
Kaggle not defteri (GPU) giriş noktası.
Kod ve BrailleLens verisi "orbital-braille-kod" veri setinden gelir.
1) Sentetik Türkçe kabartma sayfa üret (paralel)  2) Hücre bulucuyu eğit
3) Ölç: sentetik Türkçe test sayfaları + BrailleLens gerçek fotoğrafları (uçtan uca hücre doğruluğu)
Çıktılar /kaggle/working: hucre_modeli.pt, olcum_*.txt
"""
import glob, os, shutil, subprocess, sys, time
from multiprocessing import Pool

GIRIS = glob.glob('/kaggle/input/**/uretici.py', recursive=True)
KOD_KAYNAK = os.path.dirname(GIRIS[0])
KOD = '/kaggle/working/kod'
VERI = '/kaggle/temp/sentetik'
TEST = '/kaggle/temp/test'
_bl = glob.glob('/kaggle/input/**/gt_bl.json', recursive=True)  # test sayfaları (eğitimde kullanılmaz)
GERCEK = os.path.dirname(_bl[0]) if _bl else ''
ADET = int(os.environ.get('ADET', '24000'))
TUR = os.environ.get('TUR', '20')
_b = glob.glob('/kaggle/input/**/baslangic_hucre.pt', recursive=True)
BASLANGIC = _b[0] if _b else ''
MODEL = '/kaggle/working/hucre_modeli.pt'
# gerçek fotoğraflar (ayrı gizli veri seti): liste dosyasındaki yollar kendi klasörüne göre
_g = glob.glob('/kaggle/input/**/gercek_liste.txt', recursive=True)
GERCEK_LISTE = ''
if _g:
    kok = os.path.dirname(_g[0]); GERCEK_LISTE = '/kaggle/working/gercek_liste_tam.txt'
    yollar = [os.path.join(kok, l.strip()) for l in open(_g[0]) if l.strip()]
    yollar = [y for y in yollar if os.path.exists(y)]
    open(GERCEK_LISTE, 'w').write('\n'.join(yollar) + '\n')
    print('gerçek fotoğraf:', len(yollar), flush=True)

shutil.copytree(KOD_KAYNAK, KOD, dirs_exist_ok=True, ignore=shutil.ignore_patterns('braillelens', '*.pt'))


def uret(parca):
    klasor, tohum, adet = parca
    subprocess.run([sys.executable, os.path.join(KOD, 'uretici.py'), klasor, str(adet), str(tohum)], check=True)


def calistir(args, cikti):
    r = subprocess.run([sys.executable] + args, cwd=KOD, capture_output=True, text=True)
    open(cikti, 'w').write(r.stdout + r.stderr)
    print(r.stdout[-3000:], r.stderr[-2000:], flush=True)


if __name__ == '__main__':
    t0 = time.time()
    n = os.cpu_count() or 4
    parcalar = [(VERI, 1000 + i, ADET // (n * 4)) for i in range(n * 4)] + [(TEST, 999, 100)]
    with Pool(n) as p:
        p.map(uret, parcalar)
    print(f'üretildi: {len(glob.glob(VERI + "/*.jpg"))} sayfa, {time.time() - t0:.0f} sn', flush=True)
    subprocess.run([sys.executable, os.path.join(KOD, 'egit.py'), '--veri', VERI, '--cikti', MODEL,
                    '--tur', TUR, '--batch', '32', '--boyut', '384', '--lr', '1e-3' if BASLANGIC else '3e-3']
                   + (['--baslangic', BASLANGIC] if BASLANGIC else [])
                   + (['--gercek_liste', GERCEK_LISTE, '--gercek_oran', os.environ.get('GERCEK_ORAN', '0.3')] if GERCEK_LISTE else []),
                   check=True, cwd=KOD)
    calistir(['uctan_uca.py', '--model', MODEL, '--sentetik', TEST, '--adet', '100'], '/kaggle/working/olcum_sentetik.txt')
    if GERCEK:
        calistir(['uctan_uca.py', '--model', MODEL, '--gercek', GERCEK, '--gt', os.path.join(GERCEK, 'gt_bl.json')], '/kaggle/working/olcum_braillelens.txt')
    print(f'bitti: {time.time() - t0:.0f} sn', flush=True)
