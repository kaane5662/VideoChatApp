import { IconContext } from "react-icons";

export default function ActivityCard({title,value,icon}:{title:string,value:number|string,icon:any}){
    return(
        <div className="p-4 bg-white border-2 border-opacity-20  flex gap-4 rounded-xl border-2 shadow-md">
            {icon}
            <div className="flex flex-col gap-1">
                <h3 className="text-sm ">{title}</h3>
                <p className="text-slate-500 text-xs">{value}</p>
            </div>
        </div>
    )
}