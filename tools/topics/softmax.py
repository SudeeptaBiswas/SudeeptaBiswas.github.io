import math
import random

def softmax(scores: list[float], temperature: float = 1.0) -> list[float]:
    scaled = [score / temperature for score in scores]
    biggest = max(scaled)                                # subtract the max: same result, no overflow
    exps = [math.exp(score - biggest) for score in scaled]
    total = sum(exps)
    return [value / total for value in exps]

words = ["cat", "mat", "rat"]
scores = [2.0, 1.0, 0.5]                                 # logits the model gave

for temperature in [0.2, 1.0, 2.0]:
    odds = softmax(scores, temperature)
    print(f"T {temperature}: " + "  ".join(f"{w} {p:.2f}" for w, p in zip(words, odds)))

def top_p(words: list[str], odds: list[float], p: float) -> list[str]:
    kept, covered = [], 0.0
    for word, chance in sorted(zip(words, odds), key=lambda pair: pair[1], reverse=True):
        kept.append(word)
        covered += chance
        if covered >= p:                                 # enough of the odds covered: stop
            break
    return kept

print("top_p 0.8 keeps:", top_p(words, softmax(scores), 0.8))

rng = random.Random(42)                                  # seed: the same picks every run
picks = [rng.choices(words, weights=softmax(scores))[0] for _ in range(10)]
print("10 picks at T 1.0, seed 42:", picks)
