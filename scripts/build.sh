#!/bin/sh
# Construit les 3 sorties à partir de src/ :
#   la_derniere_peche.html (fichier unique hors ligne)
#   pwa/index.html          (même jeu + manifest + service worker)
set -e
cd "$(dirname "$0")/.."
sh src/assemble.sh
HEAD='<link rel="manifest" href="manifest.webmanifest">\n<link rel="icon" href="icon-192.png">\n<link rel="apple-touch-icon" href="icon-192.png">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="mobile-web-app-capable" content="yes">'
SW='<script>\nif('"'"'serviceWorker'"'"' in navigator \&\& /^https?:/.test(location.protocol)){window.addEventListener('"'"'load'"'"',function(){navigator.serviceWorker.register('"'"'sw.js'"'"').catch(function(){});});}\n</script>'
# PWA
sed -e "s#^<title>La Dernière Pêche</title>\$#$HEAD\n&#" -e "s#^</body>\$#$SW\n&#" la_derniere_peche.html > pwa/index.html
echo "OK : la_derniere_peche.html, pwa/index.html"
