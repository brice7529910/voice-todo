#!/bin/sh
# Assemble le jeu en un seul fichier : ../la_derniere_peche.html
cd "$(dirname "$0")"
{
printf '<!DOCTYPE html>\n<html lang="fr" data-big="0" data-anim="1">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<meta name="theme-color" content="#0f1b2d">\n<title>La Dernière Pêche</title>\n<style>\n'
cat style.css
printf '\n</style>\n</head>\n<body>\n<div id="app"></div>\n<script>\n'
cat data.js art.js engine.js
printf '\n</script>\n</body>\n</html>\n'
} > ../la_derniere_peche.html
