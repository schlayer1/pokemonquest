#!/usr/bin/env python3
"""
Generate high quality neural voice audio using Microsoft Edge-TTS for both
Killian (de-DE-KillianNeural) and Katja (de-DE-KatjaNeural).
Transcodes to compact AAC M4A using macOS afconvert, writes manifest.json.
Generates comprehensive audio coverage for:
- 151 Pokemon descriptions (Pokédex voice entry)
- 151 Pokemon recipe load confirmations ("Rezept für X in den Kochtopf geladen!")
- 18 Recipe preset confirmations ("Kubo-X. Fünf Zutaten liegen im Topf.")
- 18 Recipe cooked confirmations ("Kubo-X gekocht! Gleich siehst du, wer angelockt wird!")
- 12 World descriptions (Insel-Atlas)
- 15 Knowledge guides (Trainingslager)
- Core app sounds (Cooking count, pot tiers, boss alerts, dodges, team status, etc.)
"""
import os
import sys
import json
import re
import asyncio
import subprocess
import edge_tts

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VOICE_DIR = os.path.join(ROOT, "public", "audio", "voice")

PERSONAS = {
    "killian": "de-DE-KillianNeural",
    "katja": "de-DE-KatjaNeural"
}

TYPE_NAMES_DE = {
    "normal": "Normal",
    "fire": "Feuer",
    "water": "Wasser",
    "grass": "Pflanze",
    "electric": "Elektro",
    "ice": "Eis",
    "fighting": "Kampf",
    "poison": "Gift",
    "ground": "Boden",
    "flying": "Flug",
    "psychic": "Psycho",
    "bug": "Käfer",
    "rock": "Gestein",
    "ghost": "Geist",
    "dragon": "Drache",
    "steel": "Stahl",
    "fairy": "Fee",
}

# 1. Base System Voice Texts
BASE_VOICE_TEXTS = {
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
    "team_ready": "Super Levi! Dein 3er-Expeditionsteam ist startklar für das nächste Abenteuer!",
    "team_doctor_tip": "Tipp vom Team-Doktor: Ein Pokémon mit Protzer und drei Teilungs-Steinen stärkt dein ganzes Team!",
    "sticker_added": "Klasse Levi! Ein neuer Sticker für dein Album!",
    "sticker_removed": "Sticker wieder aus dem Album entfernt.",

    # Spezielle Features Ansagen
    "bingo_godroll": "Boah Levi! Ein Fünf-Sterne Bingo! Dieses Pokémon ist perfekt für dein Team!",
    "power_warning": "Achtung Levi! Diese Welt ist sehr stark. Trainiere dein Team lieber noch ein wenig!",
    "power_ready": "Klasse! Dein Team ist stark genug für dieses Abenteuer!",
    "deko_goal_reached": "Super gemacht! Du hast genug Tickets für deine nächste Statue!",
    "move_training_tip": "Wähle gleiche Pokémon oder denselben Typ, um die Erfolgschance beim Attacken-Training zu steigern!"
}

def load_pokemon():
    path = os.path.join(ROOT, "src", "data", "pokemon.ts")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    match = re.search(r"export const POKEMON:\s*Pokemon\[\]\s*=\s*(\[[\s\S]*?\]);", content)
    if not match:
        raise ValueError("Could not parse POKEMON array")
    return json.loads(match.group(1))

def load_worlds():
    path = os.path.join(ROOT, "src", "data", "worlds.ts")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    match = re.search(r"const RAW_WORLDS:\s*World\[\]\s*=\s*(\[[\s\S]*?\]);", content)
    if not match:
        raise ValueError("Could not parse RAW_WORLDS array")
    return json.loads(match.group(1))

def load_recipes():
    path = os.path.join(ROOT, "src", "data", "recipes.ts")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    matches = re.findall(r"key:\s*'([^']+)',\s*name:\s*'([^']+)'", content)
    return matches

def load_knowledge():
    path = os.path.join(ROOT, "src", "data", "knowledge.ts")
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    matches = re.findall(r"title:\s*'([^']+)',\s*desc:\s*'([^']+)'", content)
    return matches

