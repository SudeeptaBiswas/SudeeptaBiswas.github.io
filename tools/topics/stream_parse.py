import json

# Sample lines in the shape Ollama sends with "stream": True: one JSON object per line.
body = """{"message":{"role":"assistant","content":"RAG"},"done":false}
{"message":{"role":"assistant","content":" looks up"},"done":false}
{"message":{"role":"assistant","content":" documents first."},"done":false}
{"message":{"role":"assistant","content":""},"done":true,"done_reason":"stop","eval_count":5,"eval_duration":330000000}"""

pieces = []
for line in body.splitlines():               # real code: for line in response.iter_lines():
    if not line:
        continue
    data = json.loads(line)
    piece = data["message"]["content"]
    print(f"line -> {piece!r}")              # real code: print(piece, end="", flush=True)
    pieces.append(piece)
    if data["done"]:                         # last line: empty content + the stats
        stats = data

print("answer:", "".join(pieces))
seconds = stats["eval_duration"] / 1_000_000_000    # Ollama times are nanoseconds
print(f"done_reason {stats['done_reason']}, {stats['eval_count']} tokens, "
      f"{stats['eval_count'] / seconds:.1f} tokens/s")
