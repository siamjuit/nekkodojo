import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!webhookSecret) throw new Error("Please add webhook secret");

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_ts = headerPayload.get("svix-timestamp");
  const svix_sg = headerPayload.get("svix-signature");

  if (!svix_id || !svix_ts || !svix_sg) {
    return new Response("Error occured - No svix headers", {status: 400});
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

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

  const { id } = evt.data;
  const eventType = evt.type;

  //logs

  if (eventType === "user.created") {
    try {
      const { email_addresses, primary_email_address_id , username, image_url} = evt.data;
      const primaryEmail = email_addresses.find((email) => email.id === primary_email_address_id);

      if (!primaryEmail) return new Response("No primary email found", { status: 404 });

      const newUser = await prisma.user.create({
        data: {
          id: evt.data.id,
          email: primaryEmail.email_address,
          name: username,
          profileUrl: image_url,
        },
      });

      console.log("new user created", newUser);
    } catch (error) {
      console.error("Error creating user", error);
      return new Response("Error occured", { status: 500 });
    }
  }

  return new Response("Webhook received successfully!", { status: 200 });
}
