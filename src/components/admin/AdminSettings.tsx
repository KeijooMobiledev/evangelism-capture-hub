import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Setting {
  id: string;
  key: string;
  value: string;
  description: string;
}

const AdminSettings = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSettings = async () => {
    const { data } = await supabase.from('platform_settings').select('*');
    setSettings(data || []);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    for (const setting of settings) {
      await supabase.from('platform_settings').upsert({
        id: setting.id,
        key: setting.key,
        value: setting.value,
        description: setting.description,
        updated_at: new Date().toISOString()
      });
    }
    setLoading(false);
    alert('Réglages sauvegardés');
  };

  return (
    <div className="container py-8 space-y-6">
      <h1 className="text-2xl font-bold">Réglages de la plateforme</h1>

      {settings.map((setting, index) => (
        <div key={index} className="space-y-2 border p-4 rounded-lg">
          <label className="font-semibold">{setting.key}</label>
          <Textarea
            value={setting.value}
            onChange={(e) => {
              const newSettings = [...settings];
              newSettings[index].value = e.target.value;
              setSettings(newSettings);
            }}
          />
          <p className="text-sm text-muted-foreground">{setting.description}</p>
        </div>
      ))}

      <Button onClick={handleSave} disabled={loading}>
        {loading ? 'Sauvegarde...' : 'Sauvegarder'}
      </Button>
    </div>
  );
};

export default AdminSettings;
