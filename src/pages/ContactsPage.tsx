import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { storageService } from '../services/storageService';
import { ContactCard } from '../components/ContactCard';
import { Contact } from '../types';
import { validateIndianPhone, cleanPhone, formatDisplayPhone } from '../utils/phoneUtils';
import { ERROR_MESSAGES } from '../utils/constants';
import { Plus, AlertCircle } from 'lucide-react';

export const ContactsPage: React.FC = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [phoneValidated, setPhoneValidated] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadContacts();
  }, [user]);

  const loadContacts = () => {
    if (!user) return;
    const userContacts = storageService.getContacts(user.id);
    setContacts(userContacts);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhone(value);

    if (validateIndianPhone(value)) {
      setPhoneValidated(true);
      setError('');
    } else {
      setPhoneValidated(false);
    }
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter contact name');
      return;
    }

    if (!validateIndianPhone(phone)) {
      setError(ERROR_MESSAGES.INVALID_PHONE);
      return;
    }

    if (contacts.length >= 10) {
      setError('Maximum 10 contacts allowed');
      return;
    }

    const newContact: Contact = {
      id: Date.now().toString(),
      userId: user!.id,
      name,
      phone: cleanPhone(phone)
    };

    storageService.saveContact(newContact);
    setContacts([...contacts, newContact]);
    setName('');
    setPhone('');
    setPhoneValidated(false);
    setShowForm(false);
  };

  const handleDeleteContact = (id: string) => {
    storageService.deleteContact(id);
    setContacts(contacts.filter((c) => c.id !== id));
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area pb-24">
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Emergency Contacts</h1>
          {contacts.length < 10 && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-pink-600 hover:bg-pink-700 text-white p-3 rounded-full transition-colors"
            >
              <Plus className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Add Contact Form */}
        {showForm && (
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add Emergency Contact</h2>
            <form onSubmit={handleAddContact} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Mom, Dad, Sister"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                <div className="flex gap-2">
                  <span className="flex items-center px-3 bg-gray-100 rounded-xl font-semibold text-gray-700">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="98765 43210"
                    maxLength="10"
                    className={`flex-1 border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                      error ? 'border-red-300' : phoneValidated ? 'border-green-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
                {phoneValidated && !error && (
                  <p className="text-green-600 text-xs mt-1">✓ {formatDisplayPhone(phone)}</p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setName('');
                    setPhone('');
                    setError('');
                    setPhoneValidated(false);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name.trim() || !phoneValidated}
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Contact
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Contact List */}
        {contacts.length > 0 ? (
          <div className="space-y-3">
            {contacts.length >= 8 && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex gap-2 text-sm text-orange-700">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>You have {contacts.length} contacts. Maximum is 10.</span>
              </div>
            )}
            {contacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onDelete={handleDeleteContact}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 text-center">
            <p className="text-gray-600 text-lg font-semibold mb-2">No Contacts Yet</p>
            <p className="text-gray-500 mb-4">Add emergency contacts to receive SOS alerts</p>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
              >
                Add First Contact
              </button>
            )}
          </div>
        )}

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Add family members and trusted friends</li>
            <li>• Use 10-digit Indian mobile numbers</li>
            <li>• Verify numbers are correct for SMS delivery</li>
            <li>• Maximum 10 emergency contacts</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
