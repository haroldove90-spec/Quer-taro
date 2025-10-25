
import React, { useState, useRef, useEffect } from 'react';
import { ICONS } from '../constants';
import { getAIResponse } from '../services/geminiService';

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiResponseText = await getAIResponse(input);
    const aiMessage: Message = { text: aiResponseText, sender: 'ai' };
    
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        aria-label="Open AI Assistant"
      >
        {ICONS.gemini}
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center" onClick={() => setIsOpen(false)}>
          <div 
            className="fixed bottom-6 right-6 w-full max-w-md h-[70vh] max-h-[600px] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex flex-col transform transition-all"
            onClick={e => e.stopPropagation()}
          >
            <header className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <div className="flex items-center">
                <span className="p-2 bg-primary-100 dark:bg-primary-900 rounded-full text-primary-600 mr-3">{ICONS.gemini}</span>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Asistente Virtual</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
                {ICONS.close}
              </button>
            </header>

            <main className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
                    {msg.sender === 'ai' && <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 text-white items-center justify-center flex">{ICONS.gemini}</span>}
                    <div className={`flex flex-col gap-1 w-full max-w-[320px] leading-1.5 p-4 border-gray-200 rounded-xl ${msg.sender === 'user' ? 'bg-primary-500 text-white rounded-ee-none' : 'bg-gray-100 dark:bg-gray-700 rounded-es-none'}`}>
                      <p className="text-sm font-normal">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                   <div className="flex items-start gap-2.5">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500 text-white items-center justify-center flex">{ICONS.gemini}</span>
                    <div className="flex flex-col gap-1 w-full max-w-[320px] leading-1.5 p-4 border-gray-200 rounded-xl bg-gray-100 dark:bg-gray-700 rounded-es-none">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 bg-primary-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="h-2 w-2 bg-primary-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                        <div className="h-2 w-2 bg-primary-400 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </main>

            <footer className="p-4 border-t dark:border-gray-700">
              <div className="flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Pregunta sobre la privada..."
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 disabled:bg-primary-300"
                >
                  Enviar
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
