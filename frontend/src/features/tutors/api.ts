// src/features/tutors/api.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { http } from "../../shared/api/http";

/* =========================
 * Tipos
 * ========================= */
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
  email?: string;
  phone?: string;
};

export type Like = { id: number | string; tutorId: string; studentId?: string; createdAt?: string };
export type Pass = { id: number | string; tutorId: string; studentId?: string };

export type LikeExpanded = Like & { tutor: Tutor };   // json-server: /likes?_expand=tutor
export type MyTutor = { likeId: number | string; tutor: Tutor; createdAt?: string };

/* =========================
 * Lecturas básicas
 * ========================= */
export function useTutors() {
  return useQuery({
    queryKey: ["tutors"],
    queryFn: async () => {
      const { data } = await http.get<Tutor[]>("/tutors");
      return data;
    },
  });
}

export function useTutor(tutorId: string) {
  return useQuery({
    queryKey: ["tutor", tutorId],
    queryFn: async () => {
      const { data } = await http.get<Tutor>(`/users/${tutorId}`);
      return data;
    },
  });
}

/* =========================
 * Likes (por estudiante)
 * ========================= */
export function useLikes(studentId?: string) {
  const qs = studentId ? `?studentId=${studentId}` : "";
  return useQuery({
    queryKey: ["likes", studentId ?? "all"],
    queryFn: async () => {
      try {
        const { data } = await http.get<Like[]>(`/likes${qs}`);
        return data;
      } catch (e: any) {
        if (e?.response?.status === 404) return []; // tolerar colección ausente
        throw e;
      }
    },
  });
}

export function useLikedTutorIds(opts?: { studentId?: string }) {
  const { data } = useLikes(opts?.studentId);
  return new Set<string>((data ?? []).map((l) => l.tutorId));
}


/* =========================
 * Passes / Dislikes (por estudiante)
 * ========================= */
export function usePasses(studentId?: string) {
  const qs = studentId ? `?studentId=${studentId}` : "";
  return useQuery({
    queryKey: ["passes", studentId ?? "all"],
    queryFn: async () => {
      try {
        const { data } = await http.get<Pass[]>(`/passes${qs}`);
        return data;
      } catch (e: any) {
        if (e?.response?.status === 404) return []; // tolerar colección ausente
        throw e;
      }
    },
  });
}

export function usePassedTutorIds(opts?: { studentId?: string }) {
  const { data } = usePasses(opts?.studentId);
  return new Set<string>((data ?? []).map((p) => p.tutorId));
}

export function usePassTutor(studentId?: string) {
  const qc = useQueryClient();
  const passesKey = ["passes", studentId ?? "all"];

  return useMutation({
    mutationFn: async ({ tutorId }: { tutorId: string }) => {
      const q = `/passes?tutorId=${tutorId}${studentId ? `&studentId=${studentId}` : ""}`;
      const { data: existing } = await http.get<Pass[]>(q);
      if (existing.length > 0) return existing[0];

      const body: Partial<Pass> = { tutorId, ...(studentId ? { studentId } : {}) };
      const { data } = await http.post<Pass>("/passes", body);
      return data;
    },
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: passesKey });
      const prev = qc.getQueryData<Pass[]>(passesKey) ?? [];
      if (!prev.some((p) => p.tutorId === vars.tutorId)) {
        qc.setQueryData<Pass[]>(passesKey, [
          ...prev,
          { id: `optimistic-${Date.now()}`, tutorId: vars.tutorId, ...(studentId ? { studentId } : {}) },
        ]);
      }
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(passesKey, ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: passesKey });
    },
  });
}

/* =========================
 * Update perfil tutor (para otras pantallas)
 * ========================= */
export type TutorUpdatePayload = Partial<
  Pick<
    Tutor,
    "name" | "age" | "city" | "schedule" | "subjects" | "bio" | "avatar" | "email" | "phone"
  >
> & { password?: string };

export function useUpdateTutor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      tutorId,
      payload,
    }: {
      tutorId: string;
      payload: TutorUpdatePayload;
    }) => {
      const { data } = await http.patch(`/users/${tutorId}`, payload);
      return data;
    },
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["tutor", vars.tutorId] });
      qc.invalidateQueries({ queryKey: ["tutors"] });
    },
  });
}

