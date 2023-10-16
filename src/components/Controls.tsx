import type { ChangeEvent, Dispatch, SetStateAction } from 'react';

interface Controls {
  tempo: number;
  setTempo: Dispatch<SetStateAction<number>>;
  minTempo: number;
  maxTempo: number;
}

export default function Controls({
  tempo,
  setTempo,
  minTempo,
  maxTempo,
}: Controls) {
  function AdjustTempo(value: number) {
    setTempo((prev) => {
      if (tempo >= maxTempo) {
        if (value < 0) {
          return prev + value;
        }
        return prev;
      }

      if (tempo <= minTempo) {
        if (value > 0) {
          return prev + value;
        }
        return prev;
      }

      return prev + value;
    });
  }

  return (
    <>
      <div className="z-10 flex w-full flex-col items-center justify-center bg-[#001b2a] pb-4 pt-4 md:rounded-t-3xl">
        <div className="flex h-full w-full items-center justify-between px-12 py-2">
          <div className="divide-y-2">
            <button
              className="mb-2 h-[35px] w-[35px] text-white"
              onClick={() => AdjustTempo(-5)}
            >
              -5
            </button>
            <button
              className="mb-2 h-[35px] w-[35px] text-white"
              onClick={() => AdjustTempo(-1)}
            >
              -1
            </button>
          </div>

          <div className="mx-6 w-full text-center">
            {/* Tempo Slider*/}
            <input
              className="h-12 w-full outline-2"
              type="range"
              min={20}
              max={320}
              value={tempo}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setTempo(parseInt(e.target.value))
              }
            />
            <p>tempo : {tempo}</p>
          </div>

          <div className="divide-y-2">
            <button
              className="mb-2 h-[35px] w-[35px] text-white"
              onClick={() => AdjustTempo(5)}
            >
              +5
            </button>
            <button
              className="mb-2 h-[35px] w-[35px] text-white"
              onClick={() => AdjustTempo(1)}
            >
              +1
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
