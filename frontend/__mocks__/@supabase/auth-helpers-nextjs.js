export const createClientComponentClient = () => ({
    from: () => ({
      insert: jest.fn().mockResolvedValue({ data: [], error: null }),
      select: jest.fn().mockResolvedValue({ data: [], error: null }),
    }),
  });
  