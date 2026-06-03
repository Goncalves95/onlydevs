import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  const { type, data } = body as {
    type: string;
    data: { order: { external_id: string; status: string } };
  };

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
        data: { status: "SHIPPED" },
      });
      break;
    default:
      break;
  }

  return new Response(null, { status: 200 });
}
