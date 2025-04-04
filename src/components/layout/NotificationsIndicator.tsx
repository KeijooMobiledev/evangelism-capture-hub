import { Bell, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '@/services/notifications';

export default function NotificationsIndicator() {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    initialData: [
      {
        id: 1,
        message: 'Nouveau message de Jean Dupont',
        date: '2025-04-03T15:30:00',
        read: false,
      },
      {
        id: 2, 
        message: 'Rappel: Réunion demain à 10h',
        date: '2025-04-03T12:00:00',
        read: true,
      }
    ],
  });

  const unreadCount = notifications?.filter(n => !n.read).length || 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Circle className="absolute right-0 top-0 h-3 w-3 fill-red-500 text-red-500" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 p-2" align="end">
        <div className="space-y-2">
          <h3 className="font-medium px-2">Notifications</h3>
          {isLoading ? (
            <p className="text-sm px-2">Chargement...</p>
          ) : notifications?.length === 0 ? (
            <p className="text-sm text-muted-foreground px-2">
              Aucune notification
            </p>
          ) : (
            notifications?.map(notification => (
              <DropdownMenuItem 
                key={notification.id}
                className={`flex flex-col items-start ${!notification.read ? 'bg-gray-50 dark:bg-gray-800' : ''}`}
              >
                <p className="font-medium">{notification.message}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(notification.date).toLocaleString()}
                </p>
              </DropdownMenuItem>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
