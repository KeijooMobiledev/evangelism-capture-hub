interface Notification {
  id: number;
  message: string;
  date: string;
  read: boolean;
}

// TODO: À remplacer par un vrai appel API
export async function getNotifications(): Promise<Notification[]> {
  // Données de démonstration pour le moment
  return [];
}
