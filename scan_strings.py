import sys
import os

file_path = r'c:\Users\rodrigo.bsilva\Documents\if-builder\IF_Builder\public\escape_the_dungeon\game.js'

strings_to_find = ['Não aconteceu nada.']

with open(file_path, 'r', encoding='utf-8') as f, open('scan_results.txt', 'w', encoding='utf-8') as out:
    for i, line in enumerate(f):
        if i == 0: continue
        if any(s in line for s in strings_to_find):
            out.write(f"{i+1}: {line.strip()}\n")
