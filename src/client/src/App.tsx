import { useState } from 'react';
import { CallForm } from './components/CallForm';
import { ChatInterface } from './components/ChatInterface';
import { TranscriptViewer } from './components/TranscriptViewer'; // Import TranscriptViewer
import { useTranscript } from './hooks/useTranscript';           // Import useTranscript hook
import { initiateCall } from './services/api';
import './index.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const { messages: transcriptMessages, clearMessages } = useTranscript(); // Use the hook

  const [isDevelopMode, setIsDevelopMode] = useState(false);
  const [simulatedPrompt, setSimulatedPrompt] = useState<string | null>(null);

  const handleInitiateCall = async (
    targetNumber: string,
    tollDetails: { licensePlate: string; tollBillId: string; tollDate: string }
  ) => {
    setIsLoading(true);
    setMessage('');
    setIsError(false);
    clearMessages(); // Clear messages on new call initiation

    if (isDevelopMode) {
      try {
        const response = await fetch('/api/simulate/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            license_plate: tollDetails.licensePlate,
            toll_bill_id: tollDetails.tollBillId,
            toll_date: tollDetails.tollDate,
          }),
        });
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setSimulatedPrompt(data.systemPrompt);
      } catch (error: any) {
        setMessage(`Error initiating simulation: ${error.message}`);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      const response = await initiateCall(targetNumber, tollDetails);
      setMessage(`Call initiated successfully! Call ID: ${response.call_id}`);
      setIsError(false);
    } catch (error: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      setMessage(`Error initiating call: ${error.message}`);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (simulatedPrompt) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <ChatInterface systemPrompt={simulatedPrompt} onExit={() => setSimulatedPrompt(null)} />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-gray-100 p-4 gap-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2 p-4 bg-white rounded shadow-sm">
          <input
            type="checkbox"
            id="developMode"
            checked={isDevelopMode}
            onChange={(e) => setIsDevelopMode(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="developMode" className="text-sm font-medium text-gray-700">
            Develop Mode (Simulated Agent)
          </label>
        </div>
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
