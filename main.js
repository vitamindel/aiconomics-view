import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = "API_KEY";
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

let messages = {
    history: [],
};

async function sendMessage(event) {
    event.preventDefault(); // Prevent form submission refresh

    const userMessage = document.querySelector("#userInput").value.trim();
    const responseContainer = document.querySelector("#aiResponse");

    if (userMessage.length) {
        try {
            // Clear input field and display user message
            document.querySelector("#userInput").value = "";
            responseContainer.insertAdjacentHTML("beforeend", `
                <div class="user">
                    <p>${userMessage}</p>
                </div>
            `);

            // Send the message to the AI model
            const chat = model.startChat(messages);
            const result = await chat.sendMessage(userMessage);

            // Display the AI's response
            responseContainer.insertAdjacentHTML("beforeend", `
                <div class="model">
                    <p>${result.response.text()}</p>
                </div>
            `);

            // Update message history
            messages.history.push({
                role: "user",
                parts: [{ text: userMessage }],
            });

            messages.history.push({
                role: "model",
                parts: [{ text: result.response.text() }],
            });
        } catch (error) {
            responseContainer.insertAdjacentHTML("beforeend", `
                <div class="error">
                    <p>The message could not be sent. Please try again.</p>
                </div>
            `);
        }

        // Scroll to the latest response
        responseContainer.scrollTop = responseContainer.scrollHeight;
    }
}

// Attach the sendMessage function to the form
document.querySelector("#aiForm").addEventListener("submit", sendMessage);

    document.addEventListener('scroll', function () {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSectionId = '';

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100; // Adjust offset for better detection
        const sectionBottom = sectionTop + section.offsetHeight;

        // Adjust logic for smaller sections
        if (
            (window.scrollY >= sectionTop && window.scrollY < sectionBottom) ||
            (window.scrollY + window.innerHeight > sectionBottom && 
             window.scrollY < sectionBottom + 100)
        ) {
            currentSectionId = section.getAttribute('id');
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove('active'); // Reset all links
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active'); // Add active class to the correct link
        }
    });
});


// Function to dynamically render AI responses with Markdown
function renderResponse(rawResponse) {
    // Convert the raw response to HTML using the marked library
    const formattedHTML = marked(rawResponse);

    // Create a new chat bubble for the response
    const chatBubble = document.createElement('div');
    chatBubble.className = 'chat-bubble ai-response'; // Add classes for styling
    chatBubble.innerHTML = formattedHTML; // Inject the formatted HTML

    // Append the bubble to the chat container
    document.querySelector('.chat-container').appendChild(chatBubble);
}


function handleIncomingMessage(message) {
    // Check if the message contains Markdown (optional validation)
    const isMarkdown = /\*|_|#|`|>|-/.test(message);

    // Format using Markdown parser if applicable
    const formattedHTML = isMarkdown ? marked(message) : message;

    // Create a chat bubble
    const chatBubble = document.createElement('div');
    chatBubble.className = 'chat-bubble'; // Add styling class
    chatBubble.innerHTML = formattedHTML;

    // Append to the chat container
    document.querySelector('.chat-container').appendChild(chatBubble);
}

// Example usage
const rawResponse = `
Here are your options:

1. **Learn about Markdown:** A lightweight markup language for formatting text.
2. **Experiment with Markdown:** Try things like \`inline code\`, *italic*, or **bold**.
3. [Markdown Guide](https://www.markdownguide.org): A comprehensive resource.
`;

handleIncomingMessage(rawResponse);

function onAIResponseReceived(responseText) {
    handleIncomingMessage(responseText); // Format and display the message
}

// Simulate AI response
onAIResponseReceived(`Here is **bold text** and a [link](https://example.com)!`);
