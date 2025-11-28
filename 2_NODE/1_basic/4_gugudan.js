function gugudan(dan) {
    console.log(`== ${dan}단 ==`);
    for (let i = 1; i < 10; i++) {
        console.log(`${dan} × ${i} = ${dan * i}`);
    }
}

gugudan(2);
gugudan(3);


for (let dan = 5; dan <= 8; dan++) {
    gugudan(dan);
}