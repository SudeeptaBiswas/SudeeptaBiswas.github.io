from dataclasses import dataclass, field

class PlainMessage:                          # plain class: no __eq__ written
    def __init__(self, role, content):
        self.role = role
        self.content = content

@dataclass
class Message:                               # __init__, __repr__, __eq__ for free
    role: str
    content: str
    tags: list[str] = field(default_factory=list)

print("plain equal:    ", PlainMessage("user", "hi") == PlainMessage("user", "hi"))
m1 = Message("user", "hi")
m2 = Message("user", "hi")
print("dataclass equal:", m1 == m2)
print(m1)

m1.tags.append("greeting")
print("m2.tags:", m2.tags)                   # each object got its own list

m1.content = "changed"                       # fields can change (records can't)
print(m1)
print(Message(role=1, content=None))         # type hints are not checked
