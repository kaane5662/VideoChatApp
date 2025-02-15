import Question from "./Queston";



export default function FAQ(){
    return(
        <main className="p-32 min-h-screen max-md:px-4  ">
            <div className="flex flex-col gap-8">
                <h1 className="font-bold text-5xl text-center max-md:text-3xl">Got any <span className="text-secondary">Questions</span></h1>
                <div
                className="flex flex-col gap-6  items-center justify-center">
                    <Question question={"How many video chat credits do I get per month on the free plan?"} answer={"You are allowed to get 50 video chat sessions per month on the free plan."}></Question>
                    <Question question={"What counts as a video session?"} answer={"Any video session call with a user that has been going on for over 5 minutes."}></Question>
                    <Question question={"How many video chat credits do I get on premium plans?"} answer={"Both yearly and regular premium grant you unlimited video chat credits."}></Question>
                    <Question question={"Can I find friends to Leetcode with?"} answer={"Yes you can use our plaform to find Leetcoders with similar skills and interests as you."}></Question>
                    <Question question={"How many profiles can I direct message on free plan?"} answer={"You can message a maximum of only 5 people."}></Question>
                    
                </div>
                
            </div>
        </main>
    )
}