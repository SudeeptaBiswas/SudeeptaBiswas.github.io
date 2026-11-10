def add_bad(item, bucket=[]):      # the [] is made ONCE, when def runs
    bucket.append(item)
    return bucket

print(add_bad("a"))
print(add_bad("b"))                # same list as the first call

def add(item, bucket=None):        # the fix: None, then a new list per call
    bucket = [] if bucket is None else bucket
    bucket.append(item)
    return bucket

print(add("a"))
print(add("b"))
