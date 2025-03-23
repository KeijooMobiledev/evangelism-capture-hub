
import React, { useEffect, useRef } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface JitsiMeetProps {
  roomName: string;
  displayName: string;
  onClose: () => void;
}

const JitsiMeet = ({ roomName, displayName, onClose }: JitsiMeetProps) => {
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
      <div 
        ref={jitsiContainerRef} 
        className={`jitsi-container w-full ${isMobile ? 'h-[80vh]' : 'h-[85vh]'}`}
      />
    </div>
  );
};

export default JitsiMeet;
