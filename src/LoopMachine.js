import React, { useState, useEffect, useCallback } from 'react';
import { withStyles } from '@mui/styles';
import Pad from './Pad';

import futureFunk from './loop samples/120_future_funk_beats_25.mp3';
import stutterBreakbeats from './loop samples/120_stutter_breakbeats_16.mp3';
import BassWarwick from './loop samples/Bass Warwick heavy funk groove on E 120 BPM.mp3';
import electricGuitar from './loop samples/electric guitar coutry slide 120bpm - B.mp3';
import StompySlosh from './loop samples/FUD_120_StompySlosh.mp3';
import GrooveB from './loop samples/GrooveB_120bpm_Tanggu.mp3';
import MazePolitics from './loop samples/MazePolitics_120_Perc.mp3';
import PAS3GROOVE from './loop samples/PAS3GROOVE1.03B.mp3';
import SilentStar from './loop samples/SilentStar_120_Em_OrganSynth.mp3';

import bass from './icons/bass.svg';
import disc from './icons/disc.svg';
import drum1 from './icons/drum1.svg';
import drum2 from './icons/drum2.svg';
import drum3 from './icons/drum3.svg';
import guitar from './icons/guitar.svg';
import note1 from './icons/note1.svg';
import note2 from './icons/note2.svg';
import piano from './icons/piano.svg';
import play from './icons/play.svg'
import stop from './icons/stop.svg'
import pause from './icons/pause.svg'
import record from './icons/recording.svg'


const SAMPLES = [
    { url: futureFunk, icon: note2 },
    { url: stutterBreakbeats, icon: note1 },
    { url: BassWarwick, icon: bass },
    { url: electricGuitar, icon: guitar },
    { url: StompySlosh, icon: drum2 },
    { url: GrooveB, icon: drum1 },
    { url: MazePolitics, icon: disc },
    { url: PAS3GROOVE, icon: drum3 },
    { url: SilentStar, icon: piano },
]

export const Mode = {
    DISABLE: 'disable',
    PENDING: 'pending',
    PLAYING: 'playing'
}

const styles = {
    root: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        display: "flex",
        margin: "2rem"
    },
    buttons: {
        display: "flex",
        margin: "1rem 0 2rem 0"
    },
    button: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "0.5rem",
        height: "30px",
        width: "fit-content",
        margin: "0.5rem",
        borderRadius: "20px",
        boxShadow: '0px 0px 10px ',
        transition: "all 0.1s ease-in",
        "&:hover": {
            cursor: "pointer",
            boxShadow: '0px 0px 18px',
        },
        "& img": {
            height: "25px",
            width: "40px",
        }
    },
    pads: {
        width: "fit-content",
        display: "grid",
        gridTemplateColumns: "repeat(3, 33.3333%)",
    }
}


const LoopMachine = (props) => {
    const { classes } = props;

    const [isPlay, setIsPlay] = useState(false)
    const [addPending, setAddPending] = useState(false)
    const [looper, setLooper] = useState(Array(9).fill(Mode.DISABLE))
    const [pending, setPending] = useState([])


    useEffect(() => {
        if (isPlay) {
            const loopInterval = setInterval(() => setAddPending(true), 4000)
            return () => {
                clearInterval(loopInterval);
            }
        }
    }, [isPlay])

    useEffect(() => {
        if (addPending) {
            setAddPending(false)
            console.log('new loop')
            console.log('handle pending', new Date().getMilliseconds())
            setLooper(prevState => {
                const updatedLooper = [...prevState]
                console.log(pending)
                pending.forEach(i => updatedLooper[i] = Mode.PLAYING)
                console.log(updatedLooper)
                return updatedLooper;
            })
            setPending([])
        }
    }, [addPending])

    const handlePadClick = useCallback((index) => {
        let mode;
        switch (looper[index]) {
            case Mode.DISABLE:
                mode = Mode.PENDING;
                setPending(prevState => [...prevState, index])
                break;
            case Mode.PENDING:
                mode = Mode.DISABLE;
                setPending(prevState => prevState.filter(i => i !== index))
                break;
            case Mode.PLAYING:
                mode = Mode.DISABLE;
                setPending(prevState => prevState.filter(i => i !== index))
                break;
            default:
        }
        setLooper(prevState => {
            const updatedLooper = [...prevState]
            updatedLooper[index] = mode;
            return updatedLooper;
        })
    }, [looper])

    const handlePlay = () => {
        setAddPending(true)
        setIsPlay(true)
    }
    const handlePause = () => {
        setIsPlay(false)
    }
    const handleStop = () => {
        setIsPlay(false)
        setLooper(prevState => prevState.map(sample => sample = Mode.DISABLE))
    }

    return (
        <div className={classes.root}>
            <div className={classes.title}>
                <div className='neon'>GROO</div>
                <div className='flux'>VEO</div>
            </div>
            <div className={classes.buttons}>
                {isPlay ?
                    <div className={classes.button} style={{ color: "rgb(201, 164, 42)" }} onClick={handlePause}><img src={pause} alt="pause" /></div>
                    :
                    <div className={classes.button} style={{ color: "rgb(29, 131, 29)" }} onClick={handlePlay}><img src={play} alt="play" /></div>

                }
                <div className={classes.button} style={{ color: "rgb(170, 12, 12)" }} onClick={handleStop}><img src={stop} alt="stop" /></div>
                <div className={classes.button} style={{ color: "rgb(64, 166, 184)" }} onClick={handleStop}><img src={record} alt="record" /></div>
            </div>
            <div className={classes.pads}>
                {SAMPLES.map((sample, index) => {
                    return (
                        <Pad
                            key={sample.url}
                            url={sample.url}
                            icon={sample.icon}
                            index={index}
                            mode={looper[index]}
                            handlePadClick={handlePadClick}
                            isPlay={isPlay}
                        />
                    )
                })}
            </div>
        </div>
    );
};

export default withStyles(styles)(LoopMachine);

