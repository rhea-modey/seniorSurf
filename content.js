
let buttons = document.querySelectorAll('button');

buttons.forEach(button => {
    button.style.border = "2px solid blue";
    
    
    let tooltip = document.createElement('div');
    tooltip.innerText = "Click here to perform action";
    tooltip.style.position = "absolute";
    tooltip.style.top = button.getBoundingClientRect().top + 'px';
    tooltip.style.left = button.getBoundingClientRect().left + 'px';
    tooltip.style.backgroundColor = 'yellow';
    document.body.appendChild(tooltip);
});