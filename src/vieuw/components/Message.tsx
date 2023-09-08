import React from "react";

interface StatusMessageProps {
  sessions: Company[];
}

interface Company {
  session_id: number;
  session_name: string;
  session_endTime: string;
  session_resultResult: string;
  session_resultMessage: string;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ sessions }) => {
  const warningSessions = sessions.filter((session) =>
    session.session_resultResult.includes("Warning")
  );
  const failedSessions = sessions.filter((session) =>
    session.session_resultResult.includes("Failed")
  );

  const successSessions = sessions.filter(
    (session) =>
      !session.session_resultResult.includes("Warning") &&
      !session.session_resultResult.includes("Failed")
  );

  const getGroupedMessage = (groupSessions: Company[]) => {
    return groupSessions.map((session) => (
      <div key={session.session_id}>
        <p>
          <div className="">
            <span className="w-25 py-2 mx-1 fw-bold">
              {session.session_name}
            </span>
            <span className="flex-fill py-2 mx-1">
              {session.session_resultMessage}
            </span>
            <span className="flex-fill py-2 mx-1">
              {session.session_endTime}
            </span>
          </div>
        </p>
      </div>
    ));
  };

  return (
    <div>
      {failedSessions.length > 0 && (
        <div className="bg-danger border border-dark">
          <div>
            <span className="text-center">
              <h3>Failed Messages:</h3>
            </span>
            {getGroupedMessage(failedSessions)}
          </div>
        </div>
      )}

      {warningSessions.length > 0 && (
        <div className="bg-warning border border-dark">
          <div>
            <span className="text-center">
              <h3>Warning Messages:</h3>
            </span>
            {getGroupedMessage(warningSessions)}
          </div>
        </div>
      )}

      {failedSessions.length === 0 &&
        warningSessions.length === 0 &&
        successSessions.length > 0 && (
          <div className="bg-success border border-dark">
            <div className="text-center">
              <span className="text-center">
                <h3>Success Messages:</h3>
              </span>
              {getGroupedMessage(successSessions)}
            </div>
          </div>
        )}
    </div>
  );
};

export default StatusMessage;
