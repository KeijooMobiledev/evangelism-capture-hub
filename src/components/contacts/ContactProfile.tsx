import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  BookOpen, 
  MessageSquare,
  FileText
} from "lucide-react";
import SpiritualJourney from './SpiritualJourney';

type SpiritualStage = 'contact'|'interested'|'converted'|'disciple';

interface ContactProfileProps {
  contact: {
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
      keyScriptures?: string[];
      nextSteps?: string;
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
  };
}

const stageLabels: Record<SpiritualStage, string> = {
  contact: 'Premier contact',
  interested: 'Intéressé',
  converted: 'Converti',
  disciple: 'Disciple'
};

const ContactProfile = ({ contact }: ContactProfileProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            {contact.avatarUrl && <AvatarImage src={contact.avatarUrl} />}
            <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{contact.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-1 text-xs rounded-full ${
                contact.spiritualInfo.stage === 'converted' ? 'bg-green-100 text-green-800' :
                contact.spiritualInfo.stage === 'disciple' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {stageLabels[contact.spiritualInfo.stage]}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="spiritual">Spiritual</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone
                </Label>
                <Input value={contact.contactMethods.phone || ''} readOnly />
              </div>
              
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <Input value={contact.contactMethods.email || ''} readOnly />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <Input value={contact.contactMethods.address || ''} readOnly />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Social Media
                </Label>
                <Input value={contact.contactMethods.socialMedia || ''} readOnly />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="spiritual" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Current Beliefs</Label>
                <Textarea 
                  value={contact.spiritualInfo.beliefs || ''}
                  readOnly
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Interests</Label>
                <div className="flex flex-wrap gap-2">
                  {contact.spiritualInfo.interests?.map((interest, i) => (
                    <span key={i} className="px-3 py-1 text-sm rounded-full bg-muted">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Questions/Objections</Label>
                <div className="space-y-2">
                  {contact.spiritualInfo.objections?.map((obj, i) => (
                    <div key={i} className="p-3 border rounded-lg">
                      <p>{obj}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4 pt-4">
            <div className="space-y-4">
              {contact.notes.map((note, i) => (
                <div key={i} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(note.date).toLocaleDateString()}
                      </p>
                      <p className="mt-1">{note.content}</p>
                    </div>
                    {note.followUp && (
                      <div className="flex items-center gap-2 text-sm bg-blue-50 px-3 py-1 rounded-full">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Follow up: {new Date(note.followUp.date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4 pt-4">
            <SpiritualJourney 
              currentStage={contact.spiritualInfo.stage}
              notes={contact.notes}
              lastContactDate={contact.lastContactDate}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContactProfile;
