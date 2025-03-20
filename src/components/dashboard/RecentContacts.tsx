
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";

interface Contact {
  id: string | number;
  name: string;
  area: string;
  avatarUrl?: string;
}

interface RecentContactsProps {
  contacts: Contact[];
  className?: string;
}

const RecentContacts = ({ contacts, className }: RecentContactsProps) => {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">Recent Contacts</CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {contacts.map((contact) => (
            <div key={contact.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-9 w-9 mr-3">
                  {contact.avatarUrl ? (
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ) : (
                    <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{contact.name}</p>
                  <p className="text-xs text-muted-foreground">{contact.area}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="h-8">
                Follow up
              </Button>
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full mt-4">
          View all contacts
        </Button>
      </CardContent>
    </Card>
  );
};

export default RecentContacts;
