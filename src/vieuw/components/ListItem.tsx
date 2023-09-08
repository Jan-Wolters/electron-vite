// ListItem.tsx
import { useState } from "react";
import StatusIcon from "./StatusIcon";

interface ListItemProps {
  company_id: number;
  company_name: string;
  repositories: {
    repository_id: number;
    repository_name: string;
    repository_description: string;
    repository_hostId: number;
    repository_hostName: string;
    repository_path: string;
    repository_capacityGB: number;
    repository_freeGB: number;
    repository_usedSpaceGB: number;
  }[];
  sessions: {
    session_id: string;
    session_name: string;
    session_endTime: string;
    session_resultResult: string;
    session_resultMessage: string;
  }[];
}

function ListItem({ company_name, repositories, sessions }: ListItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <li>
      <div
        className={`border border-dark text-center py-3 mt-2 position-relative d-flex align-items-center`}
        onClick={handleClick}
      >
        <span className="w-25 py-2 px-3 mx-1">{company_name}</span>
        <div className="flex-fill py-2 px-3 mx-1">
          <div className="flex-fill py-2 px-3 mx-1">
            {sessions && sessions.length > 0 && (
              <>
                {sessions.map((session, index) => (
                  <StatusIcon
                    key={index}
                    resultMessage={session.session_resultResult}
                  />
                ))}
              </>
            )}
          </div>
        </div>

        <div>
          {" "}
          {sessions && sessions.length > 0 && (
            <>
              {sessions.map((session) => (
                <div className="flex-fill py-2 mx-1">
                  {/* Format session end time */}
                  {new Date(session.session_endTime).toLocaleString()}
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mx-auto" style={{ maxWidth: "95%" }}>
          {sessions && sessions.length > 0 && (
            <div className="border border-dark mt-2 mx-auto">
              <div>
                <h1>Sessions</h1>
              </div>
              <ul
                className="list-group"
                style={{ overflowY: "auto", maxHeight: "750px" }}
              >
                {sessions.map((session) => (
                  <li
                    className={`text-center py-3 mt-2 position-relative d-flex align-items-center list-group-item`}
                    key={session.session_id}
                  >
                    <div className="d-flex flex-fill">
                      <span className="w-25 py-2 mx-1 fw-bold">
                        {session.session_name}
                      </span>
                      <div className="flex-fill py-2 mx-1">
                        <StatusIcon
                          resultMessage={session.session_resultResult}
                        />
                      </div>
                      <div
                        className="flex-fill py-2 mx-4 border border-danger"
                        style={{ maxWidth: "300px" }}
                      >
                        {session.session_resultMessage}
                      </div>
                      <div style={{ width: "300px" }}>
                        <div className="py-2 mx-1 ">
                          {/* Format session end time */}
                          {new Date(session.session_endTime).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {repositories && repositories.length > 0 && (
            <div className="border border-dark mt-2">
              <div>
                <h1>Repositories</h1>
              </div>
              <ul className="list-group">
                {repositories.map((repository) => (
                  <li
                    className={`text-center py-3 mt-2 position-relative d-flex align-items-center list-group-item`}
                    key={repository.repository_id}
                  >
                    <div className="d-flex flex-fill">
                      <span className="w-25 py-2 mx-1 fw-bold">
                        {repository.repository_name}
                      </span>
                      <div className="flex-fill py-2 mx-1">
                        <div className="progress">
                          {repository.repository_capacityGB > 0 ? (
                            <div
                              className={`progress-bar ${
                                repository.repository_usedSpaceGB /
                                  repository.repository_capacityGB >=
                                0.95
                                  ? "bg-danger"
                                  : repository.repository_usedSpaceGB /
                                      repository.repository_capacityGB >=
                                    0.75
                                  ? "bg-warning"
                                  : ""
                              }`}
                              role="progressbar"
                              aria-valuenow={repository.repository_usedSpaceGB}
                              aria-valuemin={0}
                              aria-valuemax={repository.repository_capacityGB}
                              style={{
                                width: `${
                                  (repository.repository_usedSpaceGB /
                                    repository.repository_capacityGB) *
                                  100
                                }%`,
                              }}
                            >
                              {(
                                (repository.repository_usedSpaceGB /
                                  repository.repository_capacityGB) *
                                100
                              ).toFixed(2)}
                              %
                            </div>
                          ) : (
                            <div
                              className="progress-bar bg-secondary"
                              role="progressbar"
                            >
                              N/A
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

export { ListItem };
