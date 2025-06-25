export interface DisputeDetails{
    id?:string,
    taskId: string,
    reporter_role:"Neighbor"|"User",
    reportedBy: string | { id: string; name: string };
    details: string,
    dispute_status?:"open"|"under_review"|"resolved"|"rejected"

}