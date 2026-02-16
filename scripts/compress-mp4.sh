#!/usr/bin/env bash
# Compress MP4/MOV videos with FFmpeg (H.264, web-optimized).
# Run from repo root: ./scripts/compress-mp4.sh
# Requires: ffmpeg on PATH.
#
# Usage:
#   ./scripts/compress-mp4.sh                    # default: public/assets
#   ./scripts/compress-mp4.sh /path/to/videos
#
# Options (env):
#   CRF=28           Video quality (18–28 typical; lower = larger file, default 23)
#   PRESET=medium    x264 preset: ultrafast, fast, medium, slow (default: medium)
#   DRY_RUN=1        Only list files, do not compress
#
# Replaces originals in place. Backup the directory first if needed.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
VIDEO_DIR="${1:-$REPO_ROOT/public/assets}"
CRF="${CRF:-23}"
PRESET="${PRESET:-medium}"
DRY_RUN="${DRY_RUN:-0}"

if ! command -v ffmpeg &>/dev/null; then
  echo "Error: ffmpeg is required. Install with: brew install ffmpeg (macOS) or apt install ffmpeg (Linux)"
  exit 1
fi

if [[ ! -d "$VIDEO_DIR" ]]; then
  echo "Error: directory not found: $VIDEO_DIR"
  exit 1
fi

echo "Scanning: $VIDEO_DIR (CRF=$CRF, preset=$PRESET)"
[[ "$DRY_RUN" == "1" ]] && echo "DRY RUN — no changes will be made"

count=0
while IFS= read -r -d '' f; do
  dir="${f%/*}"
  base="${f##*/}"
  name="${base%.*}"
  ext="${f##*.}"
  ext_lower="$(echo "$ext" | tr '[:upper:]' '[:lower:]')"

  case "$ext_lower" in
    mp4|mov)
      out_mp4="${dir}/${name}.mp4"
      tmp_out="${dir}/${name}.compressed.$$.mp4"

      if [[ "$DRY_RUN" == "1" ]]; then
        echo "Would compress: $f"
        ((count++)) || true
        continue
      fi

      # H.264 video, AAC audio, faststart for web streaming
      if ffmpeg -y -i "$f" \
        -c:v libx264 -crf "$CRF" -preset "$PRESET" \
        -movflags +faststart \
        -c:a aac -b:a 128k \
        -hide_banner -loglevel warning \
        "$tmp_out" 2>/dev/null && [[ -f "$tmp_out" ]]; then
        mv "$tmp_out" "$out_mp4"
        # If we wrote to a different path (e.g. .mov -> .mp4), remove original
        if [[ "$f" != "$out_mp4" ]]; then
          rm -f "$f"
        fi
        echo "Compressed: $f -> ${name}.mp4"
        ((count++)) || true
      else
        rm -f "$tmp_out"
        echo "Skip (failed): $f"
      fi
      ;;
    *) ;;
  esac
done < <(find "$VIDEO_DIR" -type f \( -iname "*.mp4" -o -iname "*.mov" \) ! -name "._*" ! -name "*.compressed.*.mp4" -print0 2>/dev/null)

echo "Done. Processed $count video(s) in $VIDEO_DIR"