export function useUpdateSubjects(tutorId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (subjects: string[]) => {
      const { data } = await http.patch(`/users/${tutorId}`, { subjects });
      return data;
    },
    onMutate: async (newSubjects) => {
      await qc.cancelQueries({ queryKey: ["tutor", tutorId] });
      const previous = qc.getQueryData<Tutor>(["tutor", tutorId]);
      if (previous) {
        qc.setQueryData<Tutor>(["tutor", tutorId], { ...previous, subjects: newSubjects });
      }
      return { previous };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.previous) qc.setQueryData(["tutor", tutorId], ctx.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["tutor", tutorId] });
      qc.invalidateQueries({ queryKey: ["tutors"] });
    },
  });
}

/* =========================
 * Mis tutores (likes del estudiante)
 * ========================= */
export function useMyTutors(studentId?: string) {
  const key = ["likes", studentId ?? "all", "expanded"];
  return useQuery({
    queryKey: key,
    queryFn: async (): Promise<MyTutor[]> => {
      // 1) intentar expand con json-server
      const qs = `${studentId ? `?studentId=${studentId}&` : "?"}_expand=tutor`;
      try {
        const { data } = await http.get<LikeExpanded[]>(`/likes${qs}`);
        return (data ?? [])
          .filter((l) => !!l.tutor)
          .map((l) => ({ likeId: l.id, tutor: l.tutor, createdAt: l.createdAt }));
      } catch (e: any) {
        // 2) fallback: likes + batch de tutores
        if (e?.response?.status !== 404) throw e;
        const qLikes = studentId ? `?studentId=${studentId}` : "";
        const { data: likes } = await http.get<Like[]>(`/likes${qLikes}`);
        if (!likes?.length) return [];
        const ids = likes.map((l) => l.tutorId).join("&id=");
        const { data: tutors } = await http.get<Tutor[]>(`/tutors?id=${ids}`);
        return likes
          .map((l) => ({
            likeId: l.id,
            tutor: tutors.find((t) => t.id === l.tutorId)!,
            createdAt: l.createdAt,
          }))
          .filter((x) => !!x.tutor);
      }
    },
  });
}

/** Borrar un like (retirar un tutor de Mis tutores) */
export function useRemoveLike(studentId?: string) {
  const qc = useQueryClient();
  const likesKey = ["likes", studentId ?? "all", "expanded"];
  return useMutation({
    mutationFn: async (likeId: number | string) => {
      await http.delete(`/likes/${likeId}`);
      return likeId;
    },
    onMutate: async (likeId) => {
      await qc.cancelQueries({ queryKey: likesKey });
      const prev = qc.getQueryData<MyTutor[]>(likesKey) ?? [];
      qc.setQueryData<MyTutor[]>(
        likesKey,
        prev.filter((m) => m.likeId !== likeId)
      );
      return { prev };
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(likesKey, ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: likesKey });
      qc.invalidateQueries({ queryKey: ["likes", studentId ?? "all"] }); // refresca set simple
    },
  });
}

export function useLikeTutor(studentId?: string) {
  const qc = useQueryClient();
  const likesKey = ["likes", studentId ?? "all"];

  return useMutation({
    mutationFn: async ({ tutorId }: { tutorId: string }) => {
      // evita duplicados por estudiante
      const q = `/likes?tutorId=${tutorId}${studentId ? `&studentId=${studentId}` : ""}`;
      const { data: existing } = await http.get<Like[]>(q);
      if (existing.length > 0) return existing[0];

      const body = {
        tutorId,
        ...(studentId ? { studentId } : {}),
        createdAt: new Date().toISOString(),
      };
      const { data } = await http.post<Like>("/likes", body);
      return data;
    },
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: likesKey });
      const prev = qc.getQueryData<Like[]>(likesKey) ?? [];
      if (!prev.some((l) => l.tutorId === vars.tutorId)) {
        qc.setQueryData<Like[]>(likesKey, [
          ...prev,
          {
            id: `optimistic-${Date.now()}`,
            tutorId: vars.tutorId,
            ...(studentId ? { studentId } : {}),
            createdAt: new Date().toISOString(),
          },
        ]);
      }
      return { prev };
    },
    onError: (_e, _v, ctx) => { if (ctx?.prev) qc.setQueryData(likesKey, ctx.prev); },
    onSettled: () => { qc.invalidateQueries({ queryKey: likesKey }); },
  });
}
