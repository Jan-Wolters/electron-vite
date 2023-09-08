// Import necessary modules

const { createConnection } = await import("mysql2/promise");
import express, { json } from "express";
import { createPool } from "mysql2";
import cors from "cors";
import { exec } from "child_process"; // Import the 'child_process' module

const app = express();
const port = 3005;

app.use(cors());
app.use(json());

// Database configuration
const dbConfig = {
  host: "10.0.11.196",
  user: "root",
  password: "Test@10!",
  database: "new_schema",
  /* host: "localhost",
  user: "root",
  password: "", // <-- Add your MySQL password here
  database: "hallotest",*/
};

// Database manager
class DatabaseManager {
  pool;

  constructor(config) {
    this.pool = createPool(config);
    this.pool.getConnection((err, connection) => {
      if (err) {
        console.error("Error connecting to MySQL database:", err);
        return;
      }
      console.log("Connected to MySQL database!");
      connection.release();
    });
  }

  query(query, values = []) {
    return new Promise((resolve, reject) => {
      this.pool.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
}

const databaseManager = new DatabaseManager(dbConfig);

// Function Declarations
function runScript() {
  function onScriptExit(error, stdout, stderr) {
    if (error) {
      console.error(`Error executing script: ${error}`);
    }
    console.log(`Script output: ${stdout}`);
    console.error(`Script error: ${stderr}`);

    // Set the delay for the next run (6 seconds)
    const delayInMilliseconds = 5 * 60 * 1000; // 6000 milliseconds = 6 seconds

    // Call the runScript function again after the delay
    setTimeout(runScript, delayInMilliseconds);
  }

  exec(`node ${scriptPath}`, onScriptExit);
}

// Routes
app.get("/info", getInfo);

app.post("/companies", saveCompany);

async function getInfo(req, res) {
  try {
    const companyId = req.query.companyId;

    const companiesQuery = `
    SELECT
    companies.company_id AS company_id,
    companies.name AS company_name,
    GROUP_CONCAT(DISTINCT repositories.id) AS repository_ids,
    GROUP_CONCAT(DISTINCT repositories.name) AS repository_names,
    GROUP_CONCAT(repositories.capacityGB) AS repository_capacities,
    GROUP_CONCAT(repositories.freeGB) AS repository_frees,
    GROUP_CONCAT(repositories.usedSpaceGB) AS repository_usedSpaces,
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
  WHERE
  companies.company_id = companies.company_id -- Specify the company IDs here
  GROUP BY
    companies.company_id, companies.name, latest_session.session_name, latest_session.session_endTime, latest_session.session_resultResult, latest_session.session_resultMessage;`;

    const companiesRows = await databaseManager.query(companiesQuery, [
      companyId,
    ]);

    const repositoriesData = [];
    if (Array.isArray(companiesRows)) {
      for (const companiesRow of companiesRows) {
        const company_id = companiesRow.company_id;

        // Split the comma-separated values into arrays
        const repositoryIds = companiesRow.repository_ids.split(",");
        const repositoryNames = companiesRow.repository_names.split(",");
        const repositoryCapacities =
          companiesRow.repository_capacities.split(",");
        const repositoryFrees = companiesRow.repository_frees.split(",");
        const repositoryUsedSpaces =
          companiesRow.repository_usedSpaces.split(",");

        // Create an array of repositories
        const repositories = repositoryIds.map((_, index) => ({
          repository_id: repositoryIds[index],
          repository_name: repositoryNames[index],
          repository_capacityGB: parseFloat(repositoryCapacities[index]),
          repository_freeGB: parseFloat(repositoryFrees[index]),
          repository_usedSpaceGB: parseFloat(repositoryUsedSpaces[index]),
        }));

        // Create a session object
        const session = {
          session_id: companiesRow.session_id,
          session_name: companiesRow.session_name,
          session_endTime: companiesRow.session_endTime,
          session_resultResult: companiesRow.session_resultResult,
          session_resultMessage: companiesRow.session_resultMessage,
        };

        // Create a company object with repositories and sessions
        const company = {
          company_id: companiesRow.company_id,
          company_name: companiesRow.company_name,
          repositories: repositories,
          sessions: [session],
        };

        repositoriesData.push(company);
      }
    } else {
      console.error("Invalid response from the database. Expected an array.");
      console.error("Response:", companiesRows); // Log the response
      return res
        .status(500)
        .json({ error: "An error occurred while fetching data." });
    }

    res.json(repositoriesData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "An error occurred while fetching data." });
  }
}

function saveCompany(req, res) {
  const { name, ip, port, veaamUsername, veaamPassword } = req.body;

  // Save the form data to the database
  const query = `INSERT INTO companies (name, ip, port, veaamUsername, veaamPassword) VALUES (?, ?, ?, ?, ?)`;
  const values = [name, ip, port, veaamUsername, veaamPassword];

  databaseManager
    .query(query, values)
    .then((results) => {
      console.log("Company information saved successfully");
      res.json({ message: "Company information saved successfully" });
    })
    .catch((error) => {
      console.error("Error executing INSERT query:", error);
      res
        .status(500)
        .json({ error: "An error occurred while saving company information." });
    });
}

// Set script path and initial delay
const scriptPath = "src/controller/veaam/ApiCon.mjs"; // Replace with the actual path
const initialDelayInMilliseconds = 0.1 * 60 * 1000; // 6 seconds

console.log("Starting ApiCon.js...");

// Start the initial run
setTimeout(runScript, initialDelayInMilliseconds);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
