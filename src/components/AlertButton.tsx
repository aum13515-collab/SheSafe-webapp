import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, Loader } from 'lucide-react';
import { SOS_HOLD_DURATION } from '../utils/constants';

interface AlertButtonProps {
  onPress: () => Promise<void>;
  isDisabled?: boolean;
  contactCount?: number;
}

export const AlertButton: React.FC<AlertButtonProps> = ({
  onPress,
  isDisabled = false,
  contactCount = 0
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pressTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  const handleMouseDown = () => {
    if (isDisabled || isLoading || contactCount === 0) return;
    setIsPressed(true);
    pressTimeRef.current = Date.now();
    animate();
  };

  const animate = () => {
    const elapsed = Date.now() - pressTimeRef.current;
    const newProgress = Math.min((elapsed / SOS_HOLD_DURATION) * 100, 100);
    setProgress(newProgress);

    if (newProgress >= 100) {
      setShowConfirm(true);
      setIsPressed(false);
    } else {
      animationFrameRef.current = requestAnimationFrame(animate);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    setProgress(0);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    setError(null);
    setIsLoading(true);
    try {
      await onPress();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send alert');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setProgress(0);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-40 h-40">
        {/* Outer ring with progress */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#f3f4f6"
            strokeWidth="3"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={isPressed ? '#E91E8C' : '#D32F2F'}
            strokeWidth="3"
            strokeDasharray={`${(progress / 100) * 282.7} 282.7`}
            className="transition-all duration-100"
          />
        </svg>

        {/* Button */}
        <button
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          disabled={isDisabled || isLoading || contactCount === 0}
          className={`absolute inset-0 rounded-full flex items-center justify-center font-bold text-center transition-all ${
            isDisabled || contactCount === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isLoading
              ? 'bg-pink-600 text-white'
              : isPressed
              ? 'bg-pink-700 text-white scale-95'
              : 'bg-red-600 hover:bg-red-700 text-white active:scale-95'
          }`}
        >
          {isLoading ? (
            <Loader className="w-8 h-8 animate-spin" />
          ) : (
            <div>
              <div className="text-3xl">🆘</div>
              <div className="text-xs mt-1">HOLD {SOS_HOLD_DURATION / 1000}s</div>
            </div>
          )}
        </button>
      </div>

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end z-50">
          <div className="bg-white w-full rounded-t-2xl p-6 shadow-lg animate-in">
            <h3 className="text-xl font-bold text-pink-600 mb-2">Send SOS Alert?</h3>
            <p className="text-gray-600 mb-6">
              Alert will be sent to {contactCount} emergency contact{contactCount !== 1 ? 's' : ''}.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold"
              >
                Send Alert
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="w-full bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2 text-sm text-red-700">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {contactCount === 0 && (
        <p className="text-sm text-red-600 font-semibold">Add contacts to enable alerts</p>
      )}
    </div>
  );
};
