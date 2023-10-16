import { motion } from 'framer-motion';

interface Pendulum {
  tempo: number;
  playing: boolean;
  pendulumWeightPosition: number;
}

export default function Pendulum({
  tempo,
  playing,
  pendulumWeightPosition,
}: Pendulum) {
  return (
    <>
      <motion.div
        key={tempo}
        className="absolute bottom-0 left-2/4 mt-auto h-[350px] w-2 origin-bottom -translate-x-2/4 translate-y-4 bg-stone-400"
        initial={{ rotate: 0 }}
        animate={{ rotate: playing ? [-20, 20] : 0 }}
        transition={{
          repeat: playing ? Infinity : 0,
          duration: 60 / tempo,
          repeatType: 'mirror',
        }}
      >
        {/* pendulum weight */}
        <img
          className={`absolute left-2/4 top-[${pendulumWeightPosition}%] w-[50px] max-w-none -translate-x-2/4`}
          style={{ top: `${pendulumWeightPosition}%` }}
          src="/pendulum-weight.svg"
          alt="pendulum-weight"
        />
      </motion.div>
      {/* metronome background */}
      <img
        className="absolute bottom-0 left-2/4 -z-10 max-w-none -translate-x-2/4"
        src="metronome-background.svg"
        alt="metronome background"
      />
    </>
  );
}
