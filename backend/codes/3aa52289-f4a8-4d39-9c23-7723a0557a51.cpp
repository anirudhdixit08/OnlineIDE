#include <iostream>
#include <vector>
#include <fstream>
#include <iomanip>

using namespace std;

// Student class
class Student {
private:
    string name;
    int rollNo;
    vector<int> marks;

public:
    Student(string n, int r, vector<int> m) : name(n), rollNo(r), marks(m) {}

    string getName() const {
        return name;
    }

    int getRollNo() const {
        return rollNo;
    }

    double getAverage() const {
        if (marks.empty()) return 0.0;
        int sum = 0;
        for (int mark : marks) {
            sum += mark;
        }
        return static_cast<double>(sum) / marks.size();
    }

    string getGrade() const {
        double avg = getAverage();
        if (avg >= 90) return "A+";
        else if (avg >= 80) return "A";
        else if (avg >= 70) return "B";
        else if (avg >= 60) return "C";
        else return "F";
    }

    void printSummary(ostream& out) const {
        out << left << setw(15) << name
            << setw(10) << rollNo
            << setw(10) << fixed << setprecision(2) << getAverage()
            << setw(5) << getGrade() << endl;
    }
};

// Generate dummy data
vector<Student> createDummyData() {
    return {
        Student("Alice", 101, {90, 92, 88, 95}),
        Student("Bob", 102, {78, 85, 80, 70}),
        Student("Charlie", 103, {60, 64, 58, 70}),
        Student("David", 104, {45, 55, 50, 40}),
        Student("Eve", 105, {99, 100, 98, 97})
    };
}

// Print report to console and file
void printReport(const vector<Student>& students) {
    ofstream outFile("StudentReport.txt");
    if (!outFile.is_open()) {
        cerr << "Failed to open output file." << endl;
        return;
    }

    cout << "Generating Student Report...\n\n";

    string header = "Name           Roll No   Average   Grade";
    cout << header << "\n";
    cout << string(header.size(), '-') << "\n";

    outFile << header << "\n";
    outFile << string(header.size(), '-') << "\n";

    for (const Student& s : students) {
        s.printSummary(cout);
        s.printSummary(outFile);
    }

    outFile.close();
    cout << "\nReport saved to StudentReport.txt\n";
}

int main() {
    vector<Student> students = createDummyData();
    printReport(students);
    return 0;
}
