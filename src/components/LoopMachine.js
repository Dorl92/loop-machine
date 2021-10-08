import React, { useState, useEffect, useRef, useCallback } from 'react';
import { withStyles } from '@mui/styles';
import styles from '../styles/LoopMachineStyles';
import Pad from './Pad';
import ControlButton from './ControlButton';

import futureFunk from '../loop_samples/120_future_funk_beats_25.mp3';
import stutterBreakbeats from '../loop_samples/120_stutter_breakbeats_16.mp3';
import BassWarwick from '../loop_samples/Bass Warwick heavy funk groove on E 120 BPM.mp3';
import electricGuitar from '../loop_samples/electric guitar coutry slide 120bpm - B.mp3';
import StompySlosh from '../loop_samples/FUD_120_StompySlosh.mp3';
import GrooveB from '../loop_samples/GrooveB_120bpm_Tanggu.mp3';
import MazePolitics from '../loop_samples/MazePolitics_120_Perc.mp3';
import PAS3GROOVE from '../loop_samples/PAS3GROOVE1.03B.mp3';
import SilentStar from '../loop_samples/SilentStar_120_Em_OrganSynth.mp3';

import bass from '../icons/bass.svg';
import disc from '../icons/disc.svg';
import drum1 from '../icons/drum1.svg';
import drum2 from '../icons/drum2.svg';
import drum3 from '../icons/drum3.svg';
import guitar from '../icons/guitar.svg';
import note1 from '../icons/note1.svg';
import note2 from '../icons/note2.svg';
import piano from '../icons/piano.svg';
import play from '../icons/play.svg';
import stop from '../icons/stop.svg';
import pause from '../icons/pause.svg';
import record from '../icons/recording.svg';
import stopRecord from '../icons/stop-recording.svg'

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

export const Action = {
    PLAY: 'play',
    PAUSE: 'pause',
    STOP: 'stop'
}

const LoopMachine = (props) => {
    const { classes } = props;

    const [isPlay, setIsPlay] = useState(false)
    const [addPending, setAddPending] = useState(false)
    const [isRecording, setIsRecording] = useState(false)
    const [looper, setLooper] = useState(Array(9).fill(Mode.DISABLE))
    const [pending, setPending] = useState([])
    const [playing, setPlaying] = useState([])
    const [recordingTimestamp, setRecordingTimestamp] = useState()
    const [currentSession, setCurrentSession] = useState([])
    const [startRecordingState, setStartRecordingState] = useState()

    const looperRef = useRef()
    looperRef.current = looper;

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
            setLooper(prevState => {
                const updatedLooper = [...prevState]
                pending.forEach(i => {
                    updatedLooper[i] = Mode.PLAYING;
                })
                return updatedLooper;
            })
            setPlaying(prevState => [...prevState, ...pending])
            setPending([])
        }
    }, [addPending])

    const recordActionIfNeeded = (pad, action) => {
        isRecording && setCurrentSession(prevState => [...prevState, { time: (+(new Date()).getTime() - +(new Date(recordingTimestamp)).getTime()), pad, action }])
    }

    const handlePadClick = useCallback((index) => {
        let mode;
        switch (looperRef.current[index]) {
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
                setPlaying(prevState => prevState.filter(i => i !== index))
                break;
            default:
        }
        recordActionIfNeeded(index, null)
        setLooper(prevState => {
            const updatedLooper = [...prevState]
            updatedLooper[index] = mode;
            return updatedLooper;
        })
    }, [looper, isRecording])

    const handlePlay = () => {
        setAddPending(true)
        recordActionIfNeeded(null, Action.PLAY)
        setIsPlay(true)
    }

    const handlePause = () => {
        recordActionIfNeeded(null, Action.PAUSE)
        setIsPlay(false)
        setLooper(prevState => {
            const updatedLooper = [...prevState]
            playing.forEach(i => {
                updatedLooper[i] = Mode.PENDING;
            })
            return updatedLooper;
        })
        setPending(prevState => [...prevState, ...playing])
        setPlaying([])
    }

    const handleStop = () => {
        setIsPlay(false)
        recordActionIfNeeded(null, null, Action.STOP)
        setLooper(prevState => prevState.map(sample => sample = Mode.DISABLE))
        setPlaying([])
        setPending([])
    }

    const handleStartRecording = () => {
        setIsRecording(true)
        setCurrentSession([])
        setStartRecordingState({
            looper: [...looper],
            pending: [...pending],
            playing: [...playing],
            isPlay: isPlay,
            addPending: addPending
        })
        setRecordingTimestamp(new Date())
    }

    const handleStopRecording = () => {
        recordActionIfNeeded(null, Action.STOP)
        setIsRecording(false)
    }

    const updateStartRecordingState = () => {
        setLooper([...startRecordingState.looper])
        setPending([...startRecordingState.pending])
        setPlaying([...startRecordingState.playing])
        setIsPlay(startRecordingState.isPlay)
        setAddPending(startRecordingState.addPending)
    }

    const handlePlaySession = () => {
        updateStartRecordingState()
        currentSession.forEach(record => {
            if (record.pad !== null) {
                setTimeout(() => {
                    handlePadClick(record.pad)
                }, record.time)
            } else {
                switch (record.action) {
                    case Action.PLAY:
                        setTimeout(() => {
                            handlePlay()
                        }, record.time)
                        break;
                    case Action.PAUSE:
                        setTimeout(() => {
                            handlePause()
                        }, record.time)
                        break;
                    case Action.STOP:
                        setTimeout(() => {
                            handleStop()
                        }, record.time)
                        break;
                    default:
                }
            }
        })
    }

    const shouldShowPlaySession = currentSession.length > 0 && !isRecording;

    return (
        <div id='root' className={classes.root}>
            <div className={classes.title}>
                <div className='neon'>GROO</div>
                <div className='flux'>VEO</div>
            </div>
            <div className={classes.buttons}>
                {isPlay ?
                    <ControlButton color='#C9A42A' handleClick={handlePause} icon={pause} />
                    :
                    <ControlButton color='#1D831D' handleClick={handlePlay} icon={play} />
                }
                <ControlButton color='#AA0C0C' handleClick={handleStop} icon={stop} />
                {isRecording ?
                    <ControlButton color='#EE7614' handleClick={handleStopRecording} icon={stopRecord} />
                    :
                    <ControlButton color='#40A6B8' handleClick={handleStartRecording} icon={record} />
                }

                {shouldShowPlaySession && <ControlButton color='#EE7614' handleClick={handlePlaySession} text={'Play Session'} />}
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

