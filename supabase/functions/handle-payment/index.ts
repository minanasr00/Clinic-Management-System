// handle-payment/index.ts (Updated)
import { serve } from "https://deno.land/std@0.215.0/http/server.ts";
import Stripe from "npm:stripe@13.3.0";
import { initializeApp, cert } from "npm:firebase-admin@11.11.0/app";
import { getFirestore } from "npm:firebase-admin@11.11.0/firestore";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2023-08-16"
});

// Initialize Firebase
const firebase = initializeApp({
  credential: cert({
    projectId: Deno.env.get("FIREBASE_PROJECT_ID"),
    clientEmail: Deno.env.get("FIREBASE_CLIENT_EMAIL"),
    privateKey: Deno.env.get("FIREBASE_PRIVATE_KEY")?.replace(/\\n/g, '\n'),
  })
});
const db = getFirestore(firebase);

serve(async (req) => {
  const signature = req.headers.get("stripe-signature")!;
  const body = await req.text();

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get("STRIPE_WEBHOOK_SECRET")!
    );

    // Handle successful payment
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Extract appointment ID from metadata
      const appointmentId = session.metadata?.appointment_id;
      
      if (!appointmentId) {
        return new Response("Missing appointment ID in metadata", { status: 400 });
      }

      // Update Firestore
      const appointmentRef = db.collection("appointments").doc(appointmentId);
      await appointmentRef.update({
        payment_status: "paid",
        paid_at: new Date(),
        stripe_payment_id: session.id
      });
      
      return new Response(`Payment recorded for appointment ${appointmentId}`, { status: 200 });
    }

    return new Response("Event not handled", { status: 200 });
  } catch (err) {
    const errorMessage = (err instanceof Error) ? err.message : String(err);
    return new Response(`Error: ${errorMessage}`, { status: 400 });
  }
});