import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface FormData {
  name: string;
  ip: string;
  port: string;
  veaamUsername: string;
  veaamPassword: string;
}

function CompanyAdd() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    ip: "",
    port: "",
    veaamUsername: "",
    veaamPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));

    setMessage(""); // Clear the error message
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    // Check if any of the fields are empty
    if (
      formData.name === "" ||
      formData.ip === "" ||
      formData.port === "" ||
      formData.veaamUsername === "" ||
      formData.veaamPassword === ""
    ) {
      console.error("Error saving company: Empty field(s)");
      setMessage("Please fill in all fields.");
      return;
    }

    try {
      console.log("Submitting form data:", formData);
      setMessage("geslaagd.");
      setFormData({
        name: "",
        ip: "",
        port: "",
        veaamUsername: "",
        veaamPassword: "",
      });
      await saveCompany(formData);
      console.log("Company saved successfully");

      setMessage("Company saved successfully");
    } catch (error) {
      console.error("Error saving company:", error);
      setMessage("Error occurred while saving company.");
    }
  };

  const saveCompany = async (formData: FormData) => {
    try {
      const response = await axios.post(
        "http://localhost:3008/companies",
        formData
      );
      console.log("Company saved successfully");
      console.log("Response:", response.data);

      return response.data;
    } catch (error) {
      console.error("Error saving company:", error);
      throw error;
    }
  };
  // console.log("Rendering message:", message);

  return (
    <div className="p-3 bg-white rounded">
      {message && (
        <div
          className={`alert ${
            message.startsWith("Error") || message.startsWith("Please")
              ? "alert-danger"
              : "alert-success"
          } text-center`}
          role="alert"
        >
          {message}
        </div>
      )}

      <div className="border border-dark border-3">
        <div className="text-center py-3 position-relative d-flex align-items-center">
          <div className="flex-fill py-2 px-3 mx-1">
            <span className="fw-bold">Bedrijfsinformatie</span>
          </div>
        </div>
      </div>
      <div className="mt-2 border border-dark px-4 py-3 shadow-sm p-3  bg-white rounded">
        <form onSubmit={handleSubmit}>
          <div className="form-group my-1 ">
            <label>naam</label>
            <input
              className="form-control"
              type="text"
              name="name"
              placeholder="Enter name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group my-1 ">
            <label>ip</label>
            <input
              className="form-control"
              type="text"
              name="ip"
              placeholder="Enter IP"
              value={formData.ip}
              onChange={handleChange}
            />
          </div>
          <div className="form-group my-1 ">
            <label>port</label>
            <input
              className="form-control"
              type="text"
              name="port"
              placeholder="Enter port"
              value={formData.port}
              onChange={handleChange}
            />
          </div>
          <div className="form-group my-1 ">
            <label>VeaamUsername</label>
            <input
              className="form-control"
              type="text"
              name="veaamUsername"
              placeholder="Enter Veeam username"
              value={formData.veaamUsername}
              onChange={handleChange}
            />
          </div>
          <label>VeaamPassword</label>
          <div className="form-group my-1 ">
            <input
              className="form-control"
              type="text"
              name="veaamPassword"
              placeholder="Enter Veeam password"
              value={formData.veaamPassword}
              onChange={handleChange}
            />
          </div>
          <button type="submit" className="btn btn-primary ">
            Save
          </button>
        </form>
      </div>
    </div>
  );
}

export default CompanyAdd;
