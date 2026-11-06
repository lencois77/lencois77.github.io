"""Stage only public site files for GitHub Pages; keep DIGBOX local."""
from pathlib import Path
import shutil

root = Path(__file__).resolve().parent.parent
out = root / '_site'
if out.exists():
    shutil.rmtree(out)
out.mkdir()
for name in ('index.html', 'work.html', 'blog.html', 'contact.html', '.nojekyll', 'CNAME'):
    source = root / name
    if source.is_file():
        shutil.copy2(source, out / name)
shutil.copytree(root / 'assets', out / 'assets', ignore=shutil.ignore_patterns('.DS_Store'))
# Publish article HTML and media, never editorial README files.
if (root / 'blog').exists():
    for source in (root / 'blog').rglob('*'):
        if source.is_file() and source.suffix.lower() in ('.html', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'):
            target = out / source.relative_to(root)
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, target)
assert not (out / 'digbox').exists()
print('Public site staged in _site/ (DIGBOX excluded).')
