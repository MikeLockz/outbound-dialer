import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CallFormProps {
  onInitiateCall: (targetNumber: string, tollDetails: { licensePlate: string; tollBillId: string; tollDate: string }) => void;
  isLoading: boolean;
}

export const CallForm: React.FC<CallFormProps> = ({ onInitiateCall, isLoading }) => {
  const [targetNumber, setTargetNumber] = useState('+17203363337');

  // Calculate yesterday's date for default
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const formattedYesterday = yesterday.toISOString().split('T')[0];

  const [licensePlate, setLicensePlate] = useState('656YJF');
  const [tollBillId, setTollBillId] = useState('1234ABCD7890');
  const [tollDate, setTollDate] = useState(formattedYesterday);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (targetNumber && licensePlate && tollBillId && tollDate) {
      onInitiateCall(targetNumber, { licensePlate, tollBillId, tollDate });
    } else {
      // Basic validation feedback for the user
      alert('Please fill in all fields (Target Number, License Plate, Toll Bill ID, Date).');
    }
  };

  return (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>Initiate New Call</CardTitle>
        <CardDescription>Configure the outbound number for the AI dialer.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="targetNumber">Target Number</Label>
            <Input
              id="targetNumber"
              placeholder="e.g., +1234567890"
              value={targetNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTargetNumber(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="licensePlate">License Plate</Label>
              <Input
                id="licensePlate"
                value={licensePlate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLicensePlate(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="tollDate">Date of Toll</Label>
              <Input
                id="tollDate"
                type="date"
                value={tollDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTollDate(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="tollBillId">Toll Bill ID</Label>
            <Input
              id="tollBillId"
              value={tollBillId}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTollBillId(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Initiating Call...' : 'Initiate Call'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
