import React, { useState, useEffect } from "react";
import {
  fetchDatacon,
  CompanyList,
  deleteCompany,
} from "../../model/repositories.ts";
import { UpItem } from "../components/UpdateItem.tsx";

function Company_update() {
  const [companies, setCompanies] = useState<CompanyList[] | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const fetchedCompanies = await fetchDatacon();
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
        {companies === null ? (
          <p className="text-center">Loading...</p>
        ) : (
          <div>
            <ul className="list-group">
              {companies.map((company) => (
                <UpItem
                  key={company.company_id}
                  company_id={company.company_id}
                  company_name={company.company_name}
                  company_ip={company.company_ip}
                  company_port={company.company_port}
                  veaamUsername={company.veaamUsername}
                  veaamPassword={company.veaamPassword}
                  onDelete={() => deleteCompany(company.company_id)} // Pass the delete function
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Company_update;
