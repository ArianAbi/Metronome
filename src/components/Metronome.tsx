// import '../../global.css'
import { useState, useEffect, type ChangeEvent } from 'react'
import rideSample from '/samples/ride/ride-sample.mp3'
import rideSampleAccent from '/samples/ride/ride-sample-accent.wav'

export default function Metronome() {

    const [metronome, setMetronome] = useState<null | number>(null);
    const [tickCount, setTickCount] = useState(0);
    const [tempo, setTempo] = useState(120);
    const [tick, setTick] = useState(false);
    const [bars, setBars] = useState(0);
    const [timeSigniture, setTimeSignuture] = useState(4);

    const [metronomeSound, setMetronomeSound] = useState<HTMLAudioElement>();
    const [metronomeAccentSound, setMetronomeAccentSound] = useState<HTMLAudioElement>();

    const secondInMs = 60000;
    const tickDuration = secondInMs / tempo;

    //set the audios
    useEffect(() => {
        setMetronomeSound(new Audio(rideSample))
        setMetronomeAccentSound(new Audio(rideSampleAccent))
    }, [])

    //on tempo or time signuture change update the interval and swing-animation duration
    useEffect(() => {

        document.documentElement.style.setProperty('--swing-duration', `${tickDuration}ms`);

        if (metronome) {
            clearInterval(metronome)
            setMetronome(setInterval(tickMetronome, tickDuration))
        }
    }, [tempo, timeSigniture])

    function toggleMetronome() {
        //start if we dont have a metronome
        if (!metronome) {
            setBars(0)
            setMetronome(setInterval(tickMetronome, tickDuration))

            return
        }

        //else stop the metronome
        setTickCount(0)
        clearInterval(metronome)
        setMetronome(null)
    }


    function tickMetronome() {
        setTickCount(prevCount => {
            if (prevCount >= timeSigniture) {
                setBars(prevBar => prevBar + 1)
                return 1
            } else {
                return prevCount + 1
            }
        })
    }

    //on tick count change play a sound
    useEffect(() => {
        //dont do anything if metronome is not toggled
        if (!metronome || !metronomeSound || !metronomeAccentSound) {
            return
        }

        if (tickCount === 1) {
            metronomeSound.pause()
            metronomeSound.currentTime = 0
            metronomeSound.play()
        } else {
            metronomeAccentSound.pause()
            metronomeAccentSound.currentTime = 0
            metronomeAccentSound.play()
        }

        setTick(true)
        setTimeout(() => {
            setTick(false)
        }, tickDuration / 4);

    }, [tickCount])

    return (
        <>
            <div className="flex flex-col items-center gap-2 h-screen">
                {/* title */}
                <h1 className="font-bold text-xl border-b-2 border-black pt-2 pb-3 px-4">
                    Metronome
                </h1>

                {/* Notes */}
                <div className='bg-gray-200 w-full px-12 h-16 flex gap-4 justify-center relative'>

                    {/* time signuture */}
                    <div className='bg-slate-900 text-white flex flex-col justify-between items-center px-2 absolute h-full left-0 text-lg'>
                        <select
                            className='bg-slate-900'
                            value={timeSigniture}
                            onChange={(e: any) => setTimeSignuture(e.target.value)}
                        >
                            <option value={2}>2</option>
                            <option value={3}>3</option>
                            <option value={4}>4</option>
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                            <option value={7}>7</option>
                            <option value={8}>8</option>
                        </select>
                        <hr className='w-6' />
                        <span>4</span>
                    </div>

                    {Array.from({ length: timeSigniture }, (el, index) => (
                        <div
                            className={`text-center px-2 text-white ${tickCount === index + 1 ? 'bg-red-500 ' : ''}`}
                            key={index}
                        >
                            <img
                                className='h-full'
                                src='/quarter-note.svg'
                            />
                        </div>
                    ))}
                </div>


                {/* options */}
                <div className='w-full h-8 bg-slate-600 text-bold text-white text-center'>
                    Options
                </div>

                {/* bar counter */}
                <div>
                    <p className={`text-4xl text-center ${tickCount === 1 ? "text-red-500" : ""}`}>
                        {tickCount}
                    </p>
                    <p>
                        {bars} bars
                    </p>
                </div>

                {/* pendulum */}
                <div className={`h-[200px] w-10 bg-gray-500 origin-bottom ${metronome ? 'pendulum-swing' : ''}`}></div>

                <button
                    className={`bg-green-700 py-2 px-4 rounded-lg text-white font-bold`}
                    onClick={() => toggleMetronome()}
                >
                    {!metronome ? 'Start Metronome' : 'Stop Metronome'}
                </button>

                {/* controls */}
                <div className='w-full bg-slate-400 flex flex-col justify-center items-center mt-auto'>
                    {/* tempo */}
                    <div className='w-full flex items-center justify-between py-2 px-12'>


                        <div className='w-full mx-6 text-center'>
                            <input
                                className='w-full'
                                type="range"
                                min={20}
                                max={320}
                                value={tempo}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setTempo(parseInt(e.target.value))}
                            />
                            <p>tempo : {tempo}</p>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}