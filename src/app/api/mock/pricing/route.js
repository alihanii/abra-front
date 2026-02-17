/**
 * Mock pricing API
 * Calculates pricing summary from cart items.
 */

export async function POST(request) {
  try {
    const body = await request.json();
    const items = Array.isArray(body?.items) ? body.items : [];

    if (items.length === 0) {
      return Response.json(
        {
          discount_amount: 0,
          subtotal_without_discount: 0,
          products_total_after_discount: 0,
          shipping_cost: 0,
          grand_total: 0
        },
        { status: 200 }
      );
    }

    const subtotal = items.reduce((sum, item) => {
      const qty = Number(item.quantity || 0);
      const unit = Number(item.unit_price || 0);
      return sum + Math.max(0, qty) * Math.max(0, unit);
    }, 0);

    // Mock discount: 10% capped at $25
    const discount = Math.min(subtotal * 0.1, 25);
    const afterDiscount = Math.max(0, subtotal - discount);

    // Mock shipping: free above $100, else $5
    const shipping = afterDiscount >= 100 ? 0 : 5;
    const grandTotal = afterDiscount + shipping;

    return Response.json(
      {
        discount_amount: Number(discount.toFixed(2)),
        subtotal_without_discount: Number(subtotal.toFixed(2)),
        products_total_after_discount: Number(afterDiscount.toFixed(2)),
        shipping_cost: Number(shipping.toFixed(2)),
        grand_total: Number(grandTotal.toFixed(2))
      },
      { status: 200 }
    );
  } catch {
    return Response.json({ message: "Invalid request" }, { status: 400 });
  }
}


