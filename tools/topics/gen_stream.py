import json
from collections.abc import Iterator

# Stream lines in the shape qwen3:1.7b sent them; the last one has content "".
STREAM_LINES = [
    '{"message":{"role":"assistant","content":"R"},"done":false}',
    '{"message":{"role":"assistant","content":"AG"},"done":false}',
    "",
    '{"message":{"role":"assistant","content":" helps"},"done":false}',
    '{"message":{"role":"assistant","content":""},"done":true,"done_reason":"stop"}',
]

def text_chunks(lines: list[str]) -> Iterator[str]:
    for line in lines:
        if not line.strip():                 # blank line: nothing to parse
            continue
        text = json.loads(line)["message"]["content"]
        if text:                             # the last line's "" is not a chunk
            yield text

parts = []
print("bot> ", end="")
for chunk in text_chunks(STREAM_LINES):
    print(chunk, end="", flush=True)         # show each piece at once
    parts.append(chunk)
print()
print("saved to memory:", repr("".join(parts)), "from", parts)
