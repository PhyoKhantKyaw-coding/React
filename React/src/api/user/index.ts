import axios from "axios";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
export const GetAllUsers = {
  useQuery: (
    opt?: Partial<UseQueryOptions<User[], Error>>
  ) => {
    return useQuery<User[], Error>({
      queryKey: ["users"],
      queryFn: async (): Promise<User[]> => {
        const response = await axios.get<UserResponse>("User/GetAllUsers");
        return response.data.data;
      },
      ...opt,
    });
  }
};  
export const GetRoleByUId = {
    useQuery: (
        Id: string,
        opt?: Partial<UseQueryOptions<string, Error>>
    ) => {
        return useQuery<string, Error>({
        queryKey: ["userRole", Id],
        queryFn: async (): Promise<string> => {
            const response = await axios.get<{ data: string }>(
            `User/GetRoleByUserId?userId=${Id}`
            );
            return response.data.data;
        },
        ...opt,
        });
    }
};