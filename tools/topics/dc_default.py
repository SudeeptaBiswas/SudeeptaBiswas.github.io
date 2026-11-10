from dataclasses import dataclass

try:
    @dataclass
    class Bad:
        tags: list = []                      # one list for every object? refused
except ValueError as error:
    print("ValueError:", error)
