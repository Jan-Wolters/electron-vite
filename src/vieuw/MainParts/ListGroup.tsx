import React, { useEffect, useState } from "react";
import { ListItem } from "../components/ListItem";
import { fetchData, Company } from "../../model/repositories.ts";

function ListGroup() {
  const [companies, setCompanies] = useState([] as Company[]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const fetchedCompanies = await fetchData();
        setCompanies(fetchedCompanies);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <div id="top" className="shadow-lg p-3 mb-5 bg-white rounded">
      <div id="List" className="d-fill">
        {companies.length === 0 ? (
          <p className="text-center">Niks gevonden</p>
        ) : (
          <div>
            <ul className="list-group">
              {companies.map((company) => (
                <ListItem
                  key={company.company_id}
                  company_id={company.company_id}
                  company_name={company.company_name}
                  repositories={company.repositories}
                  sessions={company.sessions}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListGroup;

/* const query = ` 
    SELECT
      companies.company_id AS company_id,
      companies.name AS company_name,
      GROUP_CONCAT(DISTINCT repositories.id) AS repository_ids,
      GROUP_CONCAT(DISTINCT repositories.name) AS repository_names,
      GROUP_CONCAT(DISTINCT repositories.capacityGB) AS repository_capacities,
      GROUP_CONCAT(DISTINCT repositories.freeGB) AS repository_frees,
      GROUP_CONCAT(DISTINCT repositories.usedSpaceGB) AS repository_usedSpaces,
      latest_session.session_name AS session_name,
      latest_session.session_endTime AS session_endTime,
      latest_session.session_resultResult AS session_resultResult,
      latest_session.session_resultMessage AS session_resultMessage
    FROM
      companies
    JOIN
      repositories ON companies.company_id = repositories.company_id
    LEFT JOIN (
      SELECT
        sessions.company_id,
        sessions.name AS session_name,
        sessions.endTime AS session_endTime,
        sessions.resultResult AS session_resultResult,
        sessions.resultMessage AS session_resultMessage
      FROM
        sessions
      INNER JOIN (
        SELECT
          company_id,
          MAX(endTime) AS max_endTime
        FROM
          sessions
        GROUP BY
          company_id
      ) AS latest ON sessions.company_id = latest.company_id AND sessions.endTime = latest.max_endTime
    ) AS latest_session ON companies.company_id = latest_session.company_id
    GROUP BY
      companies.company_id, companies.name, latest_session.session_name, latest_session.session_endTime, latest_session.session_resultResult, latest_session.session_resultMessage;`;
 */
