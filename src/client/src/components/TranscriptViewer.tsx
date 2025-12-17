import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export interface TranscriptMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string; // ISO 8601 or HH:mm:ss
}

interface TranscriptViewerProps {
  messages: TranscriptMessage[];
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({ messages }) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to the bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Card className="w-[450px] h-[400px] flex flex-col">
      <CardHeader>
        <CardTitle>Transcript</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-0">
        <ScrollArea className="h-full p-4" viewportRef={scrollAreaRef}>
          {messages.length === 0 ? (
            <p className="text-center text-muted-foreground">No transcript yet. Initiate a call to start.</p>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex mb-2 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[70%] p-2 rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-xs text-gray-500">
                    {msg.role === 'user' ? 'You' : 'Assistant'} - {msg.timestamp}
                  </p>
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
