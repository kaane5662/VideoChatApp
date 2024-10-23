export default function PaddedList({items}:{items:string[]}){
    return(

        <div className="flex flex-wrap gap-1 ">
            {items?.map((item, index)=>{
                return(
                    <p key={index} className=" w-fit bg-secondary shadow-xl text-primary p-1 px-3 text-xs rounded-xl">{item}</p>
                )
            })}

        </div>
    )
}