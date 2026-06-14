export interface Participant {
  firstName: string;
  lastName: string;
  documentId: string;
  phone: string;
  email: string;
}

export interface PrizeResult {
  id: string;
  label: string;
  isWinner: boolean;
  prizeName?: string;
}
