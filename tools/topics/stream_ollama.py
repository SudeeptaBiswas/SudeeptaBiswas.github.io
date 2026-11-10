import json

import httpx

body = {"model": "qwen3:1.7b", "stream": True, "think": False,
        "messages": [{"role": "user", "content": "Why do chat apps stream their answers?"}]}

with httpx.stream("POST", "http://localhost:11434/api/chat", json=body, timeout=120.0) as response:
    for line in response.iter_lines():       # one JSON object per line, as it arrives
        if not line:
            continue
        data = json.loads(line)
        print(data["message"]["content"], end="", flush=True)   # show now, no newline
        if data["done"]:                     # last line: empty content + the stats
            print()
            print(data["eval_count"], "tokens")
