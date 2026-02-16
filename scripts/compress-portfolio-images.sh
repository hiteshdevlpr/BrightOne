#!/usr/bin/env bash
# Compress images in the portfolio folder: output AVIF + JPG fallback using FFmpeg.
# Run from repo root: ./scripts/compress-portfolio-images.sh
# Requires: ffmpeg on PATH (with libaom-av1 or libsvtav1 for AVIF).
#
# Usage:
#   ./scripts/compress-portfolio-images.sh                    # default: public/assets/img/portfolio
#   ./scripts/compress-portfolio-images.sh /path/to/portfolio
#
# For each input (jpg/png/webp): creates base.avif and base.jpg (JPG at quality 5).
# Skips .avif inputs. Non-JPG sources are removed after creating avif+jpg.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
PORTFOLIO_DIR="${1:-$REPO_ROOT/public/assets/img/portfolio}"

if ! command -v ffmpeg &>/dev/null; then
  echo "Error: ffmpeg is required. Install with: brew install ffmpeg (macOS) or apt install ffmpeg (Linux)"
  exit 1
fi

if [[ ! -d "$PORTFOLIO_DIR" ]]; then
  echo "Error: directory not found: $PORTFOLIO_DIR"
  exit 1
fi

count=0
while IFS= read -r -d '' f; do
  dir="${f%/*}"
  base="${f##*/}"
  name="${base%.*}"
  ext="${f##*.}"
  ext_lower="$(echo "$ext" | tr '[:upper:]' '[:lower:]')"
  jpg_out="${dir}/${name}.jpg"
  avif_out="${dir}/${name}.avif"

  case "$ext_lower" in
    jpg|jpeg|png|webp)
      # Create JPG fallback (quality 5)
      if ffmpeg -y -i "$f" -q:v 5 "$jpg_out" -hide_banner -loglevel error 2>/dev/null; then
        : "JPG ok"
      else
        echo "Skip (JPG failed): $f"
        continue
      fi
      # Create AVIF (try libsvtav1 first, then libaom-av1)
      if ffmpeg -y -i "$f" -c:v libsvtav1 -crf 35 "$avif_out" -hide_banner -loglevel error 2>/dev/null && [[ -f "$avif_out" ]]; then
        echo "AVIF+JPG: $f -> ${name}.avif + ${name}.jpg"
      else
        rm -f "$avif_out"
        echo "JPG only (no AVIF): $f -> ${name}.jpg"
      fi
      # Remove original if it wasn't JPG (avoid duplicates)
      if [[ "$ext_lower" != "jpg" && "$ext_lower" != "jpeg" ]]; then
        rm -f "$f"
      fi
      ((count++)) || true
      ;;
    avif)
      echo "Skip (already AVIF): $f"
      ;;
    *) ;;
  esac
done < <(find "$PORTFOLIO_DIR" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.webp" \) ! -name "._*" -print0 2>/dev/null)

echo "Done. Processed $count image(s) in $PORTFOLIO_DIR"
