export interface Repository {
  repository_id: number;
  repository_name: string;
  repository_description: string;
  repository_hostId: number;
  repository_hostName: string;
  repository_path: string;
  repository_capacityGB: number;
  repository_freeGB: number;
  repository_usedSpaceGB: number;
}

export interface Session {
  session_id: string;
  session_name: string;
  session_endTime: string;
  session_resultResult: string;
  session_resultMessage: string;
}

export interface Company {
  company_id: number;
  company_name: string;
  repositories: Repository[];
  sessions: Session[];
}


const fetchEndpoint = async (endpoint: string) => {
  try {
    const response = await fetch(endpoint);

    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }

    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

const fetchAndMapData = async <T>(endpoint: string): Promise<T[]> => {
  const data = await fetchEndpoint(endpoint);
  return data.map((item: T) => item);
};

export const fetchData = async (): Promise<Company[]> => {
  try {
    const endpoint = `http://localhost:3005/info`;
    const companyData = await fetchAndMapData<Company>(endpoint);
    return companyData;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};



export const saveCompany = async (
  companyData: Partial<Company>
): Promise<Response> => {
  try {
    const response = await fetch("http://localhost:3005/companies", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(companyData),
    });

    if (!response.ok) {
      throw new Error("Failed to save company");
    }

    console.log("Company saved successfully");
    return response;
  } catch (error) {
    console.error("Error saving company:", error);
    throw error;
  }
};