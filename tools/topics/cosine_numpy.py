import numpy as np

names = ["animal", "kitten", "invoice"]
notes = np.array([[0.9, 0.1], [0.8, 0.2], [0.1, 0.9]])   # one row per note
question = np.array([0.7, 0.3])

scores = notes @ question / (np.linalg.norm(notes, axis=1) * np.linalg.norm(question))
for i in np.argsort(-scores):                            # best first
    print(f"{names[i]:8} {scores[i]:.2f}")
