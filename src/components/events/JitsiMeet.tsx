
import React, { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import BibleStudyPanel from './BibleStudyPanel';

interface JitsiMeetProps {
  roomName: string;
  displayName: string;
  onClose: () => void;
  onApiReady?: (api: any) => void;
  isBibleStudy?: boolean;
  isLeader?: boolean;
}

const JitsiMeet = ({ 
  roomName, 
  displayName, 
  onClose, 
  onApiReady,
  isBibleStudy = false, 
  isLeader = false 
}: JitsiMeetProps) => {
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // This function will be called when the component mounts
    const loadJitsiScript = () => {
      if (window.JitsiMeetExternalAPI) {
        startMeeting();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://meet.jit.si/external_api.js';
      script.async = true;
      script.onload = startMeeting;
      document.body.appendChild(script);
    };

    // Function to initialize the Jitsi meeting
    const startMeeting = () => {
      if (!jitsiContainerRef.current) return;
      
      const domain = 'meet.jit.si';
      const options = {
        roomName: roomName,
        width: '100%',
        height: '100%',
        parentNode: jitsiContainerRef.current,
        userInfo: {
          displayName: displayName
        },
        configOverwrite: {
          prejoinPageEnabled: false,
          startWithAudioMuted: true,
          startWithVideoMuted: true,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
            'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone', 'security'
          ],
        },
      };

      const api = new window.JitsiMeetExternalAPI(domain, options);
      
      api.addEventListener('readyToClose', () => {
        onClose();
      });

      // Expose API via callback if provided
      if (onApiReady) {
        onApiReady(api);
      }

      return () => api.dispose();
    };

    loadJitsiScript();
    
    return () => {
      // Cleanup if needed
      if (jitsiContainerRef.current) {
        jitsiContainerRef.current.innerHTML = '';
      }
    };
  }, [roomName, displayName, onClose]);

  return (
    <div className="relative w-full h-full">
      {isBibleStudy ? (
        <div className="flex flex-col md:flex-row gap-4 h-full">
          <div className="flex-1">
            <div 
              ref={jitsiContainerRef} 
              className={`jitsi-container w-full ${isMobile ? 'h-[60vh]' : 'h-full'}`}
            />
          </div>
          <div className="md:w-80">
            <BibleStudyPanel roomName={roomName} isLeader={isLeader} />
          </div>
        </div>
      ) : (
        <div 
          ref={jitsiContainerRef} 
          className={`jitsi-container w-full ${isMobile ? 'h-[80vh]' : 'h-[85vh]'}`}
        />
      )}
    </div>
  );
};

export default JitsiMeet;
