import React from 'react';
import { withStyles } from '@mui/styles';
import styles from '../styles/ControlButtonStyles';

const ControlButton = (props) => {
    const { classes, color, handleClick, icon, text } = props;
    return (
        <div className={classes.button} style={{ color: color }} onClick={handleClick}>
            {icon && <img src={icon} alt="button" /> }
            {text && text}
        </div>
    );
};

export default withStyles(styles)(ControlButton);