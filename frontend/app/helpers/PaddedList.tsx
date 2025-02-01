export default function PaddedList({items}:{items:string[]}){
    return(

        <div className="flex flex-wrap gap-1 ">
            {items?.map((item, index)=>{
                return(
                    <p key={index} className=" w-fit bg-slate-100 border-2  p-0 px-2 text-xs rounded-xl">{item}</p>
                )
            })}

        </div>
    )
}