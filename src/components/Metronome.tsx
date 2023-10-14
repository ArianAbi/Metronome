import { useState, useEffect, type ChangeEvent } from 'react';
import rideSample from '/samples/ride/new-ride.wav';
import rideSampleAccent from '/samples/ride/new-ride-accent.wav';
import '../../animation.css';

export default function Metronome() {
  const minTempo = 20;
  const maxTempo = 320;

  const [metronome, setMetronome] = useState<null | number>(null);
  const [pendulumWeightPosition, setPendulumWeightPosition] = useState(0);
  const [tickCount, setTickCount] = useState(0);
  const [tempo, setTempo] = useState(120);
  const [bars, setBars] = useState(0);
  const [timeSigniture, setTimeSignuture] = useState(4);

  const [metronomeSound, setMetronomeSound] = useState<HTMLAudioElement>();
  const [metronomeAccentSound, setMetronomeAccentSound] =
    useState<HTMLAudioElement>();
  const [timeSigDialogOpen, setTimeSigDialogOpen] = useState(false);

  const secondInMs = 60000;
  const tickDuration = secondInMs / tempo;

  //set the audios
  useEffect(() => {
    setMetronomeSound(new Audio(rideSample));
    setMetronomeAccentSound(new Audio(rideSampleAccent));
  }, []);

  //on tempo or time signuture change update the interval and swing-animation duration
  useEffect(() => {
    // calculate pendulum position
    const ratio = 0.7;
    setPendulumWeightPosition(((tempo * 100) / maxTempo) * ratio);

    // update the swing animation
    document.documentElement.style.setProperty(
      '--swing-duration',
      `${tickDuration}ms`,
    );

    // reset the metronome
    if (metronome) {
      clearInterval(metronome);
      setMetronome(null);

      setTimeout(() => {
        setMetronome(setInterval(tickMetronome,tickDuration))
      }, 10);
    }
  }, [tempo, timeSigniture]);

  function toggleMetronome() {
    //start if we dont have a metronome
    if (!metronome) {
      setBars(0);
      setMetronome(setInterval(tickMetronome, tickDuration));

      return;
    }

    //else stop the metronome
    setTickCount(0);
    clearInterval(metronome);
    setMetronome(null);
  }

  function tickMetronome() {
    setTickCount((prevCount) => {
      if (prevCount >= timeSigniture) {
        setBars((prevBar) => prevBar + 1);
        return 1;
      } else {
        return prevCount + 1;
      }
    });
  }

  function handleTimeSignutureChange(timeSigniture: number) {
    setTimeSignuture(timeSigniture);
  }

  //on tick count change play a sound
  useEffect(() => {
    //dont do anything if metronome is not toggled
    if (!metronome || !metronomeSound || !metronomeAccentSound) {
      return;
    }

    if (tickCount === 1) {
      metronomeSound.pause();
      metronomeSound.currentTime = 0;
      metronomeSound.play();
    } else {
      metronomeAccentSound.pause();
      metronomeAccentSound.currentTime = 0;
      metronomeAccentSound.play();
    }
  }, [tickCount]);

  function adjustTempo(value: number) {
    if (tempo > maxTempo || tempo < minTempo) {
      return;
    }
    setTempo((prevTempo) => prevTempo + value);
  }

  return (
    <>
      <div className="mx-auto flex h-screen max-w-screen-md flex-col items-center">
        {/* title */}
        <h1 className="z-50 mb-2 w-[60%] border-b-2 border-white py-3 text-center text-xl font-bold md:w-full">
          Metronome
        </h1>

        {/* time signuture dialog box */}
        {timeSigDialogOpen && (
          <div
            onClick={() => setTimeSigDialogOpen(false)}
            className="absolute left-0 top-0 z-[99] flex h-full w-full items-center justify-center bg-black bg-opacity-25 backdrop-blur-sm"
          >
            {/* main content */}
            <div
              className="flex w-[250px] flex-col items-center justify-center gap-3 rounded-md bg-black bg-opacity-95 px-4 pt-4 pb-6"
              style={{boxShadow:"0px 0px 5px 2px #ffffff5a"}}
              onClick={(e) => e.stopPropagation()}
              >
              <h1 className="mb-4 text-lg font-bold tracking-wide">Time Signuture</h1>

              {Array.from({ length: 7 }, (el, index) => (
                <div
                  className="flex w-full gap-2 text-lg font-bold"
                  key={index}
                >
                  <input
                    type="radio"
                    name="timeSig"
                    checked={index + 2 === timeSigniture}
                    value={index + 2}
                    onChange={(e) =>
                      handleTimeSignutureChange(parseInt(e.target.value))
                    }
                  />
                  <label title={`${index + 2}`}>{index + 2}</label>
                  <img src="/quarter-note.svg" className="h-5"/>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className=" relative z-50 mt-4 flex h-12 w-full justify-around  gap-4 pl-[4.5rem] pr-4 sm:pr-12 md:h-16">
          {/* time signuture */}
          <div className="absolute left-0 flex  h-full flex-col items-center  justify-between border-r-[1px] text-lg text-white">
            <button
              onClick={() => setTimeSigDialogOpen(true)}
              className="w-16 text-center"
            >
              {timeSigniture}
            </button>

            {/* select arrow  */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={3}
              stroke="currentColor"
              className="absolute right-1 top-1/4 h-6 w-4 -translate-y-1/2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
            <hr className="w-3/5" />
            <span>4</span>
          </div>

          {Array.from({ length: timeSigniture }, (el, index) => (
            <div
              className="relative my-2 px-0 text-center text-white"
              key={index}
            >
              {/* note svg */}
              <img className="h-full " src="/quarter-note.svg" />

              {/* up arrow svg */}
              {tickCount === index + 1 && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="absolute z-[-1] h-6 w-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.47 7.72a.75.75 0 011.06 0l7.5 7.5a.75.75 0 11-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 01-1.06-1.06l7.5-7.5z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* bar counter */}
        <div className="z-50 mt-6">
          <p
            className={`text-center text-4xl ${
              tickCount === 1 ? 'text-cyan-400' : ''
            }`}
          >
            {tickCount}
          </p>
          <p>{bars} bars</p>
        </div>

        <div className="relative h-full w-full origin-bottom scale-95 sm:scale-100 lg:scale-125">
          {/* play button */}
          <button
            className={`absolute left-2/4 top-2/4 z-50 flex h-full w-full -translate-x-2/4 -translate-y-2/4 items-center justify-center
            text-2xl font-bold text-white backdrop-blur-sm transition-opacity duration-300
          ${metronome ? 'opacity-0' : 'opacity-100'}`}
            onClick={() => toggleMetronome()}
          >
            {/* round */}
            <div className="flex aspect-square w-[220px] items-center justify-center rounded-full border-[10px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-16 w-16"
              >
                <path
                  fillRule="evenodd"
                  d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>

          {/* pendulum */}
          <div
            className={`absolute bottom-0 left-2/4 mt-auto h-[350px] w-2 origin-bottom -translate-x-2/4 translate-y-4 bg-stone-400
          ${metronome ? 'pendulum-swing' : ''}`}
          >
            {/* pendulum weight */}
            <img
              className={`absolute left-2/4 top-[${pendulumWeightPosition}%] w-[50px] max-w-none -translate-x-2/4`}
              style={{ top: `${pendulumWeightPosition}%` }}
              src="/pendulum-weight.svg"
              alt="pendulum-weight"
            />
          </div>
          {/* metronome background */}
          <img
            className="absolute bottom-0 left-2/4 -z-10 max-w-none -translate-x-2/4"
            src="metronome-background.svg"
            alt="metronome background"
          />
        </div>

        {/* controls */}
        <div className="z-10 flex w-full flex-col items-center justify-center bg-[#001b2a] pb-4 pt-4 md:rounded-t-3xl">
          {/* tempo */}
          <div className="flex h-full w-full items-center justify-between px-12 py-2">
            <div className="divide-y-2">
              <button
                className="mb-2 h-[35px] w-[35px] text-white"
                onClick={() => adjustTempo(-5)}
              >
                -5
              </button>
              <button
                className="mb-2 h-[35px] w-[35px] text-white"
                onClick={() => adjustTempo(-1)}
              >
                -1
              </button>
            </div>

            <div className="mx-6 w-full text-center">
              <input
                className="w-full"
                type="range"
                min={minTempo}
                max={maxTempo}
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
                onClick={() => adjustTempo(5)}
              >
                +5
              </button>
              <button
                className="mb-2 h-[35px] w-[35px] text-white"
                onClick={() => adjustTempo(1)}
              >
                +1
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
