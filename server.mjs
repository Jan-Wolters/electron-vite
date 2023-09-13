import express from "express";
import { json } from "express";
import { createPool } from "mysql2";
import cors from "cors";
import { exec } from "child_process";

import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Construct the absolute path to the .env file using the current module's directory
const dotenvPath = path.resolve(__dirname, ".env");

// Load environment variables from the .env file
dotenv.config({ path: dotenvPath });

const app = express();
const port = 3008;
let scriptCount = 0;
app.use(cors());
app.use(json());

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
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

    // Increment the script count
    scriptCount++;
    console.log(`Script count: ${scriptCount}`);

    // Set the delay for the next run (1 minute)
    const delayInMilliseconds = parseInt(1 * 60 * 1000);

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
    c.company_id AS company_id,
    c.name AS company_name,
    GROUP_CONCAT(DISTINCT r.id) AS repository_ids,
    GROUP_CONCAT(DISTINCT r.name) AS repository_names,
    GROUP_CONCAT(r.capacityGB) AS repository_capacities,
    GROUP_CONCAT(r.freeGB) AS repository_frees,
    GROUP_CONCAT(r.usedSpaceGB) AS repository_usedSpaces,
    ls.session_name AS session_name,
    ls.session_endTime AS session_endTime,
    ls.session_resultResult AS session_resultResult,
    ls.session_resultMessage AS session_resultMessage
FROM
    companies c
JOIN
    repositories r ON c.company_id = r.company_id
LEFT JOIN (
    SELECT
        s.company_id,
        s.name AS session_name,
        s.endTime AS session_endTime,
        s.resultResult AS session_resultResult,
        s.resultMessage AS session_resultMessage
    FROM
        sessions s
    INNER JOIN (
        SELECT
            company_id,
            MAX(endTime) AS max_endTime
        FROM
            sessions
        GROUP BY
            company_id
    ) AS latest ON s.company_id = latest.company_id AND s.endTime = latest.max_endTime
) AS ls ON c.company_id = ls.company_id
WHERE
    c.company_id = c.company_id -- Specify the company IDs here
GROUP BY
    c.company_id, c.name, ls.session_name, ls.session_endTime, ls.session_resultResult, ls.session_resultMessage
ORDER BY
    CASE
        WHEN ls.session_resultResult = 'Failed' THEN 1
        WHEN ls.session_resultResult = 'Warning' THEN 2
        WHEN ls.session_resultResult = 'Success' THEN 3
        ELSE 4
    END;`;
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

// Set script path and start the initial run
const scriptPath = "src/controller/veaam/ApiCon.mjs"; // Replace with the actual path

console.log("Starting ApiCon.js...");

runScript(); // Start the initial run without any delay

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
