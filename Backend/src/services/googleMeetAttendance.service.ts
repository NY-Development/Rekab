import { AppError } from '../middlewares/errorHandler';
import type { AttendanceImportRow } from '../modules/attendance/services/attendanceService';

/**
 * Google Workspace (Admin SDK Reports API) Meet-attendance integration.
 *
 * This is intentionally SCAFFOLDED and inert: it activates only when the
 * required service-account credentials are present in the environment. Until
 * then, instructors use the CSV/XLSX report upload path instead.
 *
 * To enable (requires a Google Workspace *Education/Enterprise* tenant):
 *   1. Create a Google Cloud project and enable the Admin SDK API.
 *   2. Create a service account with domain-wide delegation.
 *   3. Grant the OAuth scope:
 *        https://www.googleapis.com/auth/admin.reports.audit.readonly
 *   4. Set these env vars in backend/.env:
 *        GOOGLE_SA_EMAIL         = service account email
 *        GOOGLE_SA_PRIVATE_KEY   = service account private key (\n-escaped)
 *        GOOGLE_ADMIN_EMAIL      = a Workspace admin to impersonate
 *
 * Implementation notes (for when it's enabled): call the Reports API
 * `activities.list` for applicationName=meet, filter events `call_ended` /
 * `attendance_report`, aggregate `duration_seconds` per `actor.email`, and map
 * to AttendanceImportRow[] keyed by the 10-letter meeting code from the Meet URL.
 */
export function isGoogleMeetConfigured(): boolean {
  return !!(process.env.GOOGLE_SA_EMAIL && process.env.GOOGLE_SA_PRIVATE_KEY && process.env.GOOGLE_ADMIN_EMAIL);
}

export async function fetchMeetAttendance(_meetingCode: string): Promise<AttendanceImportRow[]> {
  if (!isGoogleMeetConfigured()) {
    throw new AppError(
      'Google Meet attendance sync is not configured. Upload the Google Meet attendance report (CSV/XLSX) instead.',
      501
    );
  }
  // Deliberately not implemented until a paid Workspace tenant is connected.
  throw new AppError('Google Meet attendance sync is scaffolded but not yet enabled on this deployment.', 501);
}
