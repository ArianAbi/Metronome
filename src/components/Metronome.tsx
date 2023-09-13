import '../../global.css'
import { useState, useEffect } from 'react'
import rideSample from '/samples/ride/ride-sample.mp3'
import rideSampleAccent from '/samples/ride/ride-sample-accent.wav'

export default function Metronome() {

    const [metronome, setMetronome] = useState<null | number>(null);
    const [tickCount, setTickCount] = useState(0);
    const [tempo, setTempo] = useState(100);
    const [tick, setTick] = useState(false);

    const secondInMs = 60000;
    const tickDuration = secondInMs / tempo;

    //on tempo change update the interval
    useEffect(() => {
        if (metronome) {
            clearInterval(metronome)
            setMetronome(setInterval(tickMetronome, tickDuration))
        }
    }, [tempo])

    function toggleMetronome() {
        //start if we dont have a metronome
        if (!metronome) {
            setMetronome(setInterval(tickMetronome, tickDuration))

            return
        }

        //else stop the metronome
        clearInterval(metronome)
        setMetronome(null)
    }


    function tickMetronome() {
        setTickCount(prevCount => prevCount == 4 ? 1 : prevCount + 1)

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
                <div className="flex flex-col items-center justify-center">
                    <label title="tempo">Tempo</label>
                    <input
                        id="tempo"
                        type="number"
                        value={tempo}
                        onChange={(e: any) => setTempo(e.target.value)}
                        className="border-2 border-gray-700 px-2"
                    />
                </div>
                <button
                    className={`bg-green-700 py-2 px-4 rounded-lg text-white font-bold`}
                    onClick={() => toggleMetronome()}
                >
                    {!metronome ? 'Start Metronome' : 'Stop Metronome'}
                </button>

                <div className={`${tick ? 'bg-red-500' : 'bg-gray-500'} w-24 h-24`}></div>
            </div>
        </>
    )
}