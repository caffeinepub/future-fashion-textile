import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ProjectCategory } from "../backend.d";
import type { ContactMessage, Project } from "../backend.d";
import { useActor } from "./useActor";

export function useListProjects(category: ProjectCategory | null = null) {
  const { actor, isFetching } = useActor();
  return useQuery<Project[]>({
    queryKey: ["projects", category],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProjects(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProject(projectId: bigint | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Project | null>({
    queryKey: ["project", projectId?.toString()],
    queryFn: async () => {
      if (!actor || projectId === null) return null;
      return actor.getProject(projectId);
    },
    enabled: !!actor && !isFetching && projectId !== null,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllContacts() {
  const { actor, isFetching } = useActor();
  return useQuery<ContactMessage[]>({
    queryKey: ["contacts"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllContacts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      title,
      description,
      category,
      imageUrl,
    }: {
      title: string;
      description: string;
      category: ProjectCategory;
      imageUrl: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createProject(title, description, category, imageUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useUpdateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      projectId,
      title,
      description,
      category,
      imageUrl,
    }: {
      projectId: bigint;
      title: string;
      description: string;
      category: ProjectCategory;
      imageUrl: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateProject(
        projectId,
        title,
        description,
        category,
        imageUrl,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useDeleteProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (projectId: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteProject(projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
}

export function useSubmitContact() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      name,
      email,
      message,
    }: {
      name: string;
      email: string;
      message: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitContact(name, email, message);
    },
  });
}
