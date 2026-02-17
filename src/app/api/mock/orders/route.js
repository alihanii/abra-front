/**
 * Mock order creation API
 * Accepts customer info + cart items and returns an order id.
 */

const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;

export async function POST(request) {
  try {
    const body = await request.json();

    const full_name = body?.full_name;
    const phone_number = body?.phone_number;
    const postal_code = body?.postal_code;
    const address = body?.address;
    const details = body?.details || "";
    const items = Array.isArray(body?.items) ? body.items : [];

    if (!isNonEmptyString(full_name)) {
      return Response.json({ message: "full_name is required" }, { status: 400 });
    }
    if (!isNonEmptyString(phone_number)) {
      return Response.json({ message: "phone_number is required" }, { status: 400 });
    }
    if (!isNonEmptyString(postal_code)) {
      return Response.json({ message: "postal_code is required" }, { status: 400 });
    }
    if (!isNonEmptyString(address)) {
      return Response.json({ message: "address is required" }, { status: 400 });
    }
    if (items.length === 0) {
      return Response.json({ message: "items is required" }, { status: 400 });
    }

    // Minimal validation for each item
    const normalizedItems = items.map((it) => ({
      id: String(it?.id || ""),
      color: String(it?.color || ""),
      size: String(it?.size || ""),
      quantity: Number(it?.quantity || 0)
    }));

    if (normalizedItems.some((it) => !it.id || !it.color || !it.size || it.quantity <= 0)) {
      return Response.json({ message: "Invalid items payload" }, { status: 400 });
    }

    // Simulate processing delay
    await new Promise((r) => setTimeout(r, 500));

    const order_id = `MOCK-${Date.now()}`;

    return Response.json(
      {
        order_id,
        message: "Order created",
        customer: {
          full_name,
          phone_number,
          postal_code,
          address,
          details
        },
        items: normalizedItems,
        pricing: body?.pricing || null
      },
      { status: 201 }
    );
  } catch {
    return Response.json({ message: "Invalid request" }, { status: 400 });
  }
}


