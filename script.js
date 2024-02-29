

//AI Chatbot
async function pingLambdaFunction() {
    try {
        await fetch('https://ji8hmtkfy3.execute-api.eu-north-1.amazonaws.com/dev/chat', {
            method: 'GET'
        });

    } catch (error) {
        console.error("Error pinging Lambda function:", error);
    }
}



function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    var svgContainer = document.querySelector(".svg-container");
    var chatMessages = document.getElementById("chatMessages");
    var screenWidth = window.innerWidth; // Get the current screen width

    // Decide the sidebar width based on the screen width
    var sidebarWidth = screenWidth < 600 ? "100%" : "600px";

    if (sidebar.style.width === sidebarWidth) {
        sidebar.style.width = "0";
        svgContainer.style.display = "flex"; // Show SVG container
    } else {
        disableChatInput();
        sidebar.style.width = sidebarWidth;
        svgContainer.style.display = "none"; // Hide SVG container

        // Clear the previous messages before displaying new ones
        while (chatMessages.firstChild) {
            chatMessages.removeChild(chatMessages.firstChild);
        }

        if (!localStorage.getItem('userConsent')) {
            // If consent is not given yet, show the consent prompt
            displayConsentPrompt();
        } else {
            // If consent is already given, show the chat options
            showChatOptions();
        }
    }
}
function displayConsentPrompt() {
    disableChatInput();
    var chatMessages = document.getElementById("chatMessages");

    // Clear any previous messages
    while (chatMessages.firstChild) {
        chatMessages.removeChild(chatMessages.firstChild);
    }

    // Display the consent prompt message
    displayMessage("Hello! Our chatbot is powered by OpenAI technology. We're committed to improving your experience. " +
    "If you choose to provide feedback on the bot's responses, we'll use this data to enhance our AI model. " +
    "Your feedback is instrumental in refining the accuracy and helpfulness of our service. " +
    "Rest assured, only your feedback responses are collected for this purpose, " +
    "and your data will be processed with the utmost care for privacy.", "left", false);

    // Display agree and don't agree buttons
    displayOptionButton("Agree", "handleConsentResponse(true)");
    displayOptionButton("Don't Agree", "handleConsentResponse(false)");
}

function handleConsentResponse(consentGiven) {
  var sidebar = document.getElementById("sidebar");
  var svgContainer = document.querySelector(".svg-container");

  if (consentGiven) {
      // Save the consent
      localStorage.setItem('userConsent', 'true');
      showChatOptions();
  } else {
      // User did not consent, close the sidebar
      sidebar.style.width = "0";
      svgContainer.style.display = "flex"; // Show SVG container again
      // Optionally, you can inform the user they must agree to proceed
      alert('You must agree to the data collection policy to use the chatbot.');
  }
}
/*
function showChatOptions() {

    displayMessage("Hi, how can I help you? What is your question about:", "left", false);

    // Display buttons for different chatbot services or topics
    displayOptionButton("Navvis VLX", "setContext('Navvis VLX')");
    displayOptionButton("Navvis IVION", "setContext('NavVis Ivion')");
    displayOptionButton("API Documentation", "setContext('API Documentation')");
    displayOptionButton("Navvis M6", "setContext('NavVis M6')");
    displayOptionButton("Other(Desktop Processing, Portal, Support)", "setContext('Other')");
    pingLambdaFunction()
        .then(() => {
            
        })
        .catch((error) => {
            // Handle any errors that occur during setup
            displayMessage("Error setting up the chatbot.", "left");
            console.error("Error setting up the chatbot:", error);
        });
}
*/

function showChatOptions() {
    displayMessage("Hi, how can I help you? What is your question about:", "left", false);

    // Display direct option buttons
    displayOptionButton("API Documentation", "setContext('api')");
    displayOptionButton("Navvis M6", "setContext('m6')");
    displayOptionButton("Navvis VLX", "clearAndShowVlxOptions()");
    displayOptionButton("Navvis IVION", "clearAndShowIvionOptions()");
    displayOptionButton("IVION Processing", "setContext('ivionprocessing')");
    displayOptionButton("Other", "setContext('Other')");

    pingLambdaFunction()
        .then(() => {
            // Additional setup or feedback can be handled here
        })
        .catch((error) => {
            displayMessage("Error setting up the chatbot.", "left");
            console.error("Error setting up the chatbot:", error);
        });
}

