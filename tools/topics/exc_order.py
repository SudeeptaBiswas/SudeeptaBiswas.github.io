def parse(text):
    print(f"parse({text!r})")
    try:
        number = int(text)
    except ValueError:
        print("  except:  not a number")
        return None
    else:
        print("  else:    no error, use", number)
        return number
    finally:
        print("  finally: always runs, even after return")

parse("42")
parse("forty-two")
