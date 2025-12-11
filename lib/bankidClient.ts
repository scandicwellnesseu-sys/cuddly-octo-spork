// Mocked BankID client

export const bankidClient = {
  startVerification: async (userId: string) => {
    // Simulate API call to BankID
    console.log(`Starting BankID verification for user ${userId}`);
    return {
      success: true,
      sessionId: `bid_${Math.random().toString(36).substring(7)}`,
      status: 'pending'
    };
  },

  pollVerification: async (sessionId: string) => {
    // Simulate polling result
    // Randomly approve or keep pending
    const random = Math.random();
    if (random > 0.7) {
      return { status: 'approved' };
    } else if (random > 0.9) {
      return { status: 'rejected' };
    }
    return { status: 'pending' };
  }
};
