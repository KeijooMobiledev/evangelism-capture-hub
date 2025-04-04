import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/hooks/use-toast';
import ContactProfile from '@/components/contacts/ContactProfile';
import RecentContacts from '@/components/dashboard/RecentContacts';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Plus, Search } from 'lucide-react';

type SpiritualStage = 'aware'|'interested'|'seeking'|'believing'|'discipleship';

interface Contact {
  id: string;
  name: string;
  area: string;
  avatarUrl?: string;
  contactMethods: {
    phone?: string;
    email?: string;
    address?: string;
    socialMedia?: string;
  };
  spiritualInfo: {
    stage: SpiritualStage;
    beliefs?: string;
    interests?: string[];
    objections?: string[];
  };
  notes: Array<{
    date: string;
    content: string;
    followUp?: {
      date: string;
      topic: string;
    };
  }>;
  lastContactDate: string;
}

const Contacts = () => {
  const { contactId } = useParams();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    
    // Demo contacts data
    const demoContacts: Contact[] = [
      {
        id: '1',
        name: 'John Doe',
        area: 'Downtown',
        avatarUrl: '',
        lastContactDate: new Date().toISOString(),
        spiritualInfo: {
          stage: 'interested',
          beliefs: 'Open to spirituality',
          interests: ['Bible studies', 'Prayer'],
          objections: ['Not sure about Jesus']
        },
        contactMethods: {
          phone: '555-123-4567',
          email: 'john@example.com'
        },
        notes: [{
          date: new Date().toISOString(),
          content: 'Had a good conversation about faith'
        }]
      },
      {
        id: '2',
        name: 'Sarah Smith',
        area: 'Uptown',
        avatarUrl: '',
        lastContactDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        spiritualInfo: {
          stage: 'seeking',
          beliefs: 'Exploring Christianity',
          interests: ['Gospel message', 'Life purpose']
        },
        contactMethods: {
          email: 'sarah@example.com'
        },
        notes: []
      }
    ];

    setContacts(demoContacts);
    setLoading(false);
  }, []);

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.area.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (contactId) {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      return <ContactProfile contact={contact} />;
    }
    return <div>Contact not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Contacts</h1>
        <Button onClick={() => navigate('/contacts/new')}>
          <Plus className="h-4 w-4 mr-2" />
          New Contact
        </Button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search contacts..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="map">Map View</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="pt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-2">
              <RecentContacts 
                contacts={filteredContacts.slice(0, 5)} 
                className="mb-6"
              />
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredContacts.map(contact => (
                  <div 
                    key={contact.id}
                    className="border rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/contacts/${contact.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        {contact.avatarUrl && <AvatarImage src={contact.avatarUrl} />}
                        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{contact.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {contact.area}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full">
                    Schedule Follow-ups
                  </Button>
                  <Button variant="outline" className="w-full">
                    Send Group Message
                  </Button>
                  <Button variant="outline" className="w-full">
                    Export Contacts
                  </Button>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3">Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">Total Contacts</p>
                    <p className="text-2xl font-bold">{contacts.length}</p>
                  </div>
                  <div className="border rounded-lg p-3">
                    <p className="text-sm text-muted-foreground">New This Month</p>
                    <p className="text-2xl font-bold">
                      {contacts.filter(c => 
                        new Date(c.lastContactDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                      ).length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="map" className="pt-6">
          <div className="h-[500px] border rounded-lg flex items-center justify-center">
            <p>Map view coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="pt-6">
          <div className="h-[500px] border rounded-lg flex items-center justify-center">
            <p>Analytics coming soon</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Contacts;