function clearAndShowVlxOptions() {
    clearChat();
    // Display VLX specific options
    const vlxOptions = [
        { text: "Maintenance and Transport", context: "maintenancetransport" },
        { text: "Specifications", context: "spesificationshelp" },
        { text: "Using VLX", context: "usingvlx" },
        { text: "Help and Support", context: "helpandsupport" },
        { text: "Other", context: "kbavlx" },
    ];
    vlxOptions.forEach(option => {
        displayOptionButton(option.text, `setContext('${option.context}')`);
    });
}

function clearAndShowIvionOptions() {
    clearChat();
    // Display Ivion specific options
    const ivionOptions = [
        { text: "Using IVION", context: "usingivion" },
        { text: "IVION Admin", context: "ivionadmin" },
        { text: "IVION Setup", context: "ivionsetup" },
        { text: "IVION On-Premise", context: "iviononpremise" },
        { text: "Add-in, Help and Assistance", context: "addinhelpandassistence" },
        { text: "Other", context: "ivionkba" },
    ];
    ivionOptions.forEach(option => {
        displayOptionButton(option.text, `setContext('${option.context}')`);
    });
}

function clearChat() {
    var chatMessages = document.getElementById("chatMessages");
    // Clear the options
    while (chatMessages.firstChild) {
        chatMessages.removeChild(chatMessages.firstChild);
    }
}

// Assumes displayOptionButton and setContext are implemented
// Assumes pingLambdaFunction is a placeholder for any setup or asynchronous operations needed

function enableChatInput() {
    var sendButton = document.querySelector('.send-button');
    var inputField = document.getElementById('chatInput');
    sendButton.disabled = false; // Enable send button
    inputField.disabled = false; // Enable input field
}

function disableChatInput() {
    var sendButton = document.querySelector('.send-button');
    var inputField = document.getElementById('chatInput');
    sendButton.disabled = true; // Disable send button
    inputField.disabled = true; // Disable input field
}

//Handle AI Feedback
let negativeFeedbackCount = 0;
let currentContext = '';
let currentQuestion = '';
let currentResponse = '';
let feedbackSubmitted = false; // Flag to track if feedback has been submitted
/*
function handleFeedback(isPositive) {
    // Construct feedback data
    const feedbackData = {
        question: currentQuestion,
        response: currentResponse,
        feedback: isPositive ? 'positive' : 'negative'
    };
    if (feedbackSubmitted) {
        displayMessage("Feedback has already been submitted for this response.", "left", false);
        return;
    }


    if (isPositive) {
        negativeFeedbackCount = 0;
        displayMessage("Thank you for your feedback. How can I assist you further?", "left", false);
    } else {
        negativeFeedbackCount++;
        if (negativeFeedbackCount === 1) {
            displayMessage("I'm sorry to hear that. Could you please ask your question in a different way? I'll try my best to help.", "left", false);
        } else if (negativeFeedbackCount === 2) {
            displayMessage("It seems I'm unable to assist you effectively. Would you like to create a support ticket for further help?", "left", false);
            displayOptionToCreateTicket();
        }
    }

    // Enable input and send button again
    var inputField = document.getElementById('chatInput');
    var sendButton = document.querySelector('.send-button');
    inputField.disabled = false;
    sendButton.disabled = false;

    // Send feedback data to backend
    sendFeedbackToBackend(feedbackData);
    feedbackSubmitted = true; // Set flag to true after submitting feedback
}
*/




function displayFeedbackForm(isPositive) {
    // Create the feedback form overlay
    const feedbackOverlay = document.createElement("div");
    feedbackOverlay.id = "feedbackOverlay";
    feedbackOverlay.style.position = "fixed";
    feedbackOverlay.style.left = "0";
    feedbackOverlay.style.top = "0";
    feedbackOverlay.style.width = "100%";
    feedbackOverlay.style.height = "100%";
    feedbackOverlay.style.backgroundColor = "rgba(0,0,0,0.5)";
    feedbackOverlay.style.display = "flex";
    feedbackOverlay.style.alignItems = "center";
    feedbackOverlay.style.justifyContent = "center";
    feedbackOverlay.style.zIndex = "1000";

    // Create the feedback form
    const feedbackForm = document.createElement("div");
    feedbackForm.style.padding = "20px";
    feedbackForm.style.backgroundColor = "#fff";
    feedbackForm.style.borderRadius = "10px";
    feedbackForm.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
    feedbackForm.style.textAlign = "center";
    feedbackForm.style.width = "80%";
    feedbackForm.style.maxWidth = "400px";

    // Add a text area
    const feedbackTextArea = document.createElement("textarea");
    feedbackTextArea.id = "feedbackText";
    feedbackTextArea.placeholder = "Please provide detailed feedback...";
    feedbackTextArea.style.width = "100%";
    feedbackTextArea.style.color = "black";
    feedbackTextArea.style.marginBottom = "10px";

    // Add a submit button
    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit Feedback";
    submitButton.style.padding = "10px 15px";
    submitButton.style.border = "none";
    submitButton.style.backgroundColor = "#007bff";
    submitButton.style.color = "#fff";
    submitButton.style.borderRadius = "5px";
    submitButton.style.cursor = "pointer";
    submitButton.onclick = function() {
        const feedbackText = document.getElementById("feedbackText").value;
        sendFeedbackToBackend({
            question: currentQuestion,
            response: currentResponse,
            feedback: isPositive ? 'positive' : 'negative',
            feedback_text: feedbackText
        });
        document.body.removeChild(feedbackOverlay);
    };

    feedbackForm.appendChild(feedbackTextArea);
    feedbackForm.appendChild(submitButton);
    feedbackOverlay.appendChild(feedbackForm);

    // Append the overlay to the body
    document.body.appendChild(feedbackOverlay);
}

