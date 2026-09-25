#!/usr/bin/env python3
import os
import math
from PIL import Image, ImageDraw, ImageFilter

def create_brand_icon(canvas_size=1024):
    # Render at 2x for ultra-sharp supersampling
    w = canvas_size * 2
    h = canvas_size * 2
    
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    
    # 1. Base dark background with rounded squircle
    bg_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    bg_draw = ImageDraw.Draw(bg_layer)
    pad = int(w * 0.04)
    radius = int(w * 0.24)
    
    # Radial ambient gradient inside squircle
    cx, cy = w // 2, int(h * 0.48)
    max_r = int(w * 0.65)
    for r in range(max_r, 0, -6):
        t = r / max_r
        # Blend from #1e1435 (center) to #03050a (edge)
        red = int(30 * (1 - t) + 3 * t)
        green = int(20 * (1 - t) + 5 * t)
        blue = int(53 * (1 - t) + 10 * t)
        bg_draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(red, green, blue, 255))
        
    # Mask to squircle
    mask = Image.new("L", (w, h), 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle([pad, pad, w - pad, h - pad], radius=radius, fill=255)
    
    base = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    base.paste(bg_layer, (0, 0), mask)
    
    # Border gradient
    border_draw = ImageDraw.Draw(base)
    border_draw.rounded_rectangle([pad, pad, w - pad, h - pad], radius=radius, outline=(245, 158, 11, 160), width=int(w * 0.012))
    
    # 2. Cinema Clapper / Film Frame
    frame_x1 = int(w * 0.20)
    frame_y1 = int(h * 0.22)
    frame_x2 = int(w * 0.80)
    frame_y2 = int(h * 0.78)
    frame_radius = int(w * 0.07)
    
    # Dark translucent film frame
    frame_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    frame_draw = ImageDraw.Draw(frame_layer)
    frame_draw.rounded_rectangle([frame_x1, frame_y1, frame_x2, frame_y2], radius=frame_radius, fill=(13, 17, 29, 210), outline=(255, 255, 255, 45), width=int(w * 0.006))
    
    # Film sprockets (perforations) along left and right borders
    sprocket_w = int(w * 0.035)
    sprocket_h = int(h * 0.048)
    sprocket_r = int(w * 0.01)
    sprocket_y_start = frame_y1 + int(h * 0.05)
    sprocket_y_end = frame_y2 - int(h * 0.05)
    num_sprockets = 6
    step = (sprocket_y_end - sprocket_y_start) / (num_sprockets - 1)
    
    for i in range(num_sprockets):
        sy = int(sprocket_y_start + i * step - sprocket_h / 2)
        # Left sprocket
        sx_left = frame_x1 + int(w * 0.03)
        frame_draw.rounded_rectangle([sx_left, sy, sx_left + sprocket_w, sy + sprocket_h], radius=sprocket_r, fill=(245, 158, 11, 90))
        # Right sprocket
        sx_right = frame_x2 - int(w * 0.03) - sprocket_w
        frame_draw.rounded_rectangle([sx_right, sy, sx_right + sprocket_w, sy + sprocket_h], radius=sprocket_r, fill=(245, 158, 11, 90))
        
    base = Image.alpha_composite(base, frame_layer)
    
    # 3. ECG Pulse Line (The Pulse Wave)
    # Define pulse coordinates
    pts = [
        (int(w * 0.12), int(h * 0.50)),
        (int(w * 0.30), int(h * 0.50)),
        (int(w * 0.35), int(h * 0.56)),
        (int(w * 0.40), int(h * 0.32)), # Sharp upward spike
        (int(w * 0.46), int(h * 0.68)), # Downward valley
        (int(w * 0.51), int(h * 0.42)),
        (int(w * 0.55), int(h * 0.54)),
        (int(w * 0.60), int(h * 0.47)),
        (int(w * 0.65), int(h * 0.50)),
        (int(w * 0.88), int(h * 0.50)),
    ]
    
    # Multi-layered glowing neon pulse
    glow_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow_layer)
    
    # Wide ambient glow
    for i in range(len(pts) - 1):
        glow_draw.line([pts[i], pts[i+1]], fill=(236, 72, 153, 140), width=int(w * 0.045), joint="round")
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(radius=int(w * 0.03)))
    base = Image.alpha_composite(base, glow_layer)
    
    # Medium vibrant neon pulse
    mid_layer = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    mid_draw = ImageDraw.Draw(mid_layer)
    for i in range(len(pts) - 1):
        # Color transition from Amber -> Rose -> Pink -> Purple
        frac = i / (len(pts) - 1)
        r = int(245 * (1 - frac) + 139 * frac)
        g = int(158 * (1 - frac) + 92 * frac)
        b = int(11 * (1 - frac) + 246 * frac)
        mid_draw.line([pts[i], pts[i+1]], fill=(r, g, b, 230), width=int(w * 0.024), joint="round")
    mid_layer = mid_layer.filter(ImageFilter.GaussianBlur(radius=int(w * 0.01)))
    base = Image.alpha_composite(base, mid_layer)
    
    # Ultra-bright white hot core line
    core_draw = ImageDraw.Draw(base)
    for i in range(len(pts) - 1):
        core_draw.line([pts[i], pts[i+1]], fill=(255, 255, 255, 245), width=int(w * 0.008), joint="round")
        
    # 4. Center Cinematic Playhead Triangle (embedded at pulse center)
    play_cx = int(w * 0.49)
    play_cy = int(h * 0.50)
    play_size = int(w * 0.065)
    
    triangle = [
        (play_cx - int(play_size * 0.6), play_cy - play_size),
        (play_cx + int(play_size * 0.9), play_cy),
        (play_cx - int(play_size * 0.6), play_cy + play_size)
    ]
    
    # Playhead neon glow
    play_glow = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ImageDraw.Draw(play_glow).polygon(triangle, fill=(245, 158, 11, 200))
    play_glow = play_glow.filter(ImageFilter.GaussianBlur(radius=int(w * 0.015)))
    base = Image.alpha_composite(base, play_glow)
    
    # Playhead solid with white highlight
    ImageDraw.Draw(base).polygon(triangle, fill=(245, 158, 11, 255), outline=(255, 255, 255, 220))
    
    # Downsample with Lanczos to requested canvas size
    final_icon = base.resize((canvas_size, canvas_size), Image.Resampling.LANCZOS)
    return final_icon

