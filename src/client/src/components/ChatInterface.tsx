import React, { useState, useEffect, useRef } from 'react';

interface ChatInterfaceProps {
    systemPrompt: string;
    onExit: () => void;
}

interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ systemPrompt, onExit }) => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'system', content: systemPrompt },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage: Message = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];

        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/simulate/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages: newMessages }),
            });

            const data = await response.json();

            if (data.response) {
                setMessages([...newMessages, { role: 'assistant', content: data.response }]);
                if (data.response === '[CALL ENDED]') {
                    // Optional: Handle call end logic here
                }
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-lg h-[600px] flex flex-col">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h2 className="text-xl font-bold text-gray-800">Develop Mode: Simulation</h2>
                <button
                    onClick={onExit}
                    className="text-gray-500 hover:text-gray-700"
                >
                    Exit
                </button>
            </div>

            <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-2 bg-gray-50 rounded">
                {messages.filter(m => m.role !== 'system').map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white border text-gray-800 shadow-sm'
                                }`}
                        >
                            <div className="text-xs opacity-75 mb-1 mb-1 font-bold">
                                {msg.role === 'user' ? 'You' : 'Agent'}
                            </div>
                            {msg.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white border p-3 rounded-lg shadow-sm">
                            <span className="animate-pulse">...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                />
                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Send
                </button>
            </form>
        </div>
    );
};
