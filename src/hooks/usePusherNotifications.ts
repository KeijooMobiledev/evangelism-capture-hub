import { useEffect } from 'react';
import Pusher from 'pusher-js';
import { useToast } from '@/hooks/use-toast';

export function usePusherNotifications(userId: string) {
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`user-${userId}`);

    channel.bind('post-status', (data: any) => {
      toast({
        title: data.status === 'sent' ? 'Publication réussie' : 'Échec de la publication',
        description: data.message,
        variant: data.status === 'sent' ? 'default' : 'destructive'
      });
    });

    channel.bind('new-message', (data: any) => {
      toast({
        title: 'Nouveau message reçu',
        description: data.message,
        variant: 'default'
      });
    });

    channel.bind('reminder', (data: any) => {
      toast({
        title: 'Rappel',
        description: data.message,
        variant: 'default'
      });
    });

    channel.bind('new-task', (data: any) => {
      toast({
        title: 'Nouvelle tâche assignée',
        description: data.message,
        variant: 'default'
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
      pusher.disconnect();
    };
  }, [userId, toast]);
}
