export default {
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
}