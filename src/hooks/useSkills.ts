// src/hooks/useSkills.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { skillsDTO } from "../types/skillsDTO";
import { AddSkills, FetchSkills } from "../api/neighborApiRequests";

export const useSkills = (userId: string | undefined) => {
  const queryClient = useQueryClient();

  const { data: skills = [], isLoading, error } = useQuery<skillsDTO[], Error>({
    queryKey: ["skills", userId],
    queryFn: () => FetchSkills(userId!),
    enabled: !!userId,
    placeholderData: [],
  });

  const addSkillMutation = useMutation<skillsDTO[], Error, skillsDTO>({
    mutationFn: (skill: skillsDTO) => AddSkills(userId!, skill),
    onSuccess: (newSkills) => {
      queryClient.setQueryData<skillsDTO[]>(["skills", userId], (old) => {
        return old ? [...old, ...newSkills] : newSkills;
      });
    },
    onError: (err) => {
      console.error("Error adding skill:", err);
    },
  });

  return {
    skills,
    isLoading,
    error,
    addSkill: (skill: skillsDTO) => addSkillMutation.mutate(skill),
  };
};