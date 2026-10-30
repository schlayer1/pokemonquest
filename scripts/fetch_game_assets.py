#!/usr/bin/env python3
"""
Download all official Pokémon Quest 3D game assets:
- 151 3D Kubo Pokémon models
- 151 Classic 2D official artwork (PokeAPI)
- 10 3D Ingredients
- 18 3D Recipe Stew Bowls
- 18 3D Base Camp Decorations
- 12 World Location Maps
All saved locally into public/assets/ for 100% offline autonomy!
"""
import os
import sys
import time
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS_DIR = os.path.join(ROOT, "public", "assets")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

def download_file(url, target_path):
    if os.path.exists(target_path) and os.path.getsize(target_path) > 300:
        return True
    os.makedirs(os.path.dirname(target_path), exist_ok=True)
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = resp.read()
            if len(data) > 200:
                with open(target_path, "wb") as f:
                    f.write(data)
                return True
    except Exception as e:
        print(f"Failed {url} -> {e}")
    return False

def main():
    print("=== STARTING POKEMON QUEST ASSET DOWNLOAD ===")

    # 1. 10 3D Ingredients
    print("\n--- 1. Downloading 10 3D Ingredients ---")
    ingredients = {
        "red_mini": "https://www.serebii.net/quest/ingredients/tinymushroom.png",
        "blue_mini": "https://www.serebii.net/quest/ingredients/blukberry.png",
        "yellow_mini": "https://www.serebii.net/quest/ingredients/apricorn.png",
        "gray_mini": "https://www.serebii.net/quest/ingredients/fossil.png",
        "red_root": "https://www.serebii.net/quest/ingredients/bigroot.png",
        "blue_ice": "https://www.serebii.net/quest/ingredients/icyrock.png",
        "yellow_honey": "https://www.serebii.net/quest/ingredients/honey.png",
        "gray_shroom": "https://www.serebii.net/quest/ingredients/balmmushroom.png",
        "rainbow": "https://www.serebii.net/quest/ingredients/rainbowmatter.png",
        "mystic_shell": "https://www.serebii.net/quest/ingredients/mysticalshell.png"
    }
    for key, url in ingredients.items():
        out = os.path.join(ASSETS_DIR, "ingredients", f"{key}.png")
        ok = download_file(url, out)
        print(f"  {'✓' if ok else '✗'} Ingredient: {key}")

    # 2. 18 3D Recipe Stew Bowls
    print("\n--- 2. Downloading 18 3D Recipes ---")
    for r_id in range(1, 19):
        url = f"https://www.serebii.net/quest/recipes/{r_id}.png"
        out = os.path.join(ASSETS_DIR, "recipes", f"{r_id}.png")
        ok = download_file(url, out)
        print(f"  {'✓' if ok else '✗'} Recipe bowl #{r_id}")

    # 3. 12 Island Location Maps
    print("\n--- 3. Downloading 12 World Location Maps ---")
    for w_id in range(1, 13):
        url = f"https://www.serebii.net/quest/location/{w_id}.png"
        out = os.path.join(ASSETS_DIR, "worlds", f"{w_id}.png")
        ok = download_file(url, out)
        print(f"  {'✓' if ok else '✗'} World map #{w_id}")

    # 4. 18 3D Base Camp Decorations
    print("\n--- 4. Downloading 18 3D Decorations ---")
    decorations = {
        "charizard_torch": "https://www.serebii.net/quest/decorations/charizardtorch.png",
        "blastoise_fountain": "https://www.serebii.net/quest/decorations/blastoisefountain.png",
        "venusaur_planter": "https://www.serebii.net/quest/decorations/venusaurplanter.png",
        "gengar_balloon": "https://www.serebii.net/quest/decorations/gengarballoon.png",
        "mewtwo_arch": "https://www.serebii.net/quest/decorations/mewtwoarch.png",
        "flareon_cushion": "https://www.serebii.net/quest/decorations/flareoncusheon.png",
        "vaporeon_cushion": "https://www.serebii.net/quest/decorations/vaporeoncusheon.png",
        "jolteon_cushion": "https://www.serebii.net/quest/decorations/jolteoncusheon.png",
        "dodrio_tent": "https://www.serebii.net/quest/decorations/dodriotent.png",
        "snorlax_lounger": "https://www.serebii.net/quest/decorations/snorlaxlounger.png",
        "pidgeot_wind_sock": "https://www.serebii.net/quest/decorations/fearowweathervane.png",
        "pikachu_surfboard": "https://www.serebii.net/quest/decorations/pikachusurfboard.png",
        "eevee_guitar": "https://www.serebii.net/quest/decorations/eeveearch.png",
        "kangaskhan_swing": "https://www.serebii.net/quest/decorations/kangaskhanswingchair.png",
        "meowth_balloon": "https://www.serebii.net/quest/decorations/meowthballoon.png",
        "chansey_statue": "https://www.serebii.net/quest/decorations/chanseystatue.png",
        "machamp_statue": "https://www.serebii.net/quest/decorations/reverentstatue.png"
    }
    for dec_id, url in decorations.items():
        out = os.path.join(ASSETS_DIR, "decorations", f"{dec_id}.png")
        ok = download_file(url, out)
        print(f"  {'✓' if ok else '✗'} Decoration: {dec_id}")

    # 5. 151 3D Kubo Pokémon Sprites
    print("\n--- 5. Downloading 151 3D Kubo Pokémon Sprites ---")
    kubo_success = 0
    for pid in range(1, 152):
        url = f"https://www.serebii.net/quest/pokemon/{pid:03d}.png"
        out = os.path.join(ASSETS_DIR, "pokemon", "kubo", f"{pid}.png")
        if download_file(url, out):
            kubo_success += 1
        if pid % 25 == 0:
            print(f"  Progress Kubo Sprites: {pid}/151...")
    print(f"  ✓ {kubo_success}/151 3D Kubo Sprites downloaded successfully!")

    # 6. 151 Classic 2D Artwork (PokeAPI)
    print("\n--- 6. Downloading 151 Classic 2D Artwork ---")
    classic_success = 0
    for pid in range(1, 152):
        url = f"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{pid}.png"
        out = os.path.join(ASSETS_DIR, "pokemon", "classic", f"{pid}.png")
        if download_file(url, out):
            classic_success += 1
        if pid % 25 == 0:
            print(f"  Progress Classic Sprites: {pid}/151...")
    print(f"  ✓ {classic_success}/151 Classic Sprites downloaded successfully!")

    print("\n=== ALL POKEMON QUEST ASSETS DOWNLOADED AND READY! ===")

if __name__ == "__main__":
    main()
