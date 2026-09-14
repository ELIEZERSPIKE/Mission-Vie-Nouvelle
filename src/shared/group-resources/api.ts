import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosClient from '../../api/axiosClient';
import type {
  CreateGroupResourcePayload,
  GroupResource,
  GroupResourcePage,
  UpdateGroupResourcePayload,
} from './types';

const BASE = '/academic-years';

export function groupResourcesKey(academicYearId: string) {
  return ['group-resources', academicYearId] as const;
}

async function fetchGroupResources(academicYearId: string): Promise<GroupResourcePage> {
  const { data } = await axiosClient.get(`${BASE}/${academicYearId}/group-resources`);
  return data;
}

export function useGroupResources(academicYearId: string) {
  return useQuery({
    queryKey: groupResourcesKey(academicYearId),
    queryFn: () => fetchGroupResources(academicYearId),
    enabled: !!academicYearId,
  });
}

async function createGroupResource(
  academicYearId: string,
  payload: CreateGroupResourcePayload
): Promise<GroupResource> {
  if (payload.type === 'FILE') {
    const formData = new FormData();
    formData.append('type', 'FILE');
    formData.append('title', payload.title);
    if (payload.description) formData.append('description', payload.description);
    formData.append('file', payload.file);

    const { data } = await axiosClient.post(`${BASE}/${academicYearId}/group-resources`, formData);
    return data;
  }

  const { data } = await axiosClient.post(`${BASE}/${academicYearId}/group-resources`, {
    type: 'LINK',
    title: payload.title,
    description: payload.description,
    external_url: payload.external_url,
  });
  return data;
}

export function useCreateGroupResource(academicYearId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateGroupResourcePayload) => createGroupResource(academicYearId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupResourcesKey(academicYearId) });
    },
  });
}

async function updateGroupResource(
  id: string,
  payload: UpdateGroupResourcePayload
): Promise<GroupResource> {
  // Un fichier est fourni : on passe en multipart avec override _method=PATCH
  // (PHP ne parse pas le form-data sur PATCH/PUT nativement).
  if (payload.file) {
    const formData = new FormData();
    formData.append('_method', 'PATCH');
    if (payload.title !== undefined) formData.append('title', payload.title);
    if (payload.description !== undefined) formData.append('description', payload.description ?? '');
    formData.append('file', payload.file);

    const { data } = await axiosClient.post(`/group-resources/${id}`, formData);
    return data;
  }

  // Pas de fichier (titre/description/external_url uniquement) : PATCH JSON classique.
  const { data } = await axiosClient.patch(`/group-resources/${id}`, {
    title: payload.title,
    description: payload.description,
    external_url: payload.external_url,
  });
  return data;
}

export function useUpdateGroupResource(academicYearId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateGroupResourcePayload }) =>
      updateGroupResource(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupResourcesKey(academicYearId) });
    },
  });
}

async function deleteGroupResource(id: string): Promise<void> {
  await axiosClient.delete(`/group-resources/${id}`);
}

export function useDeleteGroupResource(academicYearId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteGroupResource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupResourcesKey(academicYearId) });
    },
  });
}

export async function downloadGroupResource(resource: GroupResource): Promise<void> {
  const response = await axiosClient.get(`/group-resources/${resource.id}/download`, {
    responseType: 'blob',
  });

  const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = resource.original_filename ?? resource.title;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(blobUrl);
}

export async function resolveGroupResourceLink(id: string): Promise<string> {
  const { data } = await axiosClient.get(`/group-resources/${id}/link`);
  return data.url;
}