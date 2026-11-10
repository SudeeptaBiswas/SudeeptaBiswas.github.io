from collections.abc import Iterator

def count_up(limit: int) -> Iterator[int]:
    for number in range(1, limit + 1):
        print(f"  making {number}")
        yield number                         # pause here; the loop gets number

numbers = count_up(3)                        # nothing printed: the body has not started
print("called count_up(3)")
for number in numbers:
    print(f"  got {number}")

leftover = list(numbers)                     # one pass only, like a Java Iterator
print("second loop got:", leftover)
