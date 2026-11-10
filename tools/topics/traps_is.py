a = [1, 2, 3]
b = [1, 2, 3]
c = a                              # a second name for the same list

print("a == b:", a == b)           # same value     (Java: a.equals(b))
print("a is b:", a is b)           # same object?   (Java: a == b)
print("a is c:", a is c)

c.append(4)
print("a after c.append(4):", a)   # one list, two names

x = None
print("x is None:", x is None)     # test for None with "is"
