export default function UseCase({icon,use,desc}:{icon:any,use:string,desc:string}){
    return(
        
            
        <div className="w-full shadow-md border-2 h-full shadow-md bg-white flex p-4 flex-col gap-2">
            <div className="flex items-center gap-4">
                {icon}
                <h3 className="text-2xl font-bold max-md:text-xl ">{use}</h3>
            </div>
            <p className="text-slate-600 text-sm">{desc}</p>

        </div>
        
    )
}