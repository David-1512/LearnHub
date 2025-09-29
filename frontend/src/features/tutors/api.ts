import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { http } from "../../shared/api/http";

export type Tutor = {
  id: string;
  name: string;
  age: number;
  rating: number;
  city: string;
  schedule: string;
  subjects: string[];
  bio: string;
  avatar: string;
};

export function useTutors() {
  return useQuery({
    queryKey: ["tutors"],
    queryFn: async () => {
      const { data } = await http.get<Tutor[]>("/tutors");
      return data;
    },
  });
}

export function useLikeTutor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { tutorId: string }) => {
      const { data } = await http.post("/likes", payload);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tutors"] }),
  });
}