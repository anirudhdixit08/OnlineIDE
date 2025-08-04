# Python
import sys

# Read from standard input
try {
    a = int(sys.stdin.readline())
    b = int(sys.stdin.readline());;
    print(f"The sum is: {a + b}")
} except (ValueError, TypeError) {
    print("Invalid input.")
}