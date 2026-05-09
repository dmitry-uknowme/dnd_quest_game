// import { Provider } from "react-redux";
// import { mainStore } from "../store/main-store";
import type { HTMLAttributes } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { Toaster } from "@/shared/ui/sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionContextProvider } from "@/shared/model/user/session/context";
import { AxiosError } from "axios";
import { PlayroomContextProvider } from "@/shared/model/playroom-context/playroom-context";

export const MainProvider: React.FC<HTMLAttributes<FragmentDirective>> = ({
  children,
}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // staleTime: 10 * 1000,
        // Отключаем перезапрос при фокусе
        refetchOnWindowFocus: false,
        // Включаем structural sharing — данные будут переиспользоваться
        structuralSharing: true,
        retry: (failureCount, error) => {
          if ((error as AxiosError)?.response?.status === 404) {
            return false; // не ретраим 404
          }
          if ((error as AxiosError)?.response?.status === 401) {
            return false; // не ретраим 401
          }

          if ((error as AxiosError)?.response?.status === 500) {
            return false; // не ретраим 500
          }
          return failureCount < 3; // иначе до 3 попыток
        },
      },
    },
  });

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <PlayroomContextProvider>
          {children}
          {/* <Toaster position={"top-right"} style={{ zIndex: 100 }} /> */}
          <ReactQueryDevtools initialIsOpen={false} />
        </PlayroomContextProvider>
      </QueryClientProvider>
    </>
  );
};
