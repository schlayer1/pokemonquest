#!/usr/bin/env python3
"""
Extract embedded Base64 boss artwork from index.html.bak to standalone PNG files.
"""
import os
import json
import base64

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HTML_FILE = os.path.join(ROOT, "index.html.bak")
OUTPUT_DIR = os.path.join(ROOT, "public", "assets", "bosses")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def main():
    if not os.path.exists(HTML_FILE):
        print(f"Error: {HTML_FILE} not found!")
        return

    with open(HTML_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    idx = content.find("const BOSS_ART=")
    if idx == -1:
        print("Error: BOSS_ART not found in index.html.bak!")
        return

    start_brace = content.find("{", idx)
    brace = 0
    in_q = False
    end_pos = start_brace
    for i in range(start_brace, len(content)):
        c = content[i]
        if c == '"' and content[i-1] != '\\':
            in_q = not in_q
        elif not in_q:
            if c == '{':
                brace += 1
            elif c == '}':
                brace -= 1
                if brace == 0:
                    end_pos = i + 1
                    break

    raw_json = content[start_brace:end_pos]

    try:
        data = json.loads(raw_json)
        print(f"Found {len(data)} bosses in BOSS_ART: {list(data.keys())}")
        for boss_id, b64_uri in data.items():
            header, encoded = b64_uri.split(",", 1)
            raw_bytes = base64.b64decode(encoded)
            out_path = os.path.join(OUTPUT_DIR, f"boss_{boss_id}.png")
            with open(out_path, "wb") as img_file:
                img_file.write(raw_bytes)
            print(f"Saved {out_path} ({len(raw_bytes)} bytes)")
        print("Boss art extraction complete!")
    except Exception as e:
        print(f"Failed to parse BOSS_ART JSON: {e}")

if __name__ == "__main__":
    main()
