export interface Visitor {
  id: string;
  name: string;
  email: string;
  mobile: string;
  company: string;
  personToMeet: string;
  department: string;
  purpose: string;
  checkInTime: Date;
  checkOutTime?: Date;
  status: 'checked-in' | 'checked-out';
  photo?: string;
  badgeNumber?: string;
}

export interface VisitorFormData {
  name: string;
  email: string;
  mobile: string;
  company: string;
  personToMeet: string;
  department: string;
  purpose: string;
}