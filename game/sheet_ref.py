import os
import re
from PIL import Image
import curses

TILE_SIZE = 16
SCALE = 1
COLORS = {
    0: (144, 238, 144),
    1: (0, 100, 0),
    2: (255, 0, 0),
    6: (255, 165, 0)
}

def get_map_data(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    
    # Extract the array part
    array_match = re.search(r'\[([\s\S]*?)\];', content, re.MULTILINE)
    if not array_match:
        raise ValueError(f"Could not find array in {file_path}")
    
    array_str = array_match.group(1)
    
    # Parse the array
    rows = [row.strip() for row in array_str.strip().split('\n') if row.strip()]
    map_array = []
    for row in rows:
        map_array.append([int(num) for num in row.strip('[],').split(',')])
    
    return map_array

def generate_map_reference(map_data, output_filename):
    width = len(map_data[0]) * TILE_SIZE * SCALE
    height = len(map_data) * TILE_SIZE * SCALE
    
    image = Image.new('RGB', (width, height), color='white')
    pixels = image.load()
    
    for y, row in enumerate(map_data):
        for x, tile in enumerate(row):
            color = COLORS.get(tile, (200, 200, 200))
            for i in range(TILE_SIZE * SCALE):
                for j in range(TILE_SIZE * SCALE):
                    pixels[x * TILE_SIZE * SCALE + i, y * TILE_SIZE * SCALE + j] = color
    
    image.save(output_filename)
    print(f"Map reference image saved as {output_filename}")

def get_map_files():
    return [f for f in os.listdir('maps') if f.endswith('.ts')]

def select_maps(stdscr):
    map_files = get_map_files()
    selected = [False] * len(map_files)
    current_selection = 0

    while True:
        stdscr.clear()
        stdscr.addstr(0, 0, "Select maps to generate (use arrow keys, space to select, enter to confirm):")
        for i, map_file in enumerate(map_files):
            stdscr.addstr(i + 2, 0, f"{'[X]' if selected[i] else '[ ]'} {map_file}")
        stdscr.addstr(current_selection + 2, 0, ">")
        stdscr.refresh()

        key = stdscr.getch()
        if key == ord(' '):
            selected[current_selection] = not selected[current_selection]
        elif key == curses.KEY_UP and current_selection > 0:
            current_selection -= 1
        elif key == curses.KEY_DOWN and current_selection < len(map_files) - 1:
            current_selection += 1
        elif key == 10:  # Enter key
            return [map_files[i] for i, sel in enumerate(selected) if sel]

def main(stdscr):
    curses.curs_set(0)
    stdscr.keypad(True)

    selected_maps = select_maps(stdscr)
    
    stdscr.clear()
    stdscr.addstr(0, 0, "Generating maps...")
    stdscr.refresh()

    for map_file in selected_maps:
        map_name = os.path.splitext(map_file)[0]
        map_data = get_map_data(os.path.join('maps', map_file))
        output_filename = os.path.join('public', f'{map_name}_sheet.png')
        generate_map_reference(map_data, output_filename)

    stdscr.addstr(2, 0, "Done! Press any key to exit.")
    stdscr.refresh()
    stdscr.getch()

if __name__ == "__main__":
    curses.wrapper(main)