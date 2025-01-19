
import { useState } from "react"
import { getDirectMessages } from "../../services/messages"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"
import { IDirectMessage } from "../../interfaces"
import Contact from "../../components/messages/Contact"

export default async function MessagesPage(){
    // const DirectMessages:IDirectMessage[] = await getDirectMessages(cookies().toString())
    const DirectMessages:IDirectMessage[] = await getDirectMessages(cookies().toString())
    
    return(
        <main className="p-16 flex flex-col gap-8 h-full ">
            <h1 className="font-bold text-4xl">Direct Messages</h1>
            <div className="flex flex-col">
                {DirectMessages?.map((directMessage, index)=>{
                    return(
                        <Contact directMessage={directMessage}></Contact>
                    )
                })}
            </div>
        </main>

    )
}