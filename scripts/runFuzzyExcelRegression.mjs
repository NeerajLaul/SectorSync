import ExcelJS from "exceljs";
import { scoreMethodologies } from "../api/scoringEngine.js";

const EXCEL_PATH = "C:\\Users\\derie\\OneDrive\\Documents\\SP12 PM Approach Tests Revised.xlsx";
const OUTPUT_PATH = "C:\\Users\\derie\\OneDrive\\Documents\\SP12 PM Approach Tests Revised_scored.xlsx";

async function run() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(EXCEL_PATH);

  const sheet = workbook.getWorksheet("Method Combos Labeled");
  if (!sheet) {
    throw new Error("Sheet 'Method Combos Labeled' not found");
  }

  const HEADER_ROW_INDEX = 2;
  const DATA_START_ROW = 3;
  const headerRow = sheet.getRow(HEADER_ROW_INDEX);

  const factorColumns = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  function buildAnswersFromRow(row) {
    const answers = {};
    for (const col of factorColumns) {
      const key = headerRow.getCell(col).value;
      const value = row.getCell(col).value;
      if (key && value != null && value !== "") {
        answers[String(key)] = String(value);
      }
    }
    return answers;
  }

  let testsRun = 0;
  let testsPassed = 0;
  let testsFailed = 0;
  const failedCases = [];

  let emptyRowStreak = 0;
  const MAX_EMPTY_STREAK = 10;

  for (let rowIndex = DATA_START_ROW; rowIndex <= sheet.rowCount; rowIndex++) {
    const row = sheet.getRow(rowIndex);
    const label = row.getCell(1).value;      // Test name
    const expected = row.getCell(20).value;  // Expected Output (col T)

    const allFactorEmpty = factorColumns.every(
      (col) => !row.getCell(col).value
    );
    if (!label && !expected && allFactorEmpty) {
      emptyRowStreak++;
      if (emptyRowStreak >= MAX_EMPTY_STREAK) break;
      continue;
    } else {
      emptyRowStreak = 0;
    }

    const answers = buildAnswersFromRow(row);
    if (Object.keys(answers).length === 0) continue;

    const result = scoreMethodologies(answers);
    const ranking = result.ranking || [];

    let actual = null;
    if (ranking.length > 0) {
      actual = ranking[0].method;
      row.getCell(21).value = actual; // Actual Output (col U)
    }

    let status = null;
    if (expected && actual) {
      status = expected === actual ? "PASS" : "FAIL";
      status === "PASS" ? testsPassed++ : testsFailed++;

      if (status === "FAIL") {
        failedCases.push({
          rowIndex,
          label,
          expected,
          actual,
        });
        // Also log to console
        console.log(
          `[FAIL] Row ${rowIndex} | ${label} | expected: ${expected} | actual: ${actual}`
        );
      }
    }

    row.getCell(22).value = status; // Pass/Fail (col V)
    testsRun++;
  }

  // Create a new sheet with just the failures
  let failureSheet = workbook.getWorksheet("Regression_Failures");
  if (failureSheet) {
    workbook.removeWorksheet(failureSheet.id);
  }
  failureSheet = workbook.addWorksheet("Regression_Failures");

  failureSheet.addRow(["RowIndex", "Test Name", "Expected", "Actual"]);
  for (const f of failedCases) {
    failureSheet.addRow([f.rowIndex, f.label, f.expected, f.actual]);
  }

  await workbook.xlsx.writeFile(OUTPUT_PATH);

  console.log("--------------------------------------------------");
  console.log(`Tests run:   ${testsRun}`);
  console.log(`Tests passed: ${testsPassed}`);
  console.log(`Tests failed: ${testsFailed}`);
  console.log(`Updated file saved as: ${OUTPUT_PATH}`);
}

run().catch((err) => {
  console.error("Error running fuzzy Excel regression:", err);
  process.exit(1);
});
