import { useQuery } from "@tanstack/react-query";
import { http } from "../../shared/api/http";

export type Student = {
  id: string;
  name: string;
  age: number;
  city: string;
  avatar: string;
  matchDuration: string;
};

export function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const { data } = await http.get<Student[]>("/students");
      return data;
    },
  });
}