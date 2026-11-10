def size_gb(billions_of_weights: float, bits_per_weight: float) -> float:
    return billions_of_weights * bits_per_weight / 8

for name, bits in [("FP16", 16), ("Q8_0", 8.5), ("Q4_K_M", 5)]:
    file_gb = size_gb(4.0, bits)
    print(f"qwen3:4b {name:7} {file_gb:4.1f} GB file, about {file_gb * 1.3:4.1f} GB in RAM")

# A toy version of the idea: store each weight as a small whole number.
weights = [0.82, -0.41, 0.07, -0.93, 0.55, 0.13]

def quantize(values: list[float], bits: int) -> tuple[list[int], list[float]]:
    steps = 2 ** bits - 1                                # 4 bits -> 15 steps between low and high
    low, high = min(values), max(values)
    step = (high - low) / steps
    codes = [round((value - low) / step) for value in values]   # what gets stored
    restored = [low + code * step for code in codes]            # what the model computes with
    return codes, restored

for bits in (8, 4, 2):
    codes, restored = quantize(weights, bits)
    worst = max(abs(a - b) for a, b in zip(weights, restored))
    print(f"{bits} bits: codes {codes}  worst error {worst:.3f}")
