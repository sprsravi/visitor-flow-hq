import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createVisitorRecord, fetchVisitors, checkOutVisitorRecord } from "@/services/visitors";
import type { Visitor, VisitorFormData } from "@/types/visitor";

export const VISITORS_QUERY_KEY = ["visitors"] as const;

export function useVisitors() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery<Visitor[]>({
    queryKey: VISITORS_QUERY_KEY,
    queryFn: fetchVisitors,
  });

  const createMutation = useMutation({
    mutationFn: (form: VisitorFormData) => createVisitorRecord(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISITORS_QUERY_KEY });
    },
  });

  const checkoutMutation = useMutation({
    mutationFn: (id: string) => checkOutVisitorRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VISITORS_QUERY_KEY });
    },
  });

  return {
    visitors: data ?? [],
    isLoading,
    isError,
    error,
    createVisitor: (form: VisitorFormData) => createMutation.mutateAsync(form),
    checkOutVisitor: (id: string) => checkoutMutation.mutateAsync(id),
  };
}
