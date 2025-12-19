import os
import subprocess
from PIL import Image

def fix_thumbnail():
    print("Fixing Thumbnail...")
    try:
        img = Image.open("Thumbnail.png")
        # Convert to RGB to ensure no alpha channel issues if saving as JPEG, but we want PNG.
        # PNG supports alpha, but let's ensure it's standard.
        if img.mode != 'RGBA' and img.mode != 'RGB':
            img = img.convert('RGBA')
            
        img = img.resize((80, 80), Image.Resampling.LANCZOS)
        img.save("Thumbnail_fixed.png", "PNG", optimize=True)
        
        # Check size
        size = os.path.getsize("Thumbnail_fixed.png")
        print(f"Thumbnail fixed size: {size} bytes")
        if size > 50000:
            print("Warning: Thumbnail is still > 50KB")
        else:
            os.replace("Thumbnail_fixed.png", "Thumbnail.png")
            print("Thumbnail replaced.")
    except Exception as e:
        print(f"Error fixing thumbnail: {e}")

def fix_preview():
    print("Fixing Preview...")
    try:
        img = Image.open("Preview.png")
        # Resize to 590px width, maintain aspect ratio
        w_percent = (590 / float(img.size[0]))
        h_size = int((float(img.size[1]) * float(w_percent)))
        img = img.resize((590, h_size), Image.Resampling.LANCZOS)
        
        img.save("Preview_fixed.png", "PNG", optimize=True)
        os.replace("Preview_fixed.png", "Preview.png")
        print(f"Preview replaced. New size: 590x{h_size}")
    except Exception as e:
        print(f"Error fixing preview: {e}")

def convert_video():
    print("Converting Video...")
    if os.path.exists("KodesCruxx_Demo_Recording.webp"):
        cmd = [
            "ffmpeg", "-y",
            "-i", "KodesCruxx_Demo_Recording.webp",
            "-c:v", "libx264",
            "-pix_fmt", "yuv420p",
            "KodesCruxx_Demo_Recording.mp4"
        ]
        try:
            subprocess.run(cmd, check=True)
            print("Video converted to MP4.")
        except subprocess.CalledProcessError as e:
            print(f"Error converting video: {e}")
    else:
        print("Video file not found.")

if __name__ == "__main__":
    fix_thumbnail()
    fix_preview()
    convert_video()