function handleFeedback(isPositive) {
    if (feedbackSubmitted) {
        displayMessage("Feedback has already been submitted for this response.", "left", false);
        return;
    }

    // Display the feedback form
    displayFeedbackForm(isPositive);

    // Update the UI based on feedback type
    if (isPositive) {
        negativeFeedbackCount = 0;
        displayMessage("Thank you for your feedback. How can I assist you further?", "left", false);
    } else {
        negativeFeedbackCount++;
        if (negativeFeedbackCount === 1) {
            displayMessage("I'm sorry to hear that. Could you please ask your question in a different way? I'll try my best to help.", "left", false);
        } else if (negativeFeedbackCount === 2) {
            displayMessage("It seems I'm unable to assist you effectively. Would you like to create a support ticket for further help?", "left", false);
            displayOptionToCreateTicket();
        }
    }

    feedbackSubmitted = true; // Set flag to true after displaying the feedback form
}



//Send AI Feedback to Backend
async function sendFeedbackToBackend(feedbackData) {
    console.log('Sending feedback:', feedbackData); // For debugging
    try {
        await fetch('https://ji8hmtkfy3.execute-api.eu-north-1.amazonaws.com/dev/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(feedbackData)
        });
    } catch (error) {
        console.error('Error sending feedback data:', error);
    }
}


