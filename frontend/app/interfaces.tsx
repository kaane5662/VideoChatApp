import { HttpStatusCode } from "axios"


export interface IProfile {
    firstName: string,
    lastName: string,
    industry: string,
    currentRole: string,
    frameworks: string[],
    description: string,
    programmingLanguages: string[],
    developmentInterests: string[],
    avaliability: string,
    id:string,
    identityUserId: string,
    similarityScore: number | null,
    matches: number,
    sessions: number,
    githubUrl: string,
    linkedInUrl: string,
    portfolioUrl: string,
    twitterUrl: string,
}

export interface IProfileSearch {
    industry: string,
    currentRole: string,
    programmingLanguages: string[],
    avaliability: string,
}

export interface IServiceResponse {
    response: IProfile | string | number,
    staus: HttpStatusCode
}