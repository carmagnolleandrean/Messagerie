import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";

export function ContactsList({ onSelectContact }) {
  // Exemple de contacts pour la démonstration
  const [contacts, setContacts] = useState([
    { id: 1, name: "Alice Martin", status: "online", lastMessage: "Bonjour, comment ça va ?", time: "10:30" },
    { id: 2, name: "Thomas Dubois", status: "offline", lastMessage: "On se voit demain ?", time: "Hier" },
    { id: 3, name: "Sophie Lefebvre", status: "online", lastMessage: "J'ai envoyé le document", time: "09:15" },
    { id: 4, name: "Lucas Bernard", status: "away", lastMessage: "Merci pour l'info !", time: "Lun" },
  ]);

  return (
    <div className="h-full bg-white border-r overflow-y-auto">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg">Conversations</h2>
      </div>
      
      <div className="divide-y">
        {contacts.map((contact) => (
          <div 
            key={contact.id}
            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onSelectContact(contact)}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar src={`/placeholder-${contact.id}.jpg`} alt={contact.name} />
                {contact.status === "online" && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium truncate">{contact.name}</h3>
                  <span className="text-xs text-gray-500">{contact.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
