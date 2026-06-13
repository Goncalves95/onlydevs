import { prisma } from "@/lib/prisma";
import { sendOrderShippedEmail, sendOrderDeliveredEmail } from "@/lib/email";

interface PrintfulWebhookBody {
  type: string;
  data: {
    order: {
      external_id: string;
      status: string;
      tracking_number?: string;
      tracking_url?: string;
      shipments?: Array<{ carrier?: string }>;
    };
  };
}

export async function POST(req: Request) {
  const body = (await req.json()) as PrintfulWebhookBody;
  const { type, data } = body;

  const externalOrderId = data?.order?.external_id;
  if (!externalOrderId) {
    return new Response("Missing order ID", { status: 400 });
  }

  switch (type) {
    case "order_fulfilled":
      await prisma.order.update({
        where: { id: externalOrderId },
        data: { status: "FULFILLED" },
      });
      break;

    case "order_shipped": {
      const shippedOrder = await prisma.order.update({
        where: { id: externalOrderId },
        data: {
          status: "SHIPPED",
          trackingNumber: data.order.tracking_number ?? null,
          trackingUrl: data.order.tracking_url ?? null,
        },
        include: {
          user: { select: { email: true } },
          items: { select: { productName: true, variantName: true, quantity: true } },
        },
      });
      if (shippedOrder.user?.email) {
        try {
          await sendOrderShippedEmail({
            to: shippedOrder.user.email,
            orderId: shippedOrder.id,
            items: shippedOrder.items,
            carrier: data.order.shipments?.[0]?.carrier ?? null,
            trackingNumber: data.order.tracking_number ?? null,
            trackingUrl: data.order.tracking_url ?? null,
          });
        } catch (err) {
          console.error("[webhook] order-shipped email failed:", err);
        }
      }
      break;
    }

    case "order_delivered": {
      const deliveredOrder = await prisma.order.update({
        where: { id: externalOrderId },
        data: { status: "DELIVERED" },
        include: {
          user: { select: { email: true } },
          items: { select: { productName: true, variantName: true, quantity: true } },
        },
      });
      if (deliveredOrder.user?.email) {
        try {
          await sendOrderDeliveredEmail({
            to: deliveredOrder.user.email,
            orderId: deliveredOrder.id,
            items: deliveredOrder.items,
          });
        } catch (err) {
          console.error("[webhook] order-delivered email failed:", err);
        }
      }
      break;
    }

    default:
      break;
  }

  return new Response(null, { status: 200 });
}
