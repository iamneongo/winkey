// Mock Server Auth calls for Clerk
export const auth = async () => {
  return {
    userId: "winkey-admin-id",
    orgId: "winkey-org-id",
  };
};
