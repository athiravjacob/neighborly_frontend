export interface TaskAcceptForm {
  estimatedHours: number;
  paymentAmount: number;
  extraCharges: number | null;
  arrivalTime: string;
  materialsCoverage:string;
  notes: string;
}
