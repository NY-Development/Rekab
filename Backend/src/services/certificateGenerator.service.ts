import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage } from 'pdf-lib';
import axios from 'axios';
import { uploadToCloudinary } from '../configs/cloudinary';

/** Top-based percentage position (0..1) of a text field's center. */
export interface FieldPos {
  x: number; // 0 = left, 1 = right (center anchor)
  y: number; // 0 = top, 1 = bottom
  size: number; // font size in points
}

export interface CertificateLayout {
  name: FieldPos;
  course: FieldPos;
  batch: FieldPos;
  color?: string; // hex, e.g. "#1e293b"
}

export const DEFAULT_LAYOUT: CertificateLayout = {
  name: { x: 0.5, y: 0.46, size: 34 },
  course: { x: 0.5, y: 0.62, size: 20 },
  batch: { x: 0.5, y: 0.70, size: 14 },
  color: '#1e293b',
};

interface CertificateFields {
  studentName: string;
  courseTitle: string;
  batch: string;
}

function hexToRgb(hex?: string) {
  const h = (hex || '#1e293b').replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
}

function drawCentered(page: PDFPage, font: PDFFont, text: string, pos: FieldPos, color: ReturnType<typeof rgb>) {
  const { width, height } = page.getSize();
  const textWidth = font.widthOfTextAtSize(text, pos.size);
  const x = width * pos.x - textWidth / 2;
  const y = height * (1 - pos.y) - pos.size / 2;
  page.drawText(text, { x, y, size: pos.size, font, color });
}

/**
 * Overlays the student name, course, and batch onto a certificate template
 * (image or PDF), returns the finished PDF as bytes. The template becomes the
 * full-page background.
 */
async function renderPdf(templateUrl: string, fields: CertificateFields, layout: CertificateLayout): Promise<Uint8Array> {
  const res = await axios.get<ArrayBuffer>(templateUrl, { responseType: 'arraybuffer' });
  const bytes = new Uint8Array(res.data);
  const contentType = String(res.headers['content-type'] || '');
  const isPdf = contentType.includes('pdf') || /\.pdf($|\?)/i.test(templateUrl);

  let doc: PDFDocument;
  let page: PDFPage;

  if (isPdf) {
    doc = await PDFDocument.load(bytes);
    page = doc.getPages()[0];
  } else {
    doc = await PDFDocument.create();
    let image;
    try {
      image = await doc.embedPng(bytes);
    } catch {
      image = await doc.embedJpg(bytes);
    }
    page = doc.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }

  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const bodyFont = await doc.embedFont(StandardFonts.Helvetica);
  const color = hexToRgb(layout.color);

  drawCentered(page, font, fields.studentName, layout.name, color);
  drawCentered(page, bodyFont, fields.courseTitle, layout.course, color);
  drawCentered(page, bodyFont, fields.batch, layout.batch, color);

  return doc.save();
}

/**
 * Generates a certificate PDF from a template and uploads it to Cloudinary,
 * returning the hosted URL.
 */
export async function generateCertificate(
  templateUrl: string,
  fields: CertificateFields,
  certificateNumber: string,
  layout: CertificateLayout = DEFAULT_LAYOUT
): Promise<string> {
  const pdfBytes = await renderPdf(templateUrl, fields, layout);
  const buffer = Buffer.from(pdfBytes);
  return uploadToCloudinary(buffer, 'nydl/certificates', `certificate_${certificateNumber}`);
}
