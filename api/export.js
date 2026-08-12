import { handleExportSources } from "./_lib/exportSources.js";
import { handleExportQuestions } from "./_lib/exportQuestions.js";
import { handleExportUsers } from "./_lib/exportUsers.js";
import { handleExportReports } from "./_lib/exportReports.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const exportType = req.query.type || req.body?.type || "users";

  switch (exportType) {
    case "sources":
      return handleExportSources(req, res);
    case "questions":
      return handleExportQuestions(req, res);
    case "reports":
      return handleExportReports(req, res);
    case "users":
    default:
      return handleExportUsers(req, res);
  }
}
