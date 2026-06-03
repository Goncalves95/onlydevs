import { prisma } from "@/lib/prisma";

interface PrintfulWebhookBody {
  type: string;
  data: {
    order: {
      external_id: string;
      status: string;
      tracking_number?: string;
      tracking_url?: string;
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

    case "order_shipped":
      await prisma.order.update({
        where: { id: externalOrderId },
        data: {
          status: "SHIPPED",
          trackingNumber: data.order.tracking_number ?? null,
          trackingUrl: data.order.tracking_url ?? null,
        },
      });
      break;

    case "order_delivered":
      await prisma.order.update({
        where: { id: externalOrderId },
        data: { status: "DELIVERED" },
      });
      break;

    default:
      break;
  }

  return new Response(null, { status: 200 });
}
