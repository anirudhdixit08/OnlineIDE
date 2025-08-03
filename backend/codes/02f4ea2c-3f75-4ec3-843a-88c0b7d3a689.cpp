# Fibonacci sequence up to n terms

def fibonacci(n):
    a, b = 0, 1
    count = 0

    while count < n:
        print(a, end=' ')
        a, b = b, a + b
        count += 1

# Example usage
num_terms = 10
print(f"Fibonacci sequence up to {num_terms} terms:")
fibonacci(num_terms)
