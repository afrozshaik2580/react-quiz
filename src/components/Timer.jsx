import { useEffect } from "react"

export default function Timer({dispatch,secondsRemaining}){
    const minutes=Math.floor(secondsRemaining/60);
    const seconds=secondsRemaining%60;
    useEffect(function(){
        const id=setInterval(()=>{
            dispatch({type:"tick"})
        },1000)
        return ()=>{clearInterval(id)}
    },[])
    return <footer className="timer">
        {minutes<10?"0":""}{minutes}:
        {seconds<10?"0":""}{seconds}
    </footer>
}