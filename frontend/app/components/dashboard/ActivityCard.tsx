import { IconContext } from "react-icons";

export default function ActivityCard({title,value,icon}:{title:string,value:number|string,icon:any}){
    return(
        <div className="p-4 bg-white border-secondary border-opacity-20  flex gap-4 rounded-sm border-2 shadow-md">
            {icon}
            <div className="flex flex-col gap-2">
                <h3 className=" ">{title}</h3>
                <p className="text-secondary text-opacity-50 text-sm">{value}</p>
            </div>
        </div>
    )
}