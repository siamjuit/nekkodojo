import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { RoleType } from "@/generated/prisma/enums";

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_UPDATING_SECRET;
  if (!webhookSecret) throw new Error("Please add webhook secret");

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_ts = headerPayload.get("svix-timestamp");
  const svix_sg = headerPayload.get("svix-signature");

  if (!svix_id || !svix_ts || !svix_sg) {
    return new Response("Error occured - No svix headers", { status: 400 });
  }

  const body = await req.text();

  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_ts,
      "svix-signature": svix_sg,
    }) as WebhookEvent;

    console.log(evt.data);
  } catch (error) {
    console.error("Error verifying webhook", error);
    return new Response("Error occured", { status: 500 });
  }

  const eventType = evt.type;
  if (eventType === "user.updated") {
    try {
      const {
        id,
        image_url,
        email_addresses,
        primary_email_address_id,
        username,
        first_name,
        last_name,
      } = evt.data;

      const primaryEmail = email_addresses.find((email) => email.id === primary_email_address_id);
      if (!primaryEmail) return new Response("No primary email found", { status: 404 });

      await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          email: primaryEmail.email_address,
          name: username,
          firstName: first_name,
          lastName: last_name,
          profileUrl: image_url,
        },
      });

      return new Response("User updated", { status: 200 });
    } catch (error) {
      console.error("Error updating user:", error);
      return new Response("Error updating user in DB", { status: 500 });
    }
  }
}
