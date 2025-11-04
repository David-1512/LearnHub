import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../../shared/api/http";

export type Student = {
  id: string;
  name: string;
  age: number;
  city: string;
  avatar: string;
  matchDuration: string;
  // opcionales si luego los agregas al json:
  email?: string;
  phone?: string;
  title?: string;
  bio?: string;
  interests?: string[];
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

/** Detalle de un estudiante */
export function useStudent(studentId: string) {
  return useQuery({
    queryKey: ["student", studentId],
    queryFn: async () => {
      const { data } = await http.get<Student>(`/students/${studentId}`);
      return data;
    },
  });
}

/** Retirar (eliminar de la lista de “mis estudiantes”) */
export function useRemoveStudent() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (studentId: string) => {
      await http.delete(`/students/${studentId}`);
      return studentId;
    },
    // Optimistic update
    onMutate: async (studentId) => {
      await qc.cancelQueries({ queryKey: ["students"] });
      const prev = qc.getQueryData<Student[]>(["students"]);
      if (prev) {
        qc.setQueryData<Student[]>(
          ["students"],
          prev.filter((s) => s.id !== studentId)
        );
      }
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(["students"], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

/* ---------- Actualizar perfil del estudiante ---------- */
export type StudentUpdatePayload = Partial<
  Pick<
    Student,
    "name" | "age" | "city" | "bio" | "avatar" | "email" | "phone" | "title" | "interests"
  >
> & { password?: string };

export function useUpdateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      studentId,
      payload,
    }: {
      studentId: string;
      payload: StudentUpdatePayload;
    }) => {
      const { data } = await http.patch(`/students/${studentId}`, payload);
      return data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["student", vars.studentId] });
      qc.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

/* ---------- Actualizar SOLO materias de interés ---------- */
export function useUpdateStudentInterests(studentId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (interests: string[]) => {
      const { data } = await http.patch(`/students/${studentId}`, { interests });
      return data;
    },
    onMutate: async (nextInterests) => {
      await qc.cancelQueries({ queryKey: ["student", studentId] });
      const previous = qc.getQueryData<Student>(["student", studentId]);
      if (previous) {
        qc.setQueryData<Student>(["student", studentId], {
          ...previous,
          interests: nextInterests,
        });
      }
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(["student", studentId], ctx.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["student", studentId] });
      qc.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export type Like = { id: number | string; tutorId: string; studentId?: string; createdAt?: string };

// ---------- NUEVO: lista de matches (estudiantes) para un tutor ----------
export type MyStudent = { likeId: number | string; student: Student; createdAt?: string };

export function useMyStudentsForTutor(tutorId: string) {
  const key = ["tutor-students", tutorId];
  return useQuery({
    queryKey: key,
    queryFn: async (): Promise<MyStudent[]> => {
      // 1) intentamos expandir con json-server
      try {
        const { data } = await http.get<(Like & { student: Student })[]>(
          `/likes?tutorId=${tutorId}&_expand=student`
        );
        return (data ?? [])
          .filter((l) => !!l.student) // ignora likes sin studentId
          .map((l) => ({ likeId: l.id, student: l.student, createdAt: l.createdAt }));
      } catch (e: any) {
        // 2) fallback (si no soporta _expand)
        if (e?.response?.status !== 404) throw e;
        const { data: likes } = await http.get<Like[]>(`/likes?tutorId=${tutorId}`);
        const ids = likes.filter((l) => l.studentId).map((l) => l.studentId).join("&id=");
        if (!ids) return [];
        const { data: students } = await http.get<Student[]>(`/students?id=${ids}`);
        return likes
          .map((l) => ({
            likeId: l.id,
            student: students.find((s) => s.id === l.studentId)!,
            createdAt: l.createdAt,
          }))
          .filter((x) => !!x.student);
      }
    },
  });
}

// ---------- NUEVO: retirar match (borra el like, NO borra al estudiante) ----------
export function useRemoveStudentMatch(tutorId: string) {
  const qc = useQueryClient();
  const key = ["tutor-students", tutorId];

  return useMutation({
    mutationFn: async (likeId: number | string) => {
      await http.delete(`/likes/${likeId}`);
      return likeId;
    },
    onMutate: async (likeId) => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<MyStudent[]>(key) ?? [];
      qc.setQueryData<MyStudent[]>(key, prev.filter((m) => m.likeId !== likeId));
      return { prev };
    },
    onError: (_e, _id, ctx) => { if (ctx?.prev) qc.setQueryData(key, ctx.prev); },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: ["likes", "all"] }); // refresca caches relacionadas
    },
  });
}