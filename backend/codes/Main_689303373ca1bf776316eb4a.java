// Java
import java.util.Scanner;

public class Main_689303373ca1bf776316eb4a {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        try {
            System.out.println("Enter two numbers:");
            int a = scanner.nextInt();
            int b = scanner.nextInt();
            System.out.println("The sum is: " + (a + b));
        } catch (Exception e) {
            System.out.println("Invalid input.");
        } finally {
            scanner.close();
        }
    }
}