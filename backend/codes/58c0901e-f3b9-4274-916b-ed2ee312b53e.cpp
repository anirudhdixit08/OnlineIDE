#include <iostream>

int main() {
    int num = 19;
    std::cout << "Multiplication Table of " << num << std::endl;
    for (int i = 1; i <= 10; ++i) {
        std::cout << num << " * " << i << " = " << num * i << std::endl;
    }
    return 0;
}