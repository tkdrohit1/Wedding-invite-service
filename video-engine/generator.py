"""
Wedding Video Generator Engine
Generates 1080x1920 9:16 mobile wedding invitation videos with custom themes,
typography, particle animations, and audio sync using Pillow and FFmpeg.
"""

import sys
import os
import json
import math
import subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# 1080x1920 (9:16 Vertical for WhatsApp Status & Instagram Reels)
WIDTH = 1080
HEIGHT = 1920
FPS = 30
DURATION_SEC = 18
TOTAL_FRAMES = FPS * DURATION_SEC

# FFmpeg binary location
FFMPEG_BIN = r"C:\Users\Rohit\AppData\Roaming\Python\Python314\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe"
if not os.path.exists(FFMPEG_BIN):
    FFMPEG_BIN = "ffmpeg"

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
FONTS_DIR = os.path.join(SCRIPT_DIR, "fonts")
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)

def load_fonts():
    cinzel_path = os.path.join(FONTS_DIR, "Cinzel-Bold.ttf")
    playfair_path = os.path.join(FONTS_DIR, "PlayfairDisplay-Bold.ttf")
    vibes_path = os.path.join(FONTS_DIR, "GreatVibes-Regular.ttf")
    rozha_path = os.path.join(FONTS_DIR, "RozhaOne-Regular.ttf")
    
    # Fallback to standard if missing
    def safe_font(font_path, size):
        try:
            return ImageFont.truetype(font_path, size)
        except Exception:
            return ImageFont.load_default()

    return {
        "title_lg": safe_font(playfair_path, 88),
        "title_md": safe_font(cinzel_path, 60),
        "script_hero": safe_font(vibes_path, 110),
        "script_sub": safe_font(vibes_path, 72),
        "body_lg": safe_font(cinzel_path, 36),
        "body_md": safe_font(cinzel_path, 28),
        "body_sm": safe_font(cinzel_path, 22),
        "devanagari_lg": safe_font(rozha_path, 72)
    }

def hex_to_rgb(hex_code, default=(212, 175, 55)):
    hex_code = hex_code.lstrip('#')
    try:
        if len(hex_code) == 6:
            return tuple(int(hex_code[i:i+2], 16) for i in (0, 2, 4))
        elif len(hex_code) == 3:
            return tuple(int(hex_code[i]*2, 16) for i in range(3))
    except Exception:
        pass
    return default

def draw_gradient_background(draw, t_factor, col_top, col_bottom):
    # Smooth vertical linear gradient
    for y in range(0, HEIGHT, 4):
        interp = y / HEIGHT
        r = int(col_top[0] * (1 - interp) + col_bottom[0] * interp)
        g = int(col_top[1] * (1 - interp) + col_bottom[1] * interp)
        b = int(col_top[2] * (1 - interp) + col_bottom[2] * interp)
        draw.rectangle([(0, y), (WIDTH, y + 4)], fill=(r, g, b))

def draw_ornate_border(draw, t, primary_col):
    # Outer luxury frame
    margin = 50
    draw.rectangle([(margin, margin), (WIDTH - margin, HEIGHT - margin)], outline=primary_col, width=3)
    draw.rectangle([(margin + 16, margin + 16), (WIDTH - margin - 16, HEIGHT - margin - 16)], outline=(*primary_col, 140) if len(primary_col) == 3 else primary_col, width=1)
    
    # Corner flourishes
    corner_size = 40
    corners = [
        (margin + 16, margin + 16),
        (WIDTH - margin - 16, margin + 16),
        (margin + 16, HEIGHT - margin - 16),
        (WIDTH - margin - 16, HEIGHT - margin - 16)
    ]
    for cx, cy in corners:
        draw.ellipse([(cx - 8, cy - 8), (cx + 8, cy + 8)], fill=primary_col)
        draw.arc([(cx - corner_size, cy - corner_size), (cx + corner_size, cy + corner_size)], 0, 360, fill=primary_col, width=2)

def draw_particles(draw, frame_idx, primary_col):
    # Golden floating bokeh sparkles
    num_particles = 45
    for i in range(num_particles):
        seed_x = (i * 127 + 73) % WIDTH
        seed_y = (i * 311 + 47) % HEIGHT
        speed = 0.5 + (i % 5) * 0.4
        current_y = (seed_y - int(frame_idx * speed)) % HEIGHT
        rad = 2 + (i % 4)
        alpha = int(120 + 100 * math.sin((frame_idx + i * 15) * 0.08))
        draw.ellipse([(seed_x - rad, current_y - rad), (seed_x + rad, current_y + rad)], fill=primary_col)

def render_video_for_invite(invite_data, output_path, music_path=None):
    fonts = load_fonts()
    couple = invite_data.get("couple", {})
    groom = couple.get("groomName", "Groom").split()[0]
    bride = couple.get("brideName", "Bride").split()[0]
    full_groom = couple.get("groomName", "Deepak Sharma")
    full_bride = couple.get("brideName", "Pooja Verma")
    ceremonies = invite_data.get("ceremonies", [])
    venue = invite_data.get("venue", {}).get("name", "The Royal Palace")
    city = invite_data.get("venue", {}).get("address", "Rajasthan, India")
    wedding_date = couple.get("storyDate", "November 28, 2026")

    # Colors
    gold = (212, 175, 55)
    cream = (255, 250, 240)
    bg_top = (35, 7, 7)
    bg_bottom = (10, 2, 2)
    
    # Try hero portrait
    hero_img = None
    local_photo_path = os.path.join(PROJECT_ROOT, "public", "images", "couple-hero.jpg")
    if os.path.exists(local_photo_path):
        try:
            raw_img = Image.open(local_photo_path).convert("RGBA")
            # Create rounded circle portrait
            target_size = 460
            raw_img = raw_img.resize((target_size, target_size), Image.Resampling.LANCZOS)
            mask = Image.new("L", (target_size, target_size), 0)
            mask_draw = ImageDraw.Draw(mask)
            mask_draw.ellipse([(0, 0), (target_size, target_size)], fill=255)
            
            hero_img = Image.new("RGBA", (target_size, target_size), (0, 0, 0, 0))
            hero_img.paste(raw_img, (0, 0), mask)
        except Exception as e:
            print(f"Failed to load couple image: {e}")

    # Prepare FFmpeg Subprocess
    if not music_path or not os.path.exists(music_path):
        music_path = os.path.join(PROJECT_ROOT, "public", "audio", "royal-shehnai.mp3")

    cmd = [
        FFMPEG_BIN,
        "-y",
        "-f", "rawvideo",
        "-vcodec", "rawvideo",
        "-s", f"{WIDTH}x{HEIGHT}",
        "-pix_fmt", "rgb24",
        "-r", str(FPS),
        "-i", "-", # Stdin pipe
    ]

    has_audio = os.path.exists(music_path)
    if has_audio:
        cmd += [
            "-i", music_path,
            "-t", str(DURATION_SEC),
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-preset", "veryfast",
            "-c:a", "aac",
            "-b:a", "192k",
            "-af", f"afade=t=in:st=0:d=1,afade=t=out:st={DURATION_SEC-2}:d=2",
            output_path
        ]
    else:
        cmd += [
            "-t", str(DURATION_SEC),
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "-preset", "veryfast",
            output_path
        ]

    print(f"Starting video encoding: {output_path} (Frames: {TOTAL_FRAMES})...")
    process = subprocess.Popen(cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    for frame_idx in range(TOTAL_FRAMES):
        t = frame_idx / FPS # Seconds
        img = Image.new("RGB", (WIDTH, HEIGHT), (10, 2, 2))
        draw = ImageDraw.Draw(img)

        # 1. Background & Ornate Accents
        draw_gradient_background(draw, t, bg_top, bg_bottom)
        draw_particles(draw, frame_idx, gold)
        draw_ornate_border(draw, t, gold)

        # 4 Cinematic Scenes:
        # Scene 1: [0s - 4.5s] The Auspicious Invitation & Monogram
        # Scene 2: [4.5s - 9.0s] The Royal Couple & Wedding Date
        # Scene 3: [9.0s - 13.5s] Auspicious Ceremonies & Itinerary
        # Scene 4: [13.5s - 18.0s] The Grand Venue & Cordial Welcome

        if t < 4.5:
            # Monogram Circle & Intro
            alpha = min(1.0, t * 1.5)
            pulse = 1.0 + 0.04 * math.sin(t * 3)

            # Traditional Shubh Invocation
            draw.text((WIDTH // 2, 280), "|| श्री गणेशाय नमः ||", fill=gold, font=fonts["devanagari_lg"], anchor="mm")
            draw.text((WIDTH // 2, 400), "WITH THE BLESSINGS OF OUR ANCESTORS", fill=cream, font=fonts["body_md"], anchor="mm")
            draw.text((WIDTH // 2, 450), "WE CORDIALLY INVITE YOU TO CELEBRATE THE WEDDING OF", fill=gold, font=fonts["body_sm"], anchor="mm")

            # Monogram Crest
            mono_y = 860
            radius = int(190 * pulse)
            draw.ellipse([(WIDTH // 2 - radius, mono_y - radius), (WIDTH // 2 + radius, mono_y + radius)], outline=gold, width=4)
            draw.ellipse([(WIDTH // 2 - radius + 15, mono_y - radius + 15), (WIDTH // 2 + radius - 15, mono_y + radius - 15)], outline=gold, width=1)
            draw.text((WIDTH // 2, mono_y - 15), f"{groom[0]}  &  {bride[0]}", fill=gold, font=fonts["script_hero"], anchor="mm")
            draw.text((WIDTH // 2, mono_y + 85), "ETERNAL UNION", fill=cream, font=fonts["body_md"], anchor="mm")

            # Bottom Subtitle
            draw.text((WIDTH // 2, 1420), "TWO SOULS  •  ONE DESTINY", fill=gold, font=fonts["body_md"], anchor="mm")
            draw.text((WIDTH // 2, 1500), wedding_date.upper(), fill=cream, font=fonts["title_md"], anchor="mm")

        elif t < 9.0:
            # Couple Hero Scene
            draw.text((WIDTH // 2, 220), "SAVE THE DATE", fill=gold, font=fonts["body_lg"], anchor="mm")
            draw.text((WIDTH // 2, 290), "For the wedding celebration of", fill=cream, font=fonts["script_sub"], anchor="mm")

            # Portrait with ornate gold ring
            center_y = 660
            if hero_img:
                img.paste(hero_img, (WIDTH // 2 - 230, center_y - 230), hero_img)
            draw.ellipse([(WIDTH // 2 - 235, center_y - 235), (WIDTH // 2 + 235, center_y + 235)], outline=gold, width=5)

            # Names
            draw.text((WIDTH // 2, 1020), full_groom, fill=gold, font=fonts["title_lg"], anchor="mm")
            draw.text((WIDTH // 2, 1120), "&", fill=cream, font=fonts["script_hero"], anchor="mm")
            draw.text((WIDTH // 2, 1220), full_bride, fill=gold, font=fonts["title_lg"], anchor="mm")

            # Date
            draw.line([(WIDTH // 2 - 260, 1370), (WIDTH // 2 + 260, 1370)], fill=gold, width=2)
            draw.text((WIDTH // 2, 1440), wedding_date, fill=cream, font=fonts["title_md"], anchor="mm")
            draw.text((WIDTH // 2, 1530), f"AT {venue.upper()}", fill=gold, font=fonts["body_md"], anchor="mm")
            draw.line([(WIDTH // 2 - 260, 1600), (WIDTH // 2 + 260, 1600)], fill=gold, width=2)

        elif t < 13.5:
            # Auspicious Ceremonies & Itinerary
            draw.text((WIDTH // 2, 220), "WEDDING ITINERARY", fill=gold, font=fonts["title_md"], anchor="mm")
            draw.text((WIDTH // 2, 280), "Join us in each auspicious milestone", fill=cream, font=fonts["script_sub"], anchor="mm")

            card_y = 420
            # Render up to 3 ceremonies
            display_ceremonies = ceremonies[:3] if ceremonies else [
                {"title": "Haldi & Mehendi", "date": "Nov 27, 2026 • 10:00 AM", "venueName": "Courtyard of Lotuses"},
                {"title": "Sangeet & Cocktails", "date": "Nov 27, 2026 • 07:00 PM", "venueName": "Chandra Mahal Ballroom"},
                {"title": "Vivaah Sanskar", "date": "Nov 28, 2026 • 05:00 PM", "venueName": "Grand Lakeview Mandapam"}
            ]

            for i, c in enumerate(display_ceremonies):
                cy = card_y + i * 360
                # Ornate card box
                draw.rectangle([(120, cy), (WIDTH - 120, cy + 300)], fill=(40, 10, 10), outline=gold, width=2)
                draw.rectangle([(130, cy + 10), (WIDTH - 130, cy + 290)], outline=gold, width=1)
                
                # Ceremony Title & Details
                c_title = c.get("title", f"Ceremony {i+1}")
                c_time = f"{c.get('date', '')}  |  {c.get('time', '')}" if c.get('time') else c.get('date', '')
                c_loc = c.get("venueName", venue)

                draw.text((WIDTH // 2, cy + 60), f"✧ {c_title.upper()} ✧", fill=gold, font=fonts["title_md"], anchor="mm")
                draw.text((WIDTH // 2, cy + 140), c_time, fill=cream, font=fonts["body_lg"], anchor="mm")
                draw.text((WIDTH // 2, cy + 220), c_loc, fill=gold, font=fonts["body_md"], anchor="mm")

        else:
            # Final Scene: Venue & Cordial Welcome
            draw.text((WIDTH // 2, 280), "WE AWAIT YOUR PRESENCE", fill=gold, font=fonts["title_md"], anchor="mm")
            draw.text((WIDTH // 2, 360), "To bless and celebrate our new beginnings", fill=cream, font=fonts["script_sub"], anchor="mm")

            # Palace Arch Silhouette / Motif
            arch_cy = 760
            draw.arc([(WIDTH // 2 - 250, arch_cy - 250), (WIDTH // 2 + 250, arch_cy + 250)], 180, 360, fill=gold, width=4)
            draw.line([(WIDTH // 2 - 250, arch_cy), (WIDTH // 2 - 250, arch_cy + 280)], fill=gold, width=4)
            draw.line([(WIDTH // 2 + 250, arch_cy), (WIDTH // 2 + 250, arch_cy + 280)], fill=gold, width=4)
            draw.text((WIDTH // 2, arch_cy + 40), f"{groom} & {bride}", fill=gold, font=fonts["script_hero"], anchor="mm")
            draw.text((WIDTH // 2, arch_cy + 150), "#DeepakWedsPooja", fill=cream, font=fonts["body_lg"], anchor="mm")

            # Venue details card
            draw.rectangle([(100, 1220), (WIDTH - 100, 1540)], fill=(32, 6, 6), outline=gold, width=2)
            draw.text((WIDTH // 2, 1290), venue.upper(), fill=gold, font=fonts["title_md"], anchor="mm")
            draw.text((WIDTH // 2, 1370), city, fill=cream, font=fonts["body_md"], anchor="mm")
            draw.text((WIDTH // 2, 1460), "TAP LINK BELOW FOR MAPS, RSVP & ITINERARY", fill=gold, font=fonts["body_sm"], anchor="mm")

            # Swipe up pulse
            pulse_y = 1680 + int(15 * math.sin(t * 6))
            draw.text((WIDTH // 2, pulse_y), "▲  SWIPE UP TO OPEN DIGITAL INVITE  ▲", fill=cream, font=fonts["body_md"], anchor="mm")

        # Write frame to FFmpeg stdin
        process.stdin.write(img.tobytes())

    process.stdin.close()
    process.wait()
    print(f"Video render complete: {output_path}")
    return output_path

if __name__ == "__main__":
    if len(sys.argv) > 1:
        slug_arg = sys.argv[1]
    else:
        slug_arg = "deepak-and-pooja"

    invites_file = os.path.join(PROJECT_ROOT, "data", "invites.json")
    with open(invites_file, "r", encoding="utf-8") as f:
        invites = json.load(f)

    target_invite = next((i for i in invites if i["slug"] == slug_arg), invites[0])
    out_dir = os.path.join(PROJECT_ROOT, "public", "videos")
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, f"{target_invite['slug']}.mp4")

    render_video_for_invite(target_invite, out_file)
