import * as fs from 'fs';
import * as path from 'path';
import xlsx from 'xlsx';

export interface FiberTestCase {
  TestCaseId: string;
  Scenario: string;
  TestAddress: string;
  Unit: string;
  SelectedSpeed: string;
  ExpectedPrice: string;
  MobileNo: string;
  Email: string;
  FirstName: string;
  LastName: string;
  CreditCardNumber: string;
  CVV: string;
  StorefrontUrl: string;
  SalesforceUrl: string;
  MailinatorUrl: string;
  SalesforceUsername: string;
  SalesforcePassword: string;
  OTPSecret: string;
}

function normalizeValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return value.trim();
  }

  return String(value).trim();
}

function resolveExcelFilePath(): string | null {
  const candidatePaths = [
    path.join(process.cwd(), 'src', 'data', 'fiber-test-data.xlsx'),
    path.join(process.cwd(), 'data', 'fiber-test-data.xlsx'),
    path.join(process.cwd(), 'fiber-test-data.xlsx'),
  ];

  return candidatePaths.find((candidate) => fs.existsSync(candidate)) ?? null;
}

export function getFiberTestCases(): FiberTestCase[] {
  const excelFilePath = resolveExcelFilePath();

  if (!excelFilePath) {
    throw new Error(
      'Excel test data file not found. Expected at: src/data/fiber-test-data.xlsx. '
      + 'Please create the Excel file with test scenarios.'
    );
  }

  const workbook = typeof xlsx.readFile === 'function'
    ? xlsx.readFile(excelFilePath)
    : (xlsx as typeof xlsx & { read?: (filePath: string) => unknown }).read?.(excelFilePath);

  if (!workbook) {
    throw new Error(`Failed to read Excel workbook at: ${excelFilePath}`);
  }

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(worksheet, { defval: '' }) as Array<Record<string, unknown>>;

  if (!rows.length) {
    throw new Error(
      `Excel workbook ${excelFilePath} contains no test data rows. `
      + `Please add test scenarios to the spreadsheet.`
    );
  }

  return rows.map((row, index) => ({
    TestCaseId: normalizeValue(row.TestCaseId || row.testCaseId || row.id || row.Id || `TC-${index + 1}`),
    Scenario: normalizeValue(row.Scenario || row.scenario || `scenario-${index + 1}`),
    TestAddress: normalizeValue(row.TestAddress || row.testAddress || row.address || ''),
    Unit: normalizeValue(row.Unit || row.unit || ''),
    SelectedSpeed: normalizeValue(row.SelectedSpeed || row.selectedSpeed || row.speed || ''),
    ExpectedPrice: normalizeValue(row.ExpectedPrice || row.expectedPrice || row.price || ''),
    MobileNo: normalizeValue(row.MobileNo || row.mobile || row.Mobile || ''),
    Email: normalizeValue(row.Email || row.email || ''),
    FirstName: normalizeValue(row.FirstName || row.firstName || ''),
    LastName: normalizeValue(row.LastName || row.lastName || ''),
    CreditCardNumber: normalizeValue(row.CreditCardNumber || row.creditCardNumber || ''),
    CVV: normalizeValue(row.CVV || row.cvv || ''),
    StorefrontUrl: normalizeValue(row.StorefrontUrl || row.storefrontUrl || ''),
    SalesforceUrl: normalizeValue(row.SalesforceUrl || row.salesforceUrl || ''),
    MailinatorUrl: normalizeValue(row.MailinatorUrl || row.mailinatorUrl || ''),
    SalesforceUsername: normalizeValue(row.SalesforceUsername || row.salesforceUsername || row.SalesforceUserName || ''),
    SalesforcePassword: normalizeValue(row.SalesforcePassword || row.salesforcePassword || ''),
    OTPSecret: normalizeValue(row.OTPSecret || row.otpSecret || ''),
  }));
}

export function getFiberTestCaseByScenario(scenario: string): FiberTestCase | undefined {
  return getFiberTestCases().find((candidate) => candidate.Scenario.toLowerCase() === scenario.toLowerCase());
}

export function getFiberTestCaseById(testCaseId: string): FiberTestCase | undefined {
  return getFiberTestCases().find((candidate) => candidate.TestCaseId.toLowerCase() === testCaseId.toLowerCase());
}
