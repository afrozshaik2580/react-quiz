import "../styles.css";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import FinishScreen from "./FinishScreen";
import Progress from "./Progress";
import Timer from "./Timer";
import {useEffect, useReducer} from "react";

const initialState={
    questions:[],
    status:"loading",
    index:0,
    answer:null,
    points:0,
    highScore:0,
    secondsRemaining:null
};
const SECS_PER_QUESTION=30;
function reducer(state,action){
    switch(action.type){
        case "dataRecieved":
            return {
                ...state,
                questions:action.payload,
                status:"ready"};
        case "dataFailed":
            return {
                ...state,status:"error"
            }
        case "start":
            return {
                ...state,
                status:"start",
                secondsRemaining:state.questions.length*SECS_PER_QUESTION
            }
        case "newAnswer":
            const question=state.questions[state.index];
            return {
                ...state,
                answer:action.payload,
                points:question.correctOption===action.payload?state.points+question.points:state.points
            }
        case "nextQuestion":
            return {
                ...state,
                index: state.index+1,
                answer:null
            }
        case "finish":
            return {
                ...state,
                highScore:state.points>state.highScore?state.points:state.highScore,
                status:"finished"
            }
        case "restart":
            return{
                ...state,
                status:"ready",
                index:0,
                answer:null,
                points:0
            }
        case "tick":
            return {
                ...state,
                secondsRemaining:state.secondsRemaining-1,
                status:state.secondsRemaining===0?"finished":state.status
            }
        default:
            throw new Error("Unknown type");
    }
}
export default function App(){

    const [{questions,status,index,answer,points,highScore,secondsRemaining},dispatch]=useReducer(reducer,initialState);
    const numQuestions=questions.length;
    const totalPoints=questions.reduce((prev,question)=>prev+question.points,0);
    useEffect(function(){
        async function getData(){
            const res=await fetch("http://localhost:4000/questions");
            const data=await res.json();
            dispatch({type:"dataRecieved",payload:data});
        }
        getData().catch(err=>{dispatch({type:"dataFailed"})});
    },[])

    return (
        <>
            <Header/>
            <Main>
                {status==="loading" && <Loader />}
                {status==="error" && <Error />}
                {status==="ready" && 
                    <StartScreen 
                        numQuestions={numQuestions}
                        dispatch={dispatch}
                    />
                }
                {status==="start" && 
                <>
                    <Progress 
                        answer={answer} 
                        index={index} 
                        points={points} 
                        numQuestions={numQuestions} 
                        totalPoints={totalPoints}
                    />
                    <Question 
                        question={questions[index]}
                        dispatch={dispatch}
                        answer={answer}
                        />
                    <Timer dispatch={dispatch} secondsRemaining={secondsRemaining}/>
                    <NextButton 
                        dispatch={dispatch} 
                        answer={answer} 
                        index={index} 
                        numQuestions={numQuestions}
                    />
                </>   
                }
                {status==="finished" && 
                    <FinishScreen 
                        points={points} 
                        totalPoints={totalPoints} 
                        highScore={highScore} 
                        dispatch={dispatch}
                    />
                }
            </Main>
        </>
    )
}