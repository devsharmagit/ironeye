interface CounterProps {
  count: number;
  onReset: () => void;
}

export function Counter({ count, onReset }: CounterProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center">
        <div className="text-6xl font-bold text-white mb-2">{count}</div>
        <div className="text-gray-400 text-lg">Push-ups</div>
      </div>
      <button
        onClick={onReset}
        className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
      >
        Reset
      </button>
    </div>
  );
}