def build_all_voice_texts():
    texts = dict(BASE_VOICE_TEXTS)
    pokemon_list = load_pokemon()
    pokemon_map = {p["id"]: p["name"] for p in pokemon_list}

    # 1. Pokemon Descriptions & Recipe confirmations for all 151 Pokemon
    for p in pokemon_list:
        p_id = p["id"]
        p_name = p["name"]
        types_de = [TYPE_NAMES_DE.get(t, t) for t in p.get("types", [])]
        types_str = " und ".join(types_de)
        best_move = p.get("bestMove")
        move_str = f" Beste Attacke: {best_move}." if best_move else ""
        
        # Pokedex vorlesen
        desc_text = f"{p_name}, Nummer {p_id}. Typ: {types_str}.{move_str}"
        texts[f"poke_desc_{p_id}"] = desc_text

        # Rezept in Topf geladen
        recipe_text = f"Rezept für {p_name} in den Kochtopf geladen!"
        texts[f"poke_recipe_{p_id}"] = recipe_text

    # 2. 18 Recipes (Presets & Cooked)
    recipes = load_recipes()
    for key, name in recipes:
        texts[f"recipe_preset_{key}"] = f"{name}. Fünf Zutaten liegen im Topf."
        texts[f"recipe_cooked_{key}"] = f"{name} gekocht! Gleich siehst du, wer angelockt wird!"

    # 3. 12 Worlds (Insel-Atlas)
    worlds = load_worlds()
    for w in worlds:
        w_id = w["id"]
        w_name = w.get("germanName", w.get("name"))
        bonus_type = w.get("bonus", "").lower()
        bonus_de = TYPE_NAMES_DE.get(bonus_type, w.get("bonus", ""))
        boss_names = " und ".join(pokemon_map.get(b, f"Pokémon {b}") for b in w.get("bosses", []))
        
        if bonus_type == "none" or not bonus_de:
            world_text = f"Welt {w_id}. {w_name}. Hier hilft jedes deiner stärksten Pokémon. Am Ende wartet Boss {boss_names}!"
        else:
            world_text = f"Welt {w_id}. {w_name}. Hier hilft besonders der Typ {bonus_de}. Am Ende wartet Boss {boss_names}!"
        texts[f"world_desc_{w_id}"] = world_text

    # 4. 15 Knowledge Guide Cards (Trainingslager)
    knowledge = load_knowledge()
    for i, (title, desc) in enumerate(knowledge):
        texts[f"knowledge_{i}"] = f"{title}. {desc}"

    return texts

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

async def generate_single_clip(semaphore, persona, voice_name, key, text, counter, total):
    out_dir = os.path.join(VOICE_DIR, persona)
    os.makedirs(out_dir, exist_ok=True)
    m4a_path = os.path.join(out_dir, f"{key}.m4a")
    mp3_path = os.path.join(out_dir, f"{key}.mp3")

    if os.path.exists(m4a_path) and os.path.getsize(m4a_path) > 300:
        counter["done"] += 1
        return key, f"/audio/voice/{persona}/{key}.m4a", text

    async with semaphore:
        for attempt in range(3):
            try:
                comm = edge_tts.Communicate(text, voice_name)
                await comm.save(mp3_path)
                if transcode_to_m4a(mp3_path, m4a_path):
                    counter["done"] += 1
                    if counter["done"] % 25 == 0 or counter["done"] == total:
                        print(f"  [{persona}] {counter['done']}/{total} ({counter['done']*100//total}%) generiert...")
                    return key, f"/audio/voice/{persona}/{key}.m4a", text
                elif os.path.exists(mp3_path) and os.path.getsize(mp3_path) > 300:
                    counter["done"] += 1
                    return key, f"/audio/voice/{persona}/{key}.mp3", text
            except Exception as e:
                if attempt == 2:
                    print(f"  ✗ Error generating {persona}/{key} ({text[:30]}...): {e}")
                await asyncio.sleep(1.0)
    return key, None, text

async def main():
    print("Building full voice dictionary from project data...")
    voice_texts = build_all_voice_texts()
    total_clips_per_persona = len(voice_texts)
    print(f"Total clips per persona: {total_clips_per_persona}")
    print(f"Personas: {list(PERSONAS.keys())}")
    print(f"Total audio files to verify/generate: {total_clips_per_persona * len(PERSONAS)}")

    manifest = {p: {} for p in PERSONAS}
    semaphore = asyncio.Semaphore(12)  # 12 concurrent workers for fast generation

    for persona, voice_name in PERSONAS.items():
        print(f"\n--- Verifying/Generating for {persona} ({voice_name}) ---")
        counter = {"done": 0}
        tasks = [
            generate_single_clip(semaphore, persona, voice_name, key, text, counter, total_clips_per_persona)
            for key, text in voice_texts.items()
        ]
        results = await asyncio.gather(*tasks)

        for key, rel_path, text in results:
            manifest[persona][key] = {
                "file": rel_path,
                "text": text
            }

    manifest_path = os.path.join(VOICE_DIR, "manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, ensure_ascii=False, indent=2)

    total_valid = sum(
        1 for p in PERSONAS for item in manifest[p].values() if item.get("file")
    )
    print(f"\nFinished! {total_valid} / {total_clips_per_persona * len(PERSONAS)} files ready in manifest!")
    print(f"Saved to {manifest_path}")

if __name__ == "__main__":
    asyncio.run(main())
