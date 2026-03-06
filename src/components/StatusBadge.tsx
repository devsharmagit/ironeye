import { PushUpState } from '../utils/repCounter';

interface StatusBadgeProps {
  state: PushUpState;
  angle: number;
}

export function StatusBadge({ state, angle }: StatusBadgeProps) {
  const getStateColor = () => {
    switch (state) {
      case 'UP':
        return 'bg-green-500';
      case 'DOWN':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className={`px-6 py-3 rounded-lg ${getStateColor()} text-white font-bold text-xl`}>
        {state}
      </div>
      <div className="text-gray-300 text-lg">
        Angle: {Math.round(angle)}°
      </div>
    </div>
  );
}