function displayOptionToCreateTicket() {
    var chatMessages = document.getElementById("chatMessages");
    var messageDiv = document.createElement("div");
    messageDiv.classList.add("message-cloud", "left-side");

    var button = document.createElement("button");
    button.textContent = "Create Support Ticket";
    button.onclick = function() {
        redirectToTicketCreation();
    };
    button.classList.add("chat-option-button");

    messageDiv.appendChild(button);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function redirectToTicketCreation() {

    window.open('https://support.navvis.com/support/create-case/', '_blank');
}


function displayOptionButton(text, onclickFunction) {
    var chatMessages = document.getElementById("chatMessages");
    var messageDiv = document.createElement("div");
    messageDiv.classList.add("message-cloud", "left-side");

    var button = document.createElement("button");
    button.textContent = text;
    button.onclick = function() {
        eval(onclickFunction);
    };
    button.classList.add("chat-option-button");

    messageDiv.appendChild(button);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
const ivionOptions = [
    { text: "Add-in Help and Assistance", context: "addinhelpandassistence" },
    { text: "IVION Admin", context: "ivionadmin" },
    { text: "IVION KBA", context: "ivionkba" },
    { text: "IVION Setup", context: "ivionsetup" },
    { text: "Using IVION", context: "usingivion" },
    { text: "IVION On-Premise", context: "iviononpremise" },
];

const vlxOptions = [
    { text: "VLX KBA", context: "kbavlx" },
    { text: "Maintenance and Transport", context: "maintenancetransport" },
    { text: "Specifications", context: "spesificationshelp" },
    { text: "Using VLX", context: "usingvlx" },
    { text: "Help and Support", context: "helpandsupport" },
];
function appendOptionsToHeader() {
    const headerOptions = document.getElementById('headerOptions');
    headerOptions.innerHTML = ''; // Clear existing options

    let optionsToDisplay = [];

    // Check if current context matches any of the specified options
    if (ivionOptions.some(option => option.context === currentContext)) {
        optionsToDisplay = ivionOptions;
    } else if (vlxOptions.some(option => option.context === currentContext)) {
        optionsToDisplay = vlxOptions;
    }

    // Only proceed if there are options to display
    if (optionsToDisplay.length > 0) {
        // Create and append the select dropdown
        const selectDropdown = document.createElement('select');
        selectDropdown.className = 'header-options-dropdown';
        selectDropdown.onchange = function() {
            setContext(this.value);
        };

        // Append an option that reflects the current context
        const currentContextOption = document.createElement('option');
        currentContextOption.value = currentContext;
        const currentContextText = optionsToDisplay.find(option => option.context === currentContext)?.text || currentContext;
        currentContextOption.text = currentContextText; // Display the current context
        currentContextOption.selected = true;
        currentContextOption.disabled = true;
        selectDropdown.appendChild(currentContextOption);

        // Append other options to the dropdown
        optionsToDisplay.forEach(option => {
            if(option.context !== currentContext) { // Skip adding the current context again
                const optionElement = document.createElement('option');
                optionElement.value = option.context;
                optionElement.text = option.text;
                selectDropdown.appendChild(optionElement);
            }
        });

        headerOptions.appendChild(selectDropdown);
    }
}



function setContext(context) {
    currentContext = context;
    var chatMessages = document.getElementById("chatMessages");
    var sendButton = document.querySelector('.send-button');
    var inputField = document.getElementById('chatInput');

    // Clear the options
    while (chatMessages.firstChild) {
        chatMessages.removeChild(chatMessages.firstChild);
    }

    // Enable send button and input field here
    sendButton.disabled = false;
    inputField.disabled = false;
    appendOptionsToHeader();
    inputField.focus();
}

async function sendMessage() {

    // Reset feedback submission flag for new question
    feedbackSubmitted = false;
    var sendButton = document.querySelector('.send-button');

    var input = document.getElementById("chatInput");
    var message = input.value.trim();
    var messageToSend = message; // Duplicate the message for sending

    // Append current context to messageToSend if it's not empty
    if (currentContext && currentContext.trim() !== "") {
        messageToSend = `${currentContext}, ${message}`;
    }

    currentQuestion = message; // Store the current (original) question

    // Function to send the request to the API
    async function sendRequest(retries = 3) {
        try {
            const response = await fetch('https://ji8hmtkfy3.execute-api.eu-north-1.amazonaws.com/dev/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: messageToSend,
                    context: currentContext
                }) // Send the modified messageToSend with context
            });

            if (response.ok) {
                const data = await response.json();
                currentResponse = data.response; // Store the response
                displayMessage(data.response, 'left'); // Display response from API
            } else {
                throw new Error('Server error');
            }
        } catch (error) {
            if (retries > 0) {
                displayMessage(`Attempting to reconnect... ${retries} ${retries > 1 ? 'attempts' : 'attempt'} left.`, 'left', false);
                await sendRequest(retries - 1); // Retry the request
            } else {
                displayMessage('Please request again, we are experiencing high volumes.', 'left', false);
                console.error('Failed to send message after retries:', error);
            }
        }
    }

    if (message) {
        displayMessage(message, 'right'); 
        input.value = ""; 
        input.disabled = true;
        sendButton.disabled = true; 
        input.classList.add("thinking"); 

        await sendRequest(); 

        input.disabled = false; // Re-enable input
        sendButton.disabled = false; // Re-enable send button
        input.classList.remove("thinking"); // Remove thinking effect
    }
}


//Display the text message in AI Chatbot
function displayMessage(text, side, requestFeedback = true) {
    var chatMessages = document.getElementById("chatMessages");
    var messageDiv = document.createElement("div");
    messageDiv.classList.add("message-cloud");

    if (side === 'left') {
        messageDiv.classList.add("left-side");

        // Create the text message
        var messageText = document.createElement("p");
        messageText.textContent = text;
        messageDiv.appendChild(messageText);

        // Append feedback icons only if requested
        if (requestFeedback) {
            var feedbackDiv = document.createElement("div");
            feedbackDiv.classList.add("feedback-icons");

            var thumbsUp = document.createElement("span");
            thumbsUp.textContent = "👍"; 
            thumbsUp.onclick = function() {
                handleFeedback(true);
            };
            thumbsUp.classList.add("feedback-icon");

            var thumbsDown = document.createElement("span");
            thumbsDown.textContent = "👎"; 
            thumbsDown.onclick = function() {
                handleFeedback(false);
            };
            thumbsDown.classList.add("feedback-icon");

            feedbackDiv.appendChild(thumbsUp);
            feedbackDiv.appendChild(thumbsDown);
            messageDiv.appendChild(feedbackDiv);
        }
    } else {
        // For right side (user) messages, just append the text
        var messageText = document.createElement("p");
        messageText.textContent = text;
        messageDiv.appendChild(messageText);
    }

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}


function handleKeyPress(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        sendMessage();
    }
}
