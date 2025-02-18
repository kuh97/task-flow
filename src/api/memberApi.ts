import client from "./graphqlClient";
import {
  CREATE_MEMBER,
  DELETE_MEMBER,
  UPDATE_MEMBER,
} from "@queries/memberQueries";
import Member from "@/models/Member";

/**
 * Member update api
 */
export const updateMember = async (
  memberId: string,
  updateData: Partial<Member>
): Promise<Member> => {
  const variables = {
    id: memberId,
    ...updateData,
  };

  return client.request(UPDATE_MEMBER, variables);
};

/**
 * Member create api
 */
export const createMember = async (
  newMember: Member
): Promise<{ createMember: Member }> => {
  try {
    const variables = {
      email: newMember.email,
      nickname: newMember.nickname,
      isActive: newMember.isActive,
    };

    return await client.request(CREATE_MEMBER, variables);
  } catch (err) {
    console.log("Failed to create member", err);
    throw new Error("Unable to create member. Please try again.");
  }
};

/**
 * Member delete api
 */
export const deleteMember = async (
  memberId: string
): Promise<{ deleteMember: Member }> => {
  const variables = { id: memberId };
  return client.request(DELETE_MEMBER, variables);
};
