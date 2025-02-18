import Role from "@/models/Role";
import client from "./graphqlClient";
import { UPDATE_ROLE } from "@queries/roleQueries";

/**
 * Role update
 */
export const updateRole = async (updateData: Role): Promise<{ role: Role }> => {
  const variables = {
    ...updateData,
  };

  return await client.request(UPDATE_ROLE, variables);
};
