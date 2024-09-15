
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "highlight") {
      const element = document.querySelector(request.selector);
      if (element) {
        element.style.border = "3px solid red";
        element.style.backgroundColor = "yellow";
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });