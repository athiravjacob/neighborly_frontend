import { newTaskDetails } from "./newTaskDetails";

export interface DisputeDetails{
    _id?:string,
    taskId: string|newTaskDetails,
    reporter_role:"Neighbor"|"User",
    reportedBy: string | { id: string; name: string };
    details: string,
    dispute_status?:"open"|"under_review"|"resolved"|"rejected"
}

export interface populated_disputeDetails{
    _id:string,
    taskId: newTaskDetails,
    reporter_role:"Neighbor"|"User",
    reportedBy: { id: string; name: string };
    details: string,
    dispute_status: "open" | "under_review" | "resolved" | "rejected",
    createdAt:Date
}
