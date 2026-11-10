settings = {"model": "qwen3:1.7b"}           # no "temperature" key

if "temperature" in settings:                # 1. look first (Java style)
    t = settings["temperature"]
else:
    t = 0.8
print("look first:", t)

try:                                         # 2. just try (usual Python style)
    t = settings["temperature"]
except KeyError:
    t = 0.8
print("just try:  ", t)

print("get:       ", settings.get("temperature", 0.8))   # 3. one call
