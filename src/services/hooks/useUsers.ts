import { useQuery, UseQueryOptions } from "react-query";

import { api } from "../api";
import { User } from "../mirage";

export type MappedUser = User & {
  createdAt: string;
};

type IUseUsersResponse = {
  users: MappedUser[];
  totalCount: number;
};

export async function getUsers(page: number) {
  const { data, headers } = await api.get("/users", {
    params: {
      page,
    },
  });

  const totalCount = Number(headers["x-total-count"]);

  const users = data.users.map((user) => ({
    ...user,
    createdAt: new Date(user.created_at).toLocaleDateString("pt-br", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  }));

  return {
    users,
    totalCount,
  };
}

export function useUsers(page: number, options: UseQueryOptions) {
  return useQuery<IUseUsersResponse>(["users", page], () => getUsers(page), {
    // @ts-ignore
    staleTime: 1000 * 60 * 10, // durante 10 minutos não vai precisar ser revalidada (refeito um fetch)
    // @ts-ignore
    ...options,
  });
}
