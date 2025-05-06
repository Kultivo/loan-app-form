import React, { useState, useRef, useEffect } from 'react';

interface PinInputProps {
  onChange: (pin: string) => void;
}

const PinInput: React.FC<PinInputProps> = ({ onChange }) => {
  const [pin, setPin] = useState<string[]>(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) {
      return;
    }

    // Update pin state
    const newPin = [...pin];
    newPin[index] = value.slice(-1); // Only take the last character
    setPin(newPin);
    
    // Combine pin digits and call onChange
    onChange(newPin.join(''));

    // Auto-focus next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="w-full mt-4">
      <label className="block text-gray-800 font-medium mb-2">Create a PIN</label>
      <div className="flex gap-2">
        {[...Array(6)].map((_, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="password"
            value={pin[index]}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            maxLength={1}
            className="w-full h-14 border border-gray-300 rounded text-center text-xl focus:border-blue-500 focus:outline-none"
            aria-label={`PIN digit ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PinInput;