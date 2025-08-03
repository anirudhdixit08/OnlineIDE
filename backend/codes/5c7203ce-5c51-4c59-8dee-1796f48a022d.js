// JavaScript code to print the multiplication table of 19

function printMultiplicationTable(number) {
    console.log(`Multiplication Table of ${number}:`);
    for (let i = 1; i <= 10; i++) {
        console.log(`${number} * ${i} = ${number * i}`);
    }
}

// Call the function to print the table of 19
printMultiplicationTable(19);