from dataclasses import FrozenInstanceError, dataclass, replace

@dataclass(frozen=True)
class Settings:                              # like a Java record: no setters
    model: str
    temperature: float = 0.8

s = Settings("qwen3:1.7b")
print(s)
try:
    s.temperature = 0.2
except FrozenInstanceError as error:
    print("FrozenInstanceError:", error)

cold = replace(s, temperature=0.2)           # a changed copy ("wither")
print(cold)
print(s)                                     # the original is unchanged
print("usable as a dict key:", {s: "default"}[Settings("qwen3:1.7b")])
