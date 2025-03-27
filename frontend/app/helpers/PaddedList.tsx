import { cn } from "@/lib/utils"

export default function PaddedList({items,className}:{items:string[],className?:string}){
    return(

        <div className={cn("flex flex-wrap gap-1")}>
            {items?.map((item, index)=>{
                return(
                    <p key={index} className={cn("w-fit bg-slate-100 border-2  p-0 px-2 text-xs rounded-xl",className)}>{item}</p>
                )
            })}

        </div>
    )
}