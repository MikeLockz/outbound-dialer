export const initiateCall = async (targetNumber: string, systemPrompt: string) => {
  const response = await fetch('/call', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ target_number: targetNumber, system_prompt: systemPrompt }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to initiate call');
  }

  return response.json();
};
