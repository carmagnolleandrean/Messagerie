import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChatInterface() {
  const [message, setMessage] = useState("");
  
  // Exemple de messages pour la démonstration
  const [messages, setMessages] = useState([
    { id: 1, sender: "other", content: "Bonjour, comment ça va ?", timestamp: "10:00" },
    { id: 2, sender: "me", content: "Très bien, merci ! Et toi ?", timestamp: "10:01" },
    { id: 3, sender: "other", content: "Ça va bien aussi. Que fais-tu aujourd'hui ?", timestamp: "10:02" },
  ]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = {
        id: messages.length + 1,
        sender: "me",
        content: message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };
  
  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-lg overflow-hidden">
      {/* En-tête de la conversation */}
      <div className="flex items-center p-4 border-b bg-white">
        <Avatar src="/placeholder-avatar.jpg" alt="Contact" />
        <div className="ml-3">
          <h3 className="font-medium">Contact</h3>
          <p className="text-sm text-gray-500">En ligne</p>
        </div>
      </div>
      
      {/* Zone des messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                  msg.sender === "me" 
                    ? "bg-blue-600 text-white rounded-br-none" 
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                <p>{msg.content}</p>
                <span className={`text-xs ${msg.sender === "me" ? "text-blue-100" : "text-gray-500"} block text-right mt-1`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Zone de saisie du message */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1"
          />
          <Button type="submit" disabled={!message.trim()}>
            Envoyer
          </Button>
        </div>
      </form>
    </div>
  );
}
