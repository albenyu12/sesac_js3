function changeBGColor() {
    // console.log('changebgcolor');
    // document.body.style.backgroundColor = 'red';
    if (document.body.style.backgroundColor == 'red') {
        document.body.style.backgroundColor = 'blue';
    } else {
        document.body.style.backgroundColor = 'red';
    }
}

function changeBGColor_cycle() {
    const colors = ['red', 'blue', 'green'];
    if (document.body.style.backgroundColor == 'red') {
        document.body.style.backgroundColor = 'blue';
    } else if (document.body.style.backgroundColor == 'blue'){
        document.body.style.backgroundColor = 'green';
    } else if (document.body.style.backgroundColor == 'green'){
        document.body.style.backgroundColor = 'red'
    } else {
        document.body.style.backgroundColor = 'red';
    }
}


let currentIndex = 0;
function changeBGColor_cycle2() {
    const colors = ['red', 'blue', 'green'];
    console.log(currentIndex);
    if(currentIndex == 0) {
        document.body.style.backgroundColor = colors[currentIndex];
        currentIndex ++;
    } else if (currentIndex == 1) {
        document.body.style.backgroundColor = colors[currentIndex];
        currentIndex ++;
    } else if (currentIndex == 2) {
        document.body.style.backgroundColor = colors[currentIndex];
        currentIndex ++;
    } else {
        document.body.style.backgroundColor = colors[0];
    }
    if (currentIndex > 2) {
        currentIndex = 0;
    }
}

function changeBGColor_cycle3() {
    const colors = ['red', 'blue', 'green', 'magenta'];
    console.log(currentIndex);
    console.log(document.body.style.backgroundColor);
    if (colors[currentIndex % 4] == 'red') {
        document.body.style.backgroundColor = colors[0];
    } else if (colors[currentIndex % 4] == 'blue') {
        document.body.style.backgroundColor = colors[1];
    } else if (colors[currentIndex % 4] == 'green') {
        document.body.style.backgroundColor = colors[2];
    } else if (colors[currentIndex % 4] == 'magenta') {
        document.body.style.backgroundColor = colors[3];
    } else {
        document.body.style.backgroundColor = colors[0];
    }
    currentIndex ++;
}

function changeBGColor_cycle4() {
    const colors = ['red', 'blue', 'green', 'magenta', 'cyan', 'yellow'];
    document.body.style.backgroundColor = colors[currentIndex++];
    if(currentIndex >= colors.length) {
        currentIndex = 0;
    }
}

function changeBGColor_cycle5() {
    const colors = ['red', 'blue', 'green', 'magenta', 'cyan', 'yellow', 'black'];
    document.body.style.backgroundColor = colors[currentIndex];
    currentIndex = (currentIndex + 1) % colors.length;
}