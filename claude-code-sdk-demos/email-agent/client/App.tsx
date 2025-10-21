import React, { useState, useEffect } from "react";
import { ChatInterface } from "./components/ChatInterface";
import { InboxView } from "./components/InboxView";
import { EmailViewer } from "./components/EmailViewer";
import { useWebSocket } from "./hooks/useWebSocket";
import { ScreenshotModeProvider } from "./context/ScreenshotModeContext";

const App: React.FC = () => {
  const [emails, setEmails] = useState([]);
  const [profileContent, setProfileContent] = useState('');
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState<any | null>(null);

  // Single WebSocket connection for all components
  const { isConnected, sendMessage } = useWebSocket({
    url: 'ws://localhost:3000/ws',
    onMessage: (message) => {
      switch (message.type) {
        case 'inbox_update':
          setEmails(message.emails || []);
          break;
        case 'profile_update':
          setProfileContent(message.content || '');
          break;
        case 'connected':
          console.log('Connected to server:', message.message);
          break;
        case 'session':
        case 'session_info':
          setSessionId(message.sessionId);
          break;
        case 'assistant_message':
          const assistantMsg = {
            id: Date.now().toString() + '-assistant',
            type: 'assistant',
            content: [{ type: 'text', text: message.content }],
            timestamp: new Date().toISOString(),
          };
          setMessages(prev => [...prev, assistantMsg]);
          setIsLoading(false);
          break;
        case 'tool_use':
          const toolMsg = {
            id: Date.now().toString() + '-tool',
            type: 'assistant',
            content: [{
              type: 'tool_use',
              id: message.toolId || Date.now().toString(),
              name: message.toolName,
              input: message.toolInput || {}
            }],
            timestamp: new Date().toISOString(),
          };
          setMessages(prev => [...prev, toolMsg]);
          break;
        case 'result':
          if (message.success) {
            console.log('Query completed successfully', message);
          } else {
            console.error('Query failed:', message.error);
          }
          setIsLoading(false);
          break;
        case 'error':
          console.error('Server error:', message.error);
          const errorMessage = {
            id: Date.now().toString(),
            type: 'assistant',
            content: [{ type: 'text', text: `Error: ${message.error}` }],
            timestamp: new Date().toISOString(),
          };
          setMessages(prev => [...prev, errorMessage]);
          setIsLoading(false);
          break;
      }
    },
  });

  return (
    <ScreenshotModeProvider>
      <div className="flex h-screen bg-white">
        <InboxView
          emails={emails}
          profileContent={profileContent}
          onEmailSelect={setSelectedEmail}
          selectedEmailId={selectedEmail?.id}
        />
        <EmailViewer
          email={selectedEmail}
          onClose={() => setSelectedEmail(null)}
        />
        <div className="flex-1">
          <ChatInterface
            isConnected={isConnected}
            sendMessage={sendMessage}
            messages={messages}
            setMessages={setMessages}
            sessionId={sessionId}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        </div>
      </div>
    </ScreenshotModeProvider>
  );
};

export default App;
