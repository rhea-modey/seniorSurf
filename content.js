
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
            // Remove previous highlights
            document.querySelectorAll('.seniorsurf-highlight').forEach(el => {
                el.classList.remove('seniorsurf-highlight');
            });

            // Add highlight to the new element
            element.classList.add('seniorsurf-highlight');
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            console.error("Element not found for selector:", request.selector);
        }
    }
});

const style = document.createElement('style');
style.textContent = `
    .seniorsurf-highlight {
        border: 3px solid red !important;
        background-color: yellow !important;
        padding: 2px !important;
        border-radius: 4px !important;
    }
`;
document.head.appendChild(style);