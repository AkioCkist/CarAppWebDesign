// app/api/auth/[...nextauth]/route.js
import { handlers } from "./../../../../../lib/auth"; //

// This is the correct way to export the handlers for the App Router
export const GET = handlers; //
export const POST = handlers; //

// If you need to handle other methods like PUT, DELETE, etc., you would do the same:
export const PUT = handlers;
export const DELETE = handlers;