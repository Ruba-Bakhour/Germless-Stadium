// __mocks__/next/router.ts
export const useRouter = () => ({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: '/',
    query: {},
    asPath: '/',
  });
  