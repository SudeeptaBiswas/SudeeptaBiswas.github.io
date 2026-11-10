import json

body = """{"message":{"content":"R"},"done":false}
{"message":{"content":"AG"},"done":false}"""

try:
    json.loads(body)                         # what .json() does with the whole body
except json.JSONDecodeError as error:
    print("JSONDecodeError:", error)

print([json.loads(line)["message"]["content"] for line in body.splitlines()])   # one line at a time
