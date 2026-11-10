def read(d, key):
    try:
        return d[key]
    except LookupError:            # parent of KeyError: matches first
        return "LookupError block"
    except KeyError:               # never reached
        return "KeyError block"

print(read({}, "model"))
print(" -> ".join(c.__name__ for c in KeyError.__mro__))   # the "extends" chain
