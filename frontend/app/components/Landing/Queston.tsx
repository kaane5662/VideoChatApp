"use client"
import { useState } from "react"
import { FaChevronDown, FaChevronUp } from "react-icons/fa";


export default function Question({question, answer}:{question:string,answer:string}){

    const [isOpen, toggleDropdown] = useState(false)
    return(
        <div className=" w-[70%] font-outfit p-3 border-b-2 bg-white rounded-md border-opacity-20 relative">
            <div className="absolute top-4 right-2">
                {!isOpen ? <FaChevronDown size={20} className=""></FaChevronDown>:<FaChevronUp size={20} className=""></FaChevronUp>}
            </div>
            <div onClick={()=>toggleDropdown(!isOpen)} className=" cursor-pointer justify-center items-center  rounded-md text-xl font-semibold text-center ">
            {question}
            </div>

            {isOpen && (
                <div className=" mt-4 rounded-xl">
                    <h3 className="text-slate-500 text-md max-md:text-sm text-center">{answer}</h3>
                    
                </div>
            )}
        </div>
    )
}