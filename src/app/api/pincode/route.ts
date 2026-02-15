import { NextRequest, NextResponse } from 'next/server';
import { validatePincode } from '@/lib/validators';
import { lookupPincode } from '@/lib/pincode-lookup';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pincode = searchParams.get('pincode') ?? '';

  // Validate pincode format (6 digits)
  const validation = validatePincode(pincode);
  if (!validation.valid) {
    return NextResponse.json(
      { available: false, message: validation.errors.pincode },
      { status: 400 }
    );
  }

  // Look up pincode against delivery zones
  const result = lookupPincode(pincode);

  return NextResponse.json(result);
}
