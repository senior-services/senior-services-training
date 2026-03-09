import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const PORTAL_URL = "https://training.southsoundseniors.org";
const LOGO_URL = `${PORTAL_URL}/lovable-uploads/SS_logo.png`;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};


Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // --- Auth: validate JWT and admin role ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } =
      await supabase.auth.getClaims(token);

    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;

    // Check admin role
    const { data: isAdmin } = await supabase.rpc("has_role", {
      _user_id: userId,
      _role: "admin",
    });

    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // --- Parse body ---
    const body = await req.json();
    const { employee_email, employee_name, app_url } = body;
    const type = body.type || "training_assignment";

    let subjectLine: string;
    let html: string;

    if (type === "admin_status_change") {
      // --- Admin status change notification ---
      const granted: boolean = body.granted;

      if (!employee_email) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const displayName = employee_name || employee_email;
      const loginUrl = `${PORTAL_URL}/auth`;
      const contentText = granted
        ? "You have been granted Administrative Privileges for the Senior Services Training Portal."
        : "Your Administrative Privileges for the Senior Services Training Portal have been removed.";
      const buttonText = granted ? "Access Admin Dashboard" : "Go to Training Portal";
      subjectLine = granted ? "Administrative Privileges Granted" : "Administrative Privileges Removed";

      html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #cbd5e1;border-radius:8px;overflow:hidden;">
        <tr><td style="padding:20px 28px 14px;">
          <img src="${LOGO_URL}" alt="Senior Services for South Sound" height="40" style="display:block;" />
        </td></tr>
        <tr><td style="padding:32px 28px 28px;">
          <p style="font-size:20px;font-weight:600;color:#0f172a;margin:0 0 16px;">Hello, ${displayName}.</p>
          <p style="font-size:15px;color:#0f172a;line-height:1.7;margin:0 0 10px;">
            ${contentText}
          </p>
          <div style="height:24px;"></div>
          <a href="${loginUrl}" style="display:inline-block;background:#2563a8;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 22px;border-radius:6px;">
            ${buttonText}
          </a>
        </td></tr>
        <tr><td style="border-top:1px solid #cbd5e1;background:#f8fafc;padding:16px 28px;">
          <p style="font-size:12px;color:#6b7280;line-height:1.7;margin:0;">
            Automated message from the <a href="${loginUrl}" style="color:#2563a8;text-decoration:none;">Senior Services Training Portal</a>. You're receiving this because your admin privileges were updated.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    } else {
      // --- Training assignment notification (existing flow) ---
      const { training_title, training_titles, due_date } = body;
      const titles: string[] = training_titles || (training_title ? [training_title] : []);

      if (!employee_email || titles.length === 0) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const loginUrl = `${PORTAL_URL}/auth`;
      const displayName = employee_name || employee_email;
      const dueDateDisplay = due_date || "No due date set";
      subjectLine = titles.length === 1
        ? `New Training Assigned: ${titles[0]}`
        : `${titles.length} New Trainings Assigned`;

      const introText = titles.length === 1
        ? "You have been assigned a new training. Please complete it by the due date."
        : `You have been assigned ${titles.length} new trainings. Please complete them by the due date.`;

      const titlesHtml = titles.length === 1
        ? `<p style="font-size:15px;color:#0f172a;margin:0;">${titles[0]}</p>`
        : `<table cellpadding="0" cellspacing="0" style="margin:0 0 16px;">${titles.map(t =>
            `<tr><td style="width:14px;padding:4px 0;vertical-align:top;"><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#2563a8;margin-top:5px;"></span></td><td style="font-size:15px;font-weight:600;color:#0f172a;padding:4px 0;line-height:1.4;">${t}</td></tr>`
          ).join("")}</table>`;

      html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid #cbd5e1;border-radius:8px;overflow:hidden;">
        <tr><td style="padding:20px 28px 14px;">
          <img src="${LOGO_URL}" alt="Senior Services for South Sound" height="40" style="display:block;" />
        </td></tr>
        <tr><td style="padding:32px 28px 28px;">
          <p style="font-size:20px;font-weight:600;color:#0f172a;margin:0 0 16px;">Hello, ${displayName}.</p>
          <p style="font-size:15px;color:#0f172a;line-height:1.7;margin:0 0 10px;">
            ${introText}
          </p>
          <div style="height:24px;"></div>
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:6px;margin:0 0 24px;">
            <tr><td style="padding:18px 20px;">
              <p style="font-size:11px;font-weight:600;color:#64748b;letter-spacing:0.06em;text-transform:uppercase;margin:0 0 10px;">Assigned Training</p>
              ${titlesHtml}
              <div style="height:1px;background:#cbd5e1;margin:14px 0;"></div>
              <p style="font-size:11px;font-weight:600;color:#64748b;letter-spacing:0.06em;text-transform:uppercase;margin:0 0 8px;">Due Date</p>
              <p style="font-size:15px;color:#0f172a;margin:0;">${dueDateDisplay}</p>
            </td></tr>
          </table>
          <a href="${loginUrl}" style="display:inline-block;background:#2563a8;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;padding:11px 22px;border-radius:6px;">
            Go to Training Portal
          </a>
        </td></tr>
        <tr><td style="border-top:1px solid #cbd5e1;background:#f8fafc;padding:16px 28px;">
          <p style="font-size:12px;color:#6b7280;line-height:1.7;margin:0;">
            Automated message from the <a href="${loginUrl}" style="color:#2563a8;text-decoration:none;">Senior Services Training Portal</a>. You're receiving this because you were assigned new training.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
    }

    const finalRecipient = employee_email;

    // --- Send via Resend ---
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "South Sound Seniors Training <training@southsoundseniors.org>",
        to: [finalRecipient],
        subject: subjectLine,
        html,
      }),
    });

    const resendBody = await resendRes.json();

    if (!resendRes.ok) {
      console.error("Resend API error:", JSON.stringify(resendBody));
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: resendBody }),
        {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Email sent successfully:", resendBody.id);
    return new Response(JSON.stringify({ success: true, id: resendBody.id }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
