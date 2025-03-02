import { createPortal } from "react-dom";
import { FaCheckCircle } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

export default function AcceptMatch({onSetShow,onAcceptMatch}:{onSetShow:CallableFunction,onAcceptMatch:CallableFunction}){
   return createPortal(
        <div className="fixed bg-black top-0 bg-opacity-10 justify-center items-center flex w-screen h-screen">
            <div className="flex flex-col gap-4 p-8 border-2 shadow-xl bg-white rounded-xl relative ">
                <div className="flex flex-col gap-4 text-center">
                    <h1 className="text-3xl font-bold">Accept Match</h1>
                    <p className="text-slate-500">The user wants to create a match with you</p>

                </div>
                <div className="flex gap-4 w-full">
                    <button onClick={()=>onAcceptMatch()} className="text-white w-full rounded-xl bg-secondary p-2 hover:opacity-50 duration-300">Accept</button>
                    <button onClick={()=>onSetShow(false)} className="border-2 w-full rounded-xl p-2 hover:opacity-50 duration-300">Cancel</button>
                </div>
            </div>
            
        </div>
        , document.querySelector(".max-top") as HTMLElement
    )
}