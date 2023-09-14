import '../../global.css'
import { useState, useEffect } from 'react'
import rideSample from '/samples/ride/ride-sample.mp3'
import rideSampleAccent from '/samples/ride/ride-sample-accent.wav'

export default function Metronome() {

    const [metronome, setMetronome] = useState<null | number>(null);
    const [tickCount, setTickCount] = useState(0);
    const [tempo, setTempo] = useState(120);
    const [tick, setTick] = useState(false);
    const [bars, setBars] = useState(0);
    const [timeSigniture, setTimeSignuture] = useState(4);

    const secondInMs = 60000;
    const tickDuration = secondInMs / tempo;

    //on tempo or time signuture change update the interval
    useEffect(() => {
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

        setTick(true)
        setTimeout(() => {
            setTick(false)
        }, tickDuration / 4);
    }

    //on tick count change play a sound
    useEffect(() => {
        console.log(tickCount);

        //dont do anything if metronome is not toggled
        if (!metronome) {
            return
        }
        const soundToPlay = tickCount === 1 ? rideSample : rideSampleAccent
        new Audio(soundToPlay).play()
    }, [tickCount])

    return (
        <>
            <div className="flex flex-col justify-center items-center gap-2">
                <h2 className="font-bold">Metronome</h2>
                <div>bars : {bars}</div>
                <div className="flex flex-col items-center justify-center">
                    <label title="tempo">Tempo : {tempo}</label>
                    <input
                        type="range"
                        min={20}
                        max={320}
                        value={tempo}
                        onChange={(e: any) => {
                            setTempo(e.target.value)
                        }}
                    />
                </div>

                <div>
                    <label>Time Signuture</label>
                    <select
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
                </div>

                <button
                    className={`bg-green-700 py-2 px-4 rounded-lg text-white font-bold`}
                    onClick={() => toggleMetronome()}
                >
                    {!metronome ? 'Start Metronome' : 'Stop Metronome'}
                </button>

                <div className={`${tick ? tickCount === 1 ? 'bg-purple-500' : 'bg-red-500' : 'bg-gray-500'} w-24 h-24`}></div>
                <div className={`w-24 h-24 bg-slate-800 ${metronome ? 'pendulum-swing' : ''}`}>pendulum</div>
            </div>
        </>
    )
}