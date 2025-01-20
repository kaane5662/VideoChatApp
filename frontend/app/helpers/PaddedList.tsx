export default function PaddedList({items}:{items:string[]}){
    return(

        <div className="flex flex-wrap gap-1 ">
            {items?.map((item, index)=>{
                return(
                    <p key={index} className=" w-fit bg-secondary shadow-xl text-complementary p-1 px-2 text-xs rounded-xl">{item}</p>
                )
            })}

        </div>
    )
}