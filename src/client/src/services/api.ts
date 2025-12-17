export const initiateCall = async (
  targetNumber: string,
  tollDetails: { licensePlate: string; tollBillId: string; tollDate: string }
) => {
  const response = await fetch('/call', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      target_number: targetNumber,
      license_plate: tollDetails.licensePlate,
      toll_bill_id: tollDetails.tollBillId,
      toll_date: tollDetails.tollDate,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to initiate call');
  }

  return response.json();
};