def main():
    root = "/home/cagatay/İndirilenler/cine-pulse-main"
    print("Generating Master CinePulse 1024x1024 Icon...")
    icon1024 = create_brand_icon(1024)
    
    # Web targets
    icon512 = icon1024.resize((512, 512), Image.Resampling.LANCZOS)
    icon192 = icon1024.resize((192, 192), Image.Resampling.LANCZOS)
    icon180 = icon1024.resize((180, 180), Image.Resampling.LANCZOS)
    icon48 = icon1024.resize((48, 48), Image.Resampling.LANCZOS)
    
    icon512.save(f"{root}/public/icon-512.png", "PNG")
    icon192.save(f"{root}/public/icon-192.png", "PNG")
    icon180.save(f"{root}/public/apple-touch-icon.png", "PNG")
    icon48.save(f"{root}/public/favicon.ico", format="ICO", sizes=[(48, 48), (32, 32), (16, 16)])
    print("Web assets updated.")
    
    # Android Mipmap Targets
    mipmaps = {
        "mipmap-mdpi": (48, 108),
        "mipmap-hdpi": (72, 162),
        "mipmap-xhdpi": (96, 216),
        "mipmap-xxhdpi": (144, 324),
        "mipmap-xxxhdpi": (192, 432),
    }
    
    for folder, (launcher_sz, fg_sz) in mipmaps.items():
        dir_path = f"{root}/android/app/src/main/res/{folder}"
        os.makedirs(dir_path, exist_ok=True)
        
        # Launcher & Round
        im = icon1024.resize((launcher_sz, launcher_sz), Image.Resampling.LANCZOS)
        im.save(f"{dir_path}/ic_launcher.png", "PNG")
        im.save(f"{dir_path}/ic_launcher_round.png", "PNG")
        
        # Foreground
        fg = icon1024.resize((fg_sz, fg_sz), Image.Resampling.LANCZOS)
        fg.save(f"{dir_path}/ic_launcher_foreground.png", "PNG")
        print(f"Updated {folder}")
        
    # Splash screens
    splash_dirs = [
        f"{root}/android/app/src/main/res/drawable",
        f"{root}/android/app/src/main/res/drawable-port-mdpi",
        f"{root}/android/app/src/main/res/drawable-port-hdpi",
        f"{root}/android/app/src/main/res/drawable-port-xhdpi",
        f"{root}/android/app/src/main/res/drawable-port-xxhdpi",
        f"{root}/android/app/src/main/res/drawable-port-xxxhdpi",
        f"{root}/android/app/src/main/res/drawable-land-mdpi",
        f"{root}/android/app/src/main/res/drawable-land-hdpi",
        f"{root}/android/app/src/main/res/drawable-land-xhdpi",
        f"{root}/android/app/src/main/res/drawable-land-xxhdpi",
        f"{root}/android/app/src/main/res/drawable-land-xxxhdpi",
    ]
    
    splash_img = icon1024.resize((512, 512), Image.Resampling.LANCZOS)
    for sdir in splash_dirs:
        os.makedirs(sdir, exist_ok=True)
        splash_img.save(f"{sdir}/splash.png", "PNG")
        
    print("All Android and Web icons and splash assets successfully generated!")

if __name__ == "__main__":
    main()
