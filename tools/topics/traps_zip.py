words = ["cat", "mat", "rat"]
scores = [2.0, 1.0]                # one score is missing

print(list(zip(words, scores)))    # rat is dropped, no error

try:
    list(zip(words, scores, strict=True))   # Python 3.10+
except ValueError as error:
    print("strict=True:", error)
