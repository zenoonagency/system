import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Power } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { ThemeToggle } from '../ThemeToggle';

function ChatModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      function typeWriter(element, text, delay = 50) {
        let i = 0;
        function type() {
          if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, delay);
          }
        }
        type();
      }

      function sendMessage() {
        const message = document.getElementById('chat-input').value;
        const chatMessages = document.getElementById('chat-messages');

        if (message.trim() !== '') {
          const userMessageWrapper = document.createElement('div');
          userMessageWrapper.classList.add('user-message-wrapper');
          const userMessage = document.createElement('div');
          userMessage.classList.add('user-message');
          userMessage.innerHTML = message;
          userMessageWrapper.appendChild(userMessage);
          chatMessages.appendChild(userMessageWrapper);
          document.getElementById('chat-input').value = '';
          chatMessages.scrollTop = chatMessages.scrollHeight;

          const typingIndicator = document.createElement('div');
          typingIndicator.classList.add('typing-indicator');
          typingIndicator.innerHTML = 'IA está digitando<span class="dot-flashing"></span><span class="dot-flashing"></span><span class="dot-flashing"></span>';
          chatMessages.appendChild(typingIndicator);
          chatMessages.scrollTop = chatMessages.scrollHeight;

          fetch('https://zenoon-agency-n8n.htm57w.easypanel.host/webhook/c0bf5d3e-e3a4-4d66-aec6-6edcc9c6a666/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: message,
            }),
          })
          .then(response => response.json())
          .then(data => {
            const agentResponse = data.output || "Resposta não encontrada";
            const typingDelay = Math.min(Math.max(agentResponse.length * 50, 500), 3000);

            setTimeout(() => {
              typingIndicator.remove();

              const aiWrapper = document.createElement('div');
              aiWrapper.classList.add('ai-response-wrapper');

              const aiImage = document.createElement('img');
              aiImage.src = "https://zenoon.com.br/wp-content/uploads/2024/12/Logo-branca.png"; // Nova logo
              aiImage.alt = "IA";
              aiImage.classList.add('ai-profile-pic');

              const aiResponse = document.createElement('div');
              aiResponse.classList.add('ai-response');
              aiWrapper.appendChild(aiImage);
              aiWrapper.appendChild(aiResponse);

              chatMessages.appendChild(aiWrapper);
              chatMessages.scrollTop = chatMessages.scrollHeight;

              typeWriter(aiResponse, agentResponse, 30);
            }, typingDelay);
          })
          .catch(error => {
            console.error('Erro ao enviar mensagem:', error);
            typingIndicator.remove();
            chatMessages.innerHTML += '<p><strong>Erro:</strong> Não foi possível obter uma resposta.</p>';
          });
        }
      }

      document.getElementById('chat-input').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
          sendMessage();
        }
      });

      document.getElementById('send-btn').addEventListener('click', function() {
        sendMessage();
      });

      const chatMessages = document.getElementById('chat-messages');

      const aiWrapper = document.createElement('div');
      aiWrapper.classList.add('ai-response-wrapper');

      const aiImage = document.createElement('img');
      aiImage.src = "https://zenoon.com.br/wp-content/uploads/2024/12/Logo-branca.png"; // Nova logo
      aiImage.alt = "IA";
      aiImage.classList.add('ai-profile-pic');

      const aiResponse = document.createElement('div');
      aiResponse.classList.add('ai-response');
      aiResponse.innerText = "Olá, converse comigo";

      aiWrapper.appendChild(aiImage);
      aiWrapper.appendChild(aiResponse);

      chatMessages.appendChild(aiWrapper);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="rounded-lg pt-16 shadow-lg w-full max-w-2xl h-[700px] relative bg-white text-black glass-effect">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
        >
          Fechar
        </button>
        <div id="chat-container" className="mt-20">
          <div id="chat-box">
            <div id="chat-messages"></div>
            <div id="input-container">
              <input type="text" id="chat-input" placeholder="Diga à IA o que fazer a seguir" />
              <div className="input-actions">
                <button id="send-btn"><i className="fas fa-paper-plane"></i></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>
        {`
          @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css');

          #chat-messages {
            height: 500px;
            overflow-y: scroll;
            background-color: transparent;
            padding: 10px;
            margin-bottom: 10px;
            color: #343a40;
            animation: slideIn 0.5s ease-in-out;
            scrollbar-width: thin; /* Para Firefox */
            scrollbar-color: #7f00ff transparent; /* Para Firefox */
          }

          #chat-messages::-webkit-scrollbar {
            width: 8px;
          }

          #chat-messages::-webkit-scrollbar-track {
            background: transparent;
          }

          #chat-messages::-webkit-scrollbar-thumb {
            background: #7f00ff;
            border-radius: 4px;
          }

          #chat-messages::-webkit-scrollbar-thumb:hover {
            background: #5a00b3;
          }

          #chat-messages::-webkit-scrollbar-button {
            width: 0;
            height: 0;
            display: none; /* Remove as setas */
          }

          .glass-effect {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          }

          #chat-container {
            width: 600px;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            color: #343a40;
            font-family: 'Roboto', sans-serif;
            position: relative;
            z-index: 1;
            overflow: hidden;
            animation: fadeIn 0.5s ease-in-out;
          }

          #chat-box {
            display: flex;
            flex-direction: column;
            overflow: hidden;
          }

          #chat-messages .user-message-wrapper {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 8px;
          }

          #chat-messages .user-message {
            background-color: #7f00ff;
            color: white;
            padding: 10px;
            border-radius: 5px;
            max-width: 70%;
            word-wrap: break-word;
            overflow-wrap: break-word;
            position: relative;
            animation: slideInRight 0.3s ease-in-out;
          }

          #chat-messages .ai-response-wrapper {
            display: flex;
            align-items: flex-start;
            margin: 10px 0;
          }

          .ai-profile-pic {
            width: 30px;
            height: 30px;
            margin-top: 10px;
            margin-right: 10px;
            animation: fadeIn 0.3s ease-in-out;
          }

          .ai-response {
            background-color: #f0e6ff;
            border-radius: 5px;
            padding: 15px;
            color: #343a40;
            flex: 1;
            font-family: 'Roboto', sans-serif;
            white-space: pre-wrap;
            word-wrap: break-word;
            overflow-wrap: break-word;
            margin-bottom: 15px;
            display: flex;
            flex-direction: column;
            animation: slideInLeft 0.3s ease-in-out;
          }

          .ai-response strong {
            color: #343a40;
          }

          #input-container {
            display: flex;
            align-items: center;
            background-color: #fff;
            border: 1px solid #dee2e6;
            padding: 5px 10px;
            position: relative;
            margin: 0 5px;
            border-radius: 10px;
            animation: slideInUp 0.5s ease-in-out;
          }

          #chat-input {
            flex: 1;
            padding: 10px;
            border: none;
            background-color: transparent;
            color: #343a40;
            font-family: 'Roboto', sans-serif;
            outline: none;
          }

          .input-actions {
            display: flex;
            align-items: center;
          }

          #send-btn {
            background-color: #f0f0f0;
            color: #6c757d;
            border: none;
            padding: 10px;
            margin-left: 10px;
            border-radius: 10px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s ease;
          }

          #send-btn i {
            font-size: 20px;
          }

          #send-btn:hover {
            background-color: #e0e0e0;
          }

          .typing-indicator {
            margin: 10px 0;
            font-style: italic;
            color: #6c757d;
            animation: fadeIn 0.3s ease-in-out;
          }

          .dot-flashing {
            display: inline-block;
            width: 8px;
            height: 8px;
            margin-left: 2px;
            border-radius: 50%;
            background-color: #6c757d;
            animation: dotFlashing 1s infinite;
          }

          .copy-btn:hover {
            background-color: #5a00b3;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideIn {
            from {
              transform: translateY(-20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes slideInRight {
            from {
              transform: translateX(20px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes slideInLeft {
            from {
              transform: translateX(-20px);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes slideInUp {
            from {
              transform: translateY(20px);
              opacity: 0;
            }
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }

          @keyframes dotFlashing {
            0% {
              background-color: #6c757d;
            }
            50% {
              background-color: #ccc;
            }
            100% {
              background-color: #6c757d;
            }
          }
        `}
      </style>
    </div>
  );
}

export function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <header className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-lg font-semibold text-gray-800 dark:text-white">
            Olá, {user?.name || 'Usuário'}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleModal}
            className="flex items-center px-4 py-2 border rounded-lg transition-colors duration-200
                       bg-white dark:bg-dark-600 text-gray-600 dark:text-white
                       border-gray-300 dark:border-gray-600
                       hover:bg-gray-100 dark:hover:bg-dark-700"
          >
            <img src="https://zenoon.com.br/wp-content/uploads/2024/12/Frame-43.png" alt="Pergunte à IA" className="w-5 h-5 mr-2" />
            Pergunte à IA
          </button>
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-gray-600 dark:text-white hover:text-gray-800 dark:hover:text-white/80 transition-colors duration-200"
          >
            <Power className="w-5 h-5 mr-2" />
            Sair
          </button>
        </div>
      </div>
      <ChatModal isOpen={isModalOpen} onClose={toggleModal} />
    </header>
  );
}
