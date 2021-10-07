import React, { useState, useEffect, memo } from 'react';
import { Mode } from './LoopMachine';
import styles from '../styles/PadStyles';
import { withStyles } from '@mui/styles';

const Pad = (props) => {
    const { classes, url, isPlay, index, mode, icon, handlePadClick } = props;

    const [audio, setAudio] = useState(new Audio(url))

    useEffect(() => {
        if (isPlay && mode === Mode.PLAYING) {
            audio.loop = true;
            audio.play();
        } else if (!isPlay || mode !== Mode.PLAYING) {
            audio.pause();
            audio.currentTime = 0;
        }
    }, [isPlay, mode])

    const handleClick = () => {
        handlePadClick(index)
    }

    const setPadColor = () => {
        let color;
        switch (mode) {
            case Mode.DISABLE:
                color = '#a8adc0'
                break;
            case Mode.PENDING:
                color = '#FED128'
                break;
            case Mode.PLAYING:
                color = '#2d4dce'
                break;
            default:
                color = '#a8adc0'
        }
        return color;
    }

    return (
        <div className={classes.pad} style={{ boxShadow: `0px 0px 10px ${setPadColor()}` }} onClick={handleClick}>
            <img src={icon} className={classes.icon} alt="pad" />
        </div>
    );
};

export default withStyles(styles)(memo(Pad, (props, nextProps) => {
    if (props.mode === nextProps.mode && props.handlePadClick === nextProps.handlePadClick) return true;
}));

