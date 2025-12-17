import { useState } from 'react';
import { CallForm } from './components/CallForm';
import { TranscriptViewer } from './components/TranscriptViewer'; // Import TranscriptViewer
import { useTranscript } from './hooks/useTranscript';           // Import useTranscript hook
import { initiateCall } from './services/api';
import './index.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const { messages: transcriptMessages, clearMessages } = useTranscript(); // Use the hook

  const handleInitiateCall = async (targetNumber: string, systemPrompt: string) => {
    setIsLoading(true);
    setMessage('');
    setIsError(false);
    clearMessages(); // Clear messages on new call initiation
    try {
      const response = await initiateCall(targetNumber, systemPrompt);
      setMessage(`Call initiated successfully! Call ID: ${response.call_id}`);
      setIsError(false);
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      setMessage(`Error initiating call: ${error.message}`);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-gray-100 p-4 gap-4">
      <div className="space-y-4">
        <CallForm onInitiateCall={handleInitiateCall} isLoading={isLoading} />
        {message && (
          <div className={`p-4 rounded-md text-center ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {message}
          </div>
        )}
      </div>
      <TranscriptViewer messages={transcriptMessages} />
    </div>
  );
}

export default App;
