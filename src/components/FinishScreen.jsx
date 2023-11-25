export default function FinishScreen({points,totalPoints,highScore,dispatch}){
    const percent=(points/totalPoints)*100;
    let emoji;
    if(percent===100) emoji="🎖️";
    if(percent>=80 && percent<100) emoji="😊";
    if(percent>=60 && percent <80) emoji="😶";
    if(percent<60) emoji="🤦‍♂️";
    return <>
        <p className="result">
            <span>{emoji}</span>You scored {points} out of {totalPoints} ({Math.ceil(percent)}%)
        </p>
        <p className="highscore">
            (HighScore: {highScore})
        </p>
        <button 
            className="btn btn-ui"
            onClick={()=>{dispatch({type:"restart"})}}
        >Restart Quiz</button>
    </>
}