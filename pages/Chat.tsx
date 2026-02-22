
import React, { useState, useRef, useEffect } from 'react';
import Button from '../components/Button';
import { ChatMessage, Note, File } from '../types';
import { useAuth } from '../hooks/useAuth';
import { db } from '../services/firebase';
import { collection, query, getDocs } from 'firebase/firestore';
import { processContentWithGemini } from '../services/geminiService';

const Chat: React.FC = () => {
    const { currentUser } = useAuth();
    const [notes, setNotes] = useState<Note[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', text: "Hello! How can I help you query your archive today?", sender: 'ai', timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        const fetchData = async () => {
            if (!currentUser) return;

            try {
                const notesQuery = query(collection(db, `users/${currentUser.uid}/notes`));
                const filesQuery = query(collection(db, `users/${currentUser.uid}/files`));

                const [notesSnapshot, filesSnapshot] = await Promise.all([
                    getDocs(notesQuery),
                    getDocs(filesQuery),
                ]);

                setNotes(notesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Note)));
                setFiles(filesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as File)));

            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };

        fetchData();
    }, [currentUser]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const context = `
            My Notes:
            ${notes.map(n => `Title: ${n.title}\nContent: ${n.content}`).join('\n---\n')}
            
            My Files:
            ${files.map(f => `Name: ${f.name}\nSize: ${f.size} bytes`).join('\n---\n')}
        `;

        const aiResponseText = await processContentWithGemini(`Based on the following archived knowledge, answer the user's question.\n\n${context}\n\nQuestion: ${input}`);
        
        const aiMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            text: aiResponseText,
            sender: 'ai',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
    };

    return (
        <div className="flex flex-col h-full max-h-[calc(100vh-4rem)] md:max-h-full pb-20 md:pb-0">
             <header className="mb-4">
                <h1 className="text-4xl font-black uppercase text-brand-text">Chat with your Archive</h1>
                <p className="text-brand-text-light mt-1">Ask questions and get insights from your personal knowledge base.</p>
            </header>
            <div className="flex-1 overflow-y-auto p-4 bg-brand-white border border-brand-gray-dark rounded-medium">
                <div className="space-y-6">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xl p-4 border border-brand-gray-dark ${msg.sender === 'user' ? 'bg-brand-black text-brand-white rounded-xl rounded-br-none' : 'bg-brand-gray-light text-brand-text rounded-xl rounded-bl-none'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex justify-start">
                             <div className="max-w-lg p-4 border border-brand-gray-dark bg-brand-gray-light rounded-xl rounded-bl-none">
                                <div className="flex items-center space-x-2">
                                  <div className="w-2 h-2 bg-brand-text rounded-full animate-bounce [animation-delay:-0.3s]"></div>
	                                <div className="w-2 h-2 bg-brand-text rounded-full animate-bounce [animation-delay:-0.15s]"></div>
	                                <div className="w-2 h-2 bg-brand-text rounded-full animate-bounce"></div>
                                </div>
                             </div>
                         </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <form onSubmit={handleSendMessage} className="mt-4 flex gap-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about your archive..."
                    className="flex-1 bg-brand-white border border-brand-gray-dark rounded-soft p-3 transition-colors duration-200 focus:outline-none focus:ring-0 focus:border-brand-black"
                    disabled={isLoading}
                />
                <Button type="submit" variant="primary" disabled={isLoading || !input.trim()}>
                    {isLoading ? 'Thinking...' : 'Send'}
                </Button>
            </form>
        </div>
    );
};

export default Chat;
