import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

import MarkerSetup from './MarkerSetup';

interface Contact {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  last_contact: string;
  status: 'new' | 'followup' | 'believer';
  notes: string;
}

const ContactMap = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newContact, setNewContact] = useState({
    name: '',
    latitude: 0,
    longitude: 0,
    notes: ''
  });

  useEffect(() => {
    const fetchContacts = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('evangelism_contacts')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        setContacts(data || []);
      } catch (error) {
        toast({
          title: 'Erreur',
          description: 'Impossible de charger les contacts',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();

    const channel = supabase
      .channel('contacts_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'evangelism_contacts'
      }, () => {
        fetchContacts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  const handleMapClick = (e: any) => {
    setNewContact({
      ...newContact,
      latitude: e.latlng.lat,
      longitude: e.latlng.lng
    });
  };

  const handleAddContact = async () => {
    if (!user || !newContact.name) return;

    try {
      const { error } = await supabase
        .from('evangelism_contacts')
        .insert({
          ...newContact,
          user_id: user.id,
          last_contact: new Date().toISOString(),
          status: 'new'
        });

      if (error) throw error;
      
      setNewContact({
        name: '',
        latitude: 0,
        longitude: 0,
        notes: ''
      });
      
      toast({
        title: 'Succès',
        description: 'Contact ajouté avec succès'
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: "Échec de l'ajout du contact",
        variant: 'destructive'
      });
    }
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative">
        <MapContainer
          center={[5.3, -4.0]} // Default center (Abidjan)
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          onClick={handleMapClick}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {contacts.map(contact => (
            <Marker 
              key={contact.id} 
              position={[contact.latitude, contact.longitude]}
            >
              <Popup>
                <div>
                  <h3 className="font-bold">{contact.name}</h3>
                  <p>Dernier contact: {new Date(contact.last_contact).toLocaleDateString()}</p>
                  <p>Statut: {contact.status}</p>
                  <p className="text-sm mt-2">{contact.notes}</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {newContact.latitude !== 0 && newContact.longitude !== 0 && (
            <Marker position={[newContact.latitude, newContact.longitude]}>
              <Popup>
                Nouveau contact à ajouter
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <div className="p-4 border-t">
        <h3 className="text-lg font-semibold mb-3">Ajouter un contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            placeholder="Nom du contact"
            value={newContact.name}
            onChange={(e) => setNewContact({...newContact, name: e.target.value})}
          />
          <Input
            placeholder="Latitude"
            value={newContact.latitude || ''}
            readOnly
          />
          <Input
            placeholder="Longitude"
            value={newContact.longitude || ''}
            readOnly
          />
        </div>
        <Input
          placeholder="Notes"
          className="mt-3"
          value={newContact.notes}
          onChange={(e) => setNewContact({...newContact, notes: e.target.value})}
        />
        <Button 
          className="mt-3"
          onClick={handleAddContact}
          disabled={!newContact.name || !newContact.latitude}
        >
          Enregistrer le contact
        </Button>
      </div>
    </div>
  );
};

export default ContactMap;
