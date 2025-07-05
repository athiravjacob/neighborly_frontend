interface RevenueStats {
    totalRevenue: number;
    helpersEarned: number;
    transactionCount: number;
  }
  
  export interface RevenueSummary {
    today: RevenueStats;
    past7Days: RevenueStats;
    past30Days: RevenueStats;
    thisMonth: RevenueStats;
    thisYear: RevenueStats;
  }
  
export interface taskStats{
  
    totalTasks: number,
    pending: number,
    assigned: number,
    in_progress: number,
    completed: number,
    dispute: number
  
}
export interface top_neighbors{
  neighborId:string,
  name: string,
  taskCount: number,
  earnings:number
}
export interface top_categories{
  subCategoryId:string,
  subCategory: string,
  taskCount: number,
  earnings:number
}