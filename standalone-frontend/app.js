class ChatBox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button')
        }

        this.state = false;
        this.messages = [];

        this.display = this.display.bind(this);
        this.toggleState = this.toggleState.bind(this);
        this.onSendButton = this.onSendButton.bind(this);
        this.updateChatText = this.updateChatText.bind(this);
    }

    display() {
        const { openButton, chatBox, sendButton } = this.args;
        openButton.addEventListener('click', this.toggleState);
        sendButton.addEventListener('click', () => this.onSendButton(chatBox));

        const inputField = chatBox.querySelector('input');
        inputField.addEventListener("keyup", ({ key }) => {
            if (key === "Enter") {
                this.onSendButton(chatBox);
            }
        });
    }

    toggleState() {
        this.state = !this.state;
        const { chatBox } = this.args;

        if (this.state) {
            chatBox.classList.add('chatbox--active');
        } else {
            chatBox.classList.remove('chatbox--active');
        }
    }

    onSendButton(chatbox) {
        const textField = chatbox.querySelector('input');
        const txt1 = textField.value;

        if (txt1 === "") {
            return;
        }

        // Send the message to the chatbot
        const msg1 = { name: "User", message: txt1 };
        this.messages.push(msg1);

        fetch($SCRIPT_ROOT + '/predict', {
            method: 'POST',
            body: JSON.stringify({ message: txt1 }),
            mode: 'cors',
            headers: { 'content-type': 'application/json' },
        })
            .then(r => r.json())
            .then(r => {
                const msg2 = { name: "Sam", message: r.answer };
                this.messages.push(msg2);
                this.updateChatText(chatbox);
                textField.value = '';
            })
            .catch((error) => {
                console.error('Error', error);
                this.updateChatText(chatbox);
                textField.value = '';
            });
    }

    updateChatText(chatbox) {
        let html = '';
        this.messages.slice().reverse().forEach(function (item) {
            // Verify if it's the user or chatbot Sam
            if (item.name === "Sam") {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>';
            } else {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>';
            }
        });

        const chatMessage = chatbox.querySelector('.chatbox__messages');
        chatMessage.innerHTML = html;
    }
}

const chatbox = new ChatBox();
chatbox.display();