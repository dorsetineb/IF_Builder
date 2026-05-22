with open("src/components/Editor.tsx", "r", encoding="utf-8") as f:
    lines = f.readlines()

with open("scratch/inspect_row2_output.txt", "w", encoding="utf-8") as out:
    for idx, line in enumerate(lines):
        if "░░████" in line:
            out.write(f"Line {idx+1}:\n")
            out.write(f"Line raw repr: {repr(line)}\n")
            start_idx = line.find("░░████")
            sub = line[start_idx:start_idx+35]
            out.write(f"Substring: {repr(sub)}\n")
            for c_idx, char in enumerate(sub):
                out.write(f"  {c_idx:2d}: '{char}' (U+{ord(char):04X})\n")
