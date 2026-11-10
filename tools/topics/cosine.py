import math

def dot(a: list[float], b: list[float]) -> float:
    if len(a) != len(b):                                 # zip would silently stop at the shorter one
        raise ValueError(f"lengths differ: {len(a)} vs {len(b)}")
    return sum(x * y for x, y in zip(a, b))

def norm(a: list[float]) -> float:
    return math.sqrt(dot(a, a))                          # arrow length

def cosine(a: list[float], b: list[float]) -> float:
    return dot(a, b) / (norm(a) * norm(b))

# Two numbers per text: [about animals, about money]
notes = {"animal": [0.9, 0.1], "kitten": [0.8, 0.2], "invoice": [0.1, 0.9]}
question = [0.7, 0.3]                                    # "a small pet": mostly animal

for name, vector in notes.items():
    print(f"{name:8} cosine {cosine(question, vector):.2f}")

ranked = sorted(notes, key=lambda name: cosine(question, notes[name]), reverse=True)
print("top 2:", ranked[:2])

kitten = notes["kitten"]
long_kitten = [x * 10 for x in kitten]                   # same direction, 10 times longer
print(f"dot    animal-kitten {dot(notes['animal'], kitten):.2f}  vs long kitten {dot(notes['animal'], long_kitten):.2f}")
print(f"cosine animal-kitten {cosine(notes['animal'], kitten):.2f}  vs long kitten {cosine(notes['animal'], long_kitten):.2f}")
