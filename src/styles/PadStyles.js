export default {
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