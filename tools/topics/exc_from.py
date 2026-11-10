class OllamaError(Exception): ...            # my base error
class OllamaDownError(OllamaError): ...      # (Parent) = extends

def ask(url):
    try:
        # stands in for httpx's ConnectTimeout (a TransportError): no network in this demo
        raise ConnectionRefusedError("nothing is listening on " + url)
    except OSError as error:
        raise OllamaDownError(f"no Ollama at {url}") from error   # keep the cause

try:
    ask("http://127.0.0.1:11434")
except OllamaError as error:                 # the parent catches every child
    print("caught:", type(error).__name__, "-", error)
    print("cause: ", type(error.__cause__).__name__, "-", error.__cause__)
    print("tip:    start Ollama: ollama serve")
