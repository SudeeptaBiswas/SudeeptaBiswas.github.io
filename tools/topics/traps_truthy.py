for value in [0, 0.0, "", [], {}, None, "0", [0], -1]:
    print(f"{value!r:5} -> {bool(value)}")

count = 0                          # a real answer: zero items
if count:
    print("got a count")
else:
    print("if count: says no count, but 0 was a real value")
if count is not None:
    print("if count is not None: says the count is", count)
