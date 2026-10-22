# Levis Quest – installierbares Pokémon-Quest-Handbuch

Adresse: https://schlayer1.github.io/pokemonquest/

## Auf einem Android-Tablet installieren

1. Die Adresse in Google Chrome öffnen und vollständig laden lassen.
2. Im Chrome-Menü **⋮ → Zum Startbildschirm hinzufügen → Installieren** wählen. Falls angeboten, kann auch die Schaltfläche **Auf dem Tablet installieren** im Handbuch genutzt werden.
3. Danach startet **Levis Quest** über das Buch-mit-Blitz-Symbol in einem eigenen App-Fenster.

Das Handbuch speichert Team, Album, Wunschliste, Vorrat und Einstellungen im Browser des Geräts. In **Mein Lager → Sicherung speichern** kann der Fortschritt als JSON gesichert und auf ein anderes Gerät übertragen werden. Eine Sicherung aus der früheren HTML-Version lässt sich ebenfalls laden.

## Offline nutzen

Nach dem ersten vollständigen Laden speichert der Service Worker das Handbuch und die Installationsdateien. Die fünf Boss-Bilder sind bereits in der HTML enthalten. Unterhalb des Handbuchs können zusätzlich alle 151 Pokémon-Bilder im WLAN gespeichert werden. Andere Bilder und Schriftarten werden beim Online-Aufruf zwischengespeichert; ohne diese Dateien bleiben Systemschrift und Platzhalter nutzbar.

Die App benötigt HTTPS. Direkt über `file://` geöffnete Dateien bieten keine PWA-Installation. GitHub Pages stellt das nötige HTTPS bereit. Die Pfade im Manifest sind ausdrücklich auf `/pokemonquest/` eingestellt.

## Dateien

- `index.html`: das bestehende vollständige Handbuch mit Manifest-Verweis und Installations-/Offline-Bereich
- `manifest.webmanifest`: App-Name, Startadresse, Anzeige im eigenen Fenster und Symbole
- `pwa.js`: Installation, Update-Hinweis, Verknüpfungen und optionale Bildspeicherung
- `sw.js`: Offline-Start und begrenzter Mediencache
- `icons/`: normale Symbole, Android-Maskable-Symbole und Apple-Touch-Symbol
- `.nojekyll`: direkte statische Bereitstellung über GitHub Pages

Bei späteren Änderungen an App-Dateien die `VERSION` in `sw.js` erhöhen, damit bereits installierte Apps eine neue Version anbieten. Der Button **Neue Version öffnen** aktiviert die bereitstehende Version; gespeicherte Nutzereinträge werden dabei nicht gelöscht.

Privates Fan-Projekt. Pokémon und die zugehörigen Figuren gehören ihren jeweiligen Rechteinhabern. Pokémon-Bilder: PokéAPI-Sprites. App-Symbol: eigens erzeugtes Abenteuerbuch-mit-Blitz-Motiv.
