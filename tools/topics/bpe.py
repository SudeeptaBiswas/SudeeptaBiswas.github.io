def count_pairs(tokens: list[str]) -> dict[tuple[str, str], int]:
    counts: dict[tuple[str, str], int] = {}
    for left, right in zip(tokens, tokens[1:]):     # neighbours: ('t','h'), ('h','e'), ...
        counts[(left, right)] = counts.get((left, right), 0) + 1
    return counts

def merge_pair(tokens: list[str], pair: tuple[str, str]) -> list[str]:
    merged, position = [], 0
    while position < len(tokens):
        if position + 1 < len(tokens) and (tokens[position], tokens[position + 1]) == pair:
            merged.append(tokens[position] + tokens[position + 1])   # 'a' + 't' = 'at'
            position += 2                                            # both halves used up
        else:
            merged.append(tokens[position])
            position += 1
    return merged

tokens = list("the cat sat on the mat")      # 22 tokens
for merge_number in range(1, 5):
    counts = count_pairs(tokens)
    best_pair = max(counts, key=counts.get)    # highest count; a tie keeps the first seen
    tokens = merge_pair(tokens, best_pair)
    print(f"merge {merge_number}: {best_pair!r:12} -> {len(tokens)} tokens")

print("after BPE:", tokens)