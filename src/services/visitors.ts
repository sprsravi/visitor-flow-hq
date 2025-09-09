import { supabase } from "@/integrations/supabase/client";
import { Visitor, VisitorFormData } from "@/types/visitor";

// Database row shape for public.visitors
interface VisitorRow {
  id: string;
  name: string;
  email: string | null;
  mobile: string | null;
  company: string | null;
  person_to_meet: string | null;
  department: string | null;
  purpose: string | null;
  check_in_time: string; // ISO string
  check_out_time: string | null; // ISO string
  status: "checked-in" | "checked-out";
  photo_url: string | null;
  badge_number: string | null;
  created_at: string;
  updated_at: string;
}

const mapRowToVisitor = (row: VisitorRow): Visitor => ({
  id: row.id,
  name: row.name,
  email: row.email ?? "",
  mobile: row.mobile ?? "",
  company: row.company ?? "",
  personToMeet: row.person_to_meet ?? "",
  department: row.department ?? "",
  purpose: row.purpose ?? "",
  checkInTime: new Date(row.check_in_time),
  checkOutTime: row.check_out_time ? new Date(row.check_out_time) : undefined,
  status: row.status,
  photo: row.photo_url ?? undefined,
  badgeNumber: row.badge_number ?? undefined,
});

export const fetchVisitors = async (): Promise<Visitor[]> => {
  const { data, error } = await supabase
    .from("visitors")
    .select("*")
    .order("check_in_time", { ascending: false });

  if (error) throw error;
  return (data as VisitorRow[]).map(mapRowToVisitor);
};

export const createVisitorRecord = async (form: VisitorFormData): Promise<Visitor> => {
  const payload = {
    name: form.name,
    email: form.email,
    mobile: form.mobile,
    company: form.company,
    person_to_meet: form.personToMeet,
    department: form.department,
    purpose: form.purpose,
    status: "checked-in" as const,
  };

  const { data, error } = await supabase
    .from("visitors")
    .insert(payload)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Failed to create visitor record");
  return mapRowToVisitor(data as VisitorRow);
};

export const checkOutVisitorRecord = async (id: string): Promise<Visitor> => {
  const { data, error } = await supabase
    .from("visitors")
    .update({
      check_out_time: new Date().toISOString(),
      status: "checked-out",
    })
    .eq("id", id)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Visitor not found or could not be updated");
  return mapRowToVisitor(data as VisitorRow);
};
