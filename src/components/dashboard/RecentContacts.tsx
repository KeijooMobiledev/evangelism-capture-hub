
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreHorizontal, BookOpen, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

type SpiritualStage = 'aware'|'interested'|'seeking'|'believing'|'discipleship';

interface Contact {
  id: string;
  name: string;
  area: string;
  avatarUrl?: string;
  spiritualInfo: {
    stage: SpiritualStage;
  };
  lastContactDate: string;
}

interface RecentContactsProps {
  contacts: Contact[];
  className?: string;
}

const stageColors = {
  aware: 'bg-yellow-100 text-yellow-800',
  interested: 'bg-orange-100 text-orange-800',
  seeking: 'bg-blue-100 text-blue-800',
  believing: 'bg-green-100 text-green-800',
  discipleship: 'bg-purple-100 text-purple-800'
};

const RecentContacts = ({ contacts, className }: RecentContactsProps) => {
  const navigate = useNavigate();
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
              <div 
                className="flex items-center flex-1 cursor-pointer hover:bg-muted/50 p-2 rounded-lg"
                onClick={() => navigate(`/contacts/${contact.id}`)}
              >
                <Avatar className="h-9 w-9 mr-3">
                  {contact.avatarUrl && <AvatarImage src={contact.avatarUrl} />}
                  <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">{contact.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${stageColors[contact.spiritualInfo.stage]}`}>
                      {contact.spiritualInfo.stage}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {contact.area} • Last contact: {new Date(contact.lastContactDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <BookOpen className="h-4 w-4" />
                </Button>
              </div>
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
