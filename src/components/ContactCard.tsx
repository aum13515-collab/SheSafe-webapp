import React from 'react';
import { Trash2, Phone } from 'lucide-react';
import { Contact } from '../types';
import { formatDisplayPhone } from '../utils/phoneUtils';

interface ContactCardProps {
  contact: Contact;
  onDelete: (id: string) => void;
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact, onDelete }) => {
  const handleDelete = () => {
    if (confirm(`Delete ${contact.name}?`)) {
      onDelete(contact.id);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100 flex items-center justify-between">
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{contact.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{formatDisplayPhone(contact.phone)}</p>
      </div>
      <div className="flex gap-2 ml-3">
        <a
          href={`tel:+91${contact.phone}`}
          className="p-2 hover:bg-green-100 rounded-lg text-green-600 transition-colors"
          title="Call contact"
        >
          <Phone className="w-5 h-5" />
        </a>
        <button
          onClick={handleDelete}
          className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
          title="Delete contact"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
