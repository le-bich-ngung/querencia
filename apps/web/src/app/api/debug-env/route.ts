export async function GET() {
  const raw = process.env.API_SERVICE_URL ?? 'NOT_SET';
  return Response.json({
    raw,
    length: raw.length,
    charCodes: Array.from(raw).map(c => c.charCodeAt(0)),
  });
}
