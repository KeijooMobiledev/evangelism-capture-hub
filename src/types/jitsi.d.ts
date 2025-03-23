
interface JitsiMeetExternalAPIOptions {
  roomName: string;
  width?: string | number;
  height?: string | number;
  parentNode?: HTMLElement;
  configOverwrite?: object;
  interfaceConfigOverwrite?: object;
  userInfo?: {
    displayName?: string;
    email?: string;
    avatarUrl?: string;
  };
  jwt?: string;
  onload?: Function;
  invitees?: object;
  devices?: object;
  lang?: string;
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: new (domain: string, options: JitsiMeetExternalAPIOptions) => {
      executeCommand: (command: string, ...args: any[]) => void;
      addEventListener: (event: string, listener: Function) => void;
      removeEventListener: (event: string, listener: Function) => void;
      dispose: () => void;
    };
  }
}

export {};
