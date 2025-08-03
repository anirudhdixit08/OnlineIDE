#include <iostream>
#include <vector>
#include <string>
#include <numeric> // for accumulate
using namespace std;

class Student {
private:
    string name;
    int rollNo;
    vector<int> marks;

public:
    Student(string n, int r, vector<int> m) : name(n), rollNo(r), marks(m) {}

    string getName() const { return name; }
    int getRollNo() const { return rollNo; }
    vector<int> getMarks() const { return marks; }

    double getAverage() const {
        if (marks.empty()) return 0.0;
        int sum = accumulate(marks.begin(), marks.end(), 0);
        return static_cast<double>(sum) / marks.size();
    }

    void printDetails() const {
        cout << "Name: " << name << endl;
        cout << "Roll No: " << rollNo << endl;
        cout << "Marks: ";
        for (int mark : marks) {
            cout << mark << " ";
        }
        cout << "\nAverage: " << getAverage() << endl;
        cout << "--------------------------" << endl;
    }
};

int main() {
    vector<Student> students = {
        Student("Alice", 101, {90, 92, 88, 95}),
        Student("Bob", 102, {78, 85, 80, 70}),
        Student("Charlie", 103, {85, 90, 82, 87})
    };

    cout << "Student Information:\n";
    cout << "==========================\n";

    for (const Student& s : students) {
        s.printDetails();
    }

    return 0;
}
