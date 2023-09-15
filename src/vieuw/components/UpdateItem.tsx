import React from "react";

interface CompanyListprop {
  company_id: number;
  company_name: string;
  company_ip: string;
  company_port: string;
  veaamUsername: string;
  veaamPassword: string;
  onDelete: () => void; // Callback for deleting
}

function UpItem({
  company_id,
  company_name,
  company_ip,
  company_port,
  veaamUsername,
  veaamPassword,
  onDelete,
}: CompanyListprop) {
  const handleDelete = () => {
    // Implement logic to delete the company from the database
    onDelete();
  };

  return (
    <div className="border border-dark p-2 mb-3 mx-3 rounded bg-light">
      <div className="row">
        <div className="col-lg-4 col-md-6">
          <div className="mb-2">
            <span className="text-muted">Company ID:</span> {company_id}
          </div>
          <div className="mb-2">
            <span className="text-muted">Company Name:</span> {company_name}
          </div>
          <div className="mb-2">
            <span className="text-muted">IP Address:</span> {company_ip}
          </div>
        </div>
        <div className="col-lg-4 col-md-6">
          <div className="mb-2">
            <span className="text-muted">Port:</span> {company_port}
          </div>
          <div className="mb-2">
            <span className="text-muted">Username:</span> {veaamUsername}
          </div>
          <div className="mb-2">
            <span className="text-muted">Password:</span> {veaamPassword}
          </div>
        </div>
        <div className="col-4 d-flex justify-content-end align-items-center">
          <button className="btn btn-danger" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export { UpItem };
