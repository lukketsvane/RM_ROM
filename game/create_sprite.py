from PIL import Image
import os

def create_sprite_sheet(input_folder, output_file, sprite_width, sprite_height, columns, rows):
    # List all files in the input folder
    files = sorted([f for f in os.listdir(input_folder) if f.endswith('.gif') or f.endswith('.png')])
    
    if len(files) != columns * rows:
        print(f"Error: Expected {columns * rows} images, but found {len(files)}")
        return

    # Create a new image with the appropriate size
    sprite_sheet = Image.new('RGBA', (sprite_width * columns, sprite_height * rows))

    for index, file in enumerate(files):
        # Open the image
        with Image.open(os.path.join(input_folder, file)) as img:
            # Calculate position
            row = index // columns
            col = index % columns
            
            # Paste the image into the sprite sheet
            sprite_sheet.paste(img, (col * sprite_width, row * sprite_height))

    # Save the sprite sheet
    sprite_sheet.save(output_file, 'PNG')
    print(f"Sprite sheet saved as {output_file}")

# Usage
input_folder = 'public/sprite'  # Folder containing individual sprite images
output_file = 'public/sprite/character_sprite_sheet.png'  # Output sprite sheet file
sprite_width = 16  # Width of each sprite
sprite_height = 23  # Height of each sprite
columns = 4  # Number of columns in the sprite sheet
rows = 4  # Number of rows in the sprite sheet

create_sprite_sheet(input_folder, output_file, sprite_width, sprite_height, columns, rows)