import type { FC, PropsWithChildren } from "react";
import { useMatch, useNavigate } from "react-router-dom";

export const ContentLayout: FC<PropsWithChildren> = ({ children }) => {
  const isTimeline = useMatch({ path: "/", end: true });
  const isAuth = useMatch({ path: "auth/*", end: false });;
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-5 mr-5 ml-5">
      {(!isAuth && !isTimeline) && (
        <div>
          <button onClick={() => navigate(-1)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {children}
    </div>
  )
}

