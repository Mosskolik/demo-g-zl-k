"""
Kaggle not defteri (GPU) giriş noktası.
Kod ve BrailleLens verisi "orbital-braille-kod" veri setinden gelir.
1) Sentetik Türkçe kabartma sayfa üret (paralel)  2) Nokta bulucuyu eğit  3) BrailleLens'te ölç.
Çıktılar /kaggle/working: nokta_modeli.pt, olcum.json, egitim.log
"""
import glob, os, shutil, subprocess, sys, time
from multiprocessing import Pool

GIRIS = glob.glob('/kaggle/input/**/uretici.py', recursive=True)
KOD_KAYNAK = os.path.dirname(GIRIS[0])
KOD = '/kaggle/working/kod'
VERI = '/kaggle/temp/sentetik'
_bl = glob.glob('/kaggle/input/**/bl_*.jp*g', recursive=True)
GERCEK = os.path.dirname(_bl[0]) if _bl else ''
ADET = int(os.environ.get('ADET', '24000'))
TUR = os.environ.get('TUR', '30')

shutil.copytree(KOD_KAYNAK, KOD, dirs_exist_ok=True, ignore=shutil.ignore_patterns('braillelens'))
os.makedirs(VERI, exist_ok=True)


def uret(parca):
    tohum, adet = parca
    subprocess.run([sys.executable, os.path.join(KOD, 'uretici.py'), VERI, str(adet), str(tohum)], check=True)


if __name__ == '__main__':
    t0 = time.time()
    n = os.cpu_count() or 4
    parcalar = [(1000 + i, ADET // (n * 4)) for i in range(n * 4)]
    with Pool(n) as p:
        p.map(uret, parcalar)
    print(f'üretildi: {len(glob.glob(VERI + "/*.jpg"))} sayfa, {time.time() - t0:.0f} sn', flush=True)
    subprocess.run([sys.executable, os.path.join(KOD, 'egit.py'), '--veri', VERI, '--cikti', '/kaggle/working/nokta_modeli.pt',
                    '--tur', TUR, '--batch', '32', '--boyut', '384', '--lr', '3e-3'], check=True, cwd=KOD)
    if GERCEK: subprocess.run([sys.executable, os.path.join(KOD, 'degerlendir.py'), '--model', '/kaggle/working/nokta_modeli.pt',
                    '--gercek', GERCEK, '--rapor', '/kaggle/working/olcum.json'], check=True, cwd=KOD)
    print(f'bitti: {time.time() - t0:.0f} sn', flush=True)
