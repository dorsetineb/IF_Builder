# Option 1: Current code
logo_current = [
    "           ██████   █████████ ████████ ██      ██  ██  ██        ██████    ████████  ███████",
    "          ░░████  ░█████████ ░████████░██     ░██ ░██ ░██       ░███████  ░████████ ░███████",
    "         ░████   ░██        ░██    ░██ ░██     ░██ ░██ ░██     ░██    ░██░██       ░██    ░██"
]

# Option 2: Proposed code with U+2591 at column 19 (making it two shadow blocks ░░)
logo_proposed = [
    "           ██████   █████████ ████████ ██      ██  ██  ██        ██████    ████████  ███████",
    "          ░░████  ░░█████████ ░████████░██     ░██ ░██ ░██       ░███████  ░████████ ░███████",
    "         ░████   ░██        ░██    ░██ ░██     ░██ ░██ ░██     ░██    ░██░██       ░██    ░██"
]

print("CURRENT:")
print("   " + "".join([str(i % 10) for i in range(50)]))
for idx, line in enumerate(logo_current):
    ascii_line = line.replace('█', '#').replace('░', '.')[0:50]
    print(f"{idx+1:2d} {ascii_line}")

print("\nPROPOSED:")
print("   " + "".join([str(i % 10) for i in range(50)]))
for idx, line in enumerate(logo_proposed):
    ascii_line = line.replace('█', '#').replace('░', '.')[0:50]
    print(f"{idx+1:2d} {ascii_line}")
