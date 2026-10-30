#!/usr/bin/env python3
"""
Generate high quality neural voice audio using Microsoft Edge-TTS for both
Killian (de-DE-KillianNeural) and Katja (de-DE-KatjaNeural).
Transcodes to compact AAC M4A using macOS afconvert, writes manifest.json.
"""
import os
import sys
import json
import asyncio
import subprocess
import edge_tts

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICE_DIR = os.path.join(ROOT, "public", "audio", "voice")

PERSONAS = {
    "killian": "de-DE-KillianNeural",
    "katja": "de-DE-KatjaNeural"
}

VOICE_TEXTS = {
    # Zählen beim Kochen
    "count_1": "Eins!",
    "count_2": "Zwei!",
    "count_3": "Drei!",
    "count_4": "Vier!",
    "count_5": "Fünf! Der Topf ist voll!",

    # Küche & Topf-Aktionen
    "pot_empty": "Dein Topf ist wieder leer.",
    "pot_full_warning": "Der Topf ist schon voll. Tippe auf Kochen!",
    "pot_iron": "Eisentopf. Jedes Feld braucht drei Zutaten im Spiel.",
    "pot_bronze": "Bronzetopf. Jedes Feld braucht zehn Zutaten im Spiel.",
    "pot_silver": "Silbertopf. Jedes Feld braucht fünfzehn Zutaten im Spiel.",
    "pot_gold": "Goldtopf. Jedes Feld braucht zwanzig Zutaten im Spiel.",
    "cook_start": "Der Topf brodelt! Gleich siehst du, wer angelockt wird!",
    "cook_deduct": "Zutaten wurden von deinem Vorrat abgezogen.",
    "cook_undo": "Zutaten wieder zurückgelegt.",
    
    # 6 Hauptbereiche Intros
    "intro_cooking": "Willkommen in deiner Kochschule, Levi! Zähle fünf Zutaten in den Topf. Die Topffarbe bestimmt, wie viele Zutaten du brauchst!",
    "intro_pokedex": "Hier ist dein Kanto-Lexikon! Alle 151 Pokémon mit Entwicklungsstufen und ihren Lieblingsgerichten.",
    "intro_album": "Dein Basislager! Schau dir deine gesammelten Sticker an und stelle dein 3er-Expeditionsteam zusammen.",
    "intro_worlds": "Der Insel-Atlas! Zwölf Welten warten auf dich. Achte immer auf den passenden Typen-Bonus!",
    "intro_training": "Levis Trainingslager! Hier lernst du die besten P-Steine, Teilungssteine und Attacken für dein Team.",
    "intro_escape": "Levis Reaktions-Schule! Trainiere dein Timing für den rettenden Fluchtknopf gegen mächtige Bosse.",

    # Reaktions-Schule / Boss-Ausweichen
    "boss_alert_6": "Achtung! Glurak lädt Flammenwurf auf! Fluchtknopf bereitmachen!",
    "boss_alert_130": "Achtung! Garados lädt Hyperstrahl auf! Sofort ausweichen!",
    "boss_alert_94": "Achtung! Gengar bereitet den Spukball vor! Bereitmachen!",
    "boss_alert_95": "Achtung! Onix setzt Felswurf ein! Gleich fliehen!",
    "boss_alert_150": "Achtung! Mewtu lädt Psychostoß auf! Höchste Alarmstufe!",
    "dodge_now": "JETZT FLIEHEN!",
    "dodge_success": "Klasse gemacht, Levi! Dein Team ist dem Angriff ausgewichen!",
    "dodge_fail": "Oh nein, zu spät! Versuch es gleich noch einmal!",
    "dodge_early": "Zu früh ausgewichen! Warte auf das rote Signal!",

    # Team & Basislager
    "team_empty": "Dein Team ist noch leer. Wähle drei Freunde für dein Abenteuer aus!",
    "team_saved": "Super Levi! Dein Team ist startklar für die nächste Expedition!",
    "team_doctor_tip": "Tipp vom Team-Doktor: Ein Pokémon mit Protzer und drei Teilungs-Steinen stärkt dein ganzes Team!",
    "sticker_added": "Klasse Levi! Ein neuer Sticker für dein Album!",
    "sticker_removed": "Sticker wieder aus dem Album entfernt.",

    # 4 Neue Features Ansagen
    "bingo_godroll": "Boah Levi! Ein Fünf-Sterne Bingo! Dieses Pokémon ist perfekt für dein Team!",
    "power_warning": "Achtung Levi! Diese Welt ist sehr stark. Trainiere dein Team lieber noch ein wenig!",
    "power_ready": "Klasse! Dein Team ist stark genug für dieses Abenteuer!",
    "deko_goal_reached": "Super gemacht! Du hast genug Tickets für deine nächste Statue!",
    "move_training_tip": "Wähle gleiche Pokémon oder denselben Typ, um die Erfolgschance beim Attacken-Training zu steigern!"
}

def transcode_to_m4a(mp3_path, m4a_path):
    try:
        cmd = ["/usr/bin/afconvert", "-f", "m4af", "-d", "aac", "-b", "64000", mp3_path, m4a_path]
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if os.path.exists(m4a_path) and os.path.getsize(m4a_path) > 300:
            if os.path.exists(mp3_path):
                os.remove(mp3_path)
            return True
    except Exception as e:
        print(f"Transcode error for {mp3_path}: {e}")
    return False

async def generate_clip(persona, voice_name, key, text):
    out_dir = os.path.join(VOICE_DIR, persona)
    os.makedirs(out_dir, exist_ok=True)
    m4a_path = os.path.join(out_dir, f"{key}.m4a")
    mp3_path = os.path.join(out_dir, f"{key}.mp3")

    if os.path.exists(m4a_path) and os.path.getsize(m4a_path) > 300:
        return f"/audio/voice/{persona}/{key}.m4a"

    try:
        comm = edge_tts.Communicate(text, voice_name)
        await comm.save(mp3_path)
        if transcode_to_m4a(mp3_path, m4a_path):
            return f"/audio/voice/{persona}/{key}.m4a"
        elif os.path.exists(mp3_path) and os.path.getsize(mp3_path) > 300:
            return f"/audio/voice/{persona}/{key}.mp3"
    except Exception as e:
        print(f"Error generating {persona}/{key}: {e}")
    return None

async def main():
    print(f"Generating Edge-TTS audio clips for {len(PERSONAS)} personas ({len(VOICE_TEXTS)} clips each)...")
    manifest = {p: {} for p in PERSONAS}

    for persona, voice_name in PERSONAS.items():
        print(f"\n--- Generating for Persona: {persona} ({voice_name}) ---")
        for key, text in VOICE_TEXTS.items():
            rel_path = await generate_clip(persona, voice_name, key, text)
            manifest[persona][key] = {
                "file": rel_path,
                "text": text
            }
            if rel_path:
                print(f"  ✓ {key} -> {rel_path}")
            else:
                print(f"  ✗ {key} FAILED")

    manifest_path = os.path.join(VOICE_DIR, "manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)
    print(f"\nVoice manifest successfully saved to {manifest_path}!")

if __name__ == "__main__":
    asyncio.run(main())
