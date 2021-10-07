import React, { useState, useEffect, memo } from 'react';
import { Mode } from './LoopMachine'
import { withStyles } from '@mui/styles';

const styles = {
    pad: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "90px",
        height: "90px",
        margin: "0.6rem",
        border: "1px solid black",
        borderRadius: "15px",
        backgroundColor: "rgb(31, 31, 34)",
        transition: "all 0.25s ease-out",
        "&:hover": {
            cursor: "pointer",
            backgroundColor: "rgb(20, 20, 22)",
        }
    },
    icon: {
        width: "50px",
        height: "50px",
        "& img": {
            color: "white"
        }
    }
}

const Pad = (props) => {
    const { classes, url, isPlay, index, mode, icon, handlePadClick } = props;

    const [audio, setAudio] = useState(new Audio(url))

    useEffect(() => {
        console.log(`pad number ${index}`)
    })

    useEffect(() => {
        if (isPlay && mode === Mode.PLAYING) {
            console.log('start play pad', new Date().getMilliseconds())
            audio.loop = true;
            audio.play();
        } else if (!isPlay || mode !== Mode.PLAYING) {
            audio.pause();
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
    if (props.mode === nextProps.mode) return true;
}));

