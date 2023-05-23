import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "../lib/get-sessions";
import { NextApiRequest, NextApiResponse } from "next";
import { NextIncomingMessage } from "next/dist/server/request-meta";

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession(req, res);
  console.log(session.username);
}
