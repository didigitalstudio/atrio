import {
  FROM_DEFAULT,
  NOTIFICATIONS_EMAIL,
  SITE_URL,
  getResend,
} from "./client";

/* ===========================================================
 * Helpers
 * =========================================================== */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function nl2br(s: string): string {
  return escapeHtml(s).replace(/\n/g, "<br/>");
}

async function send(opts: {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.info(
      `[email] RESEND_API_KEY missing — skipping send: "${opts.subject}"`
    );
    return;
  }
  const { error } = await resend.emails.send({
    from: FROM_DEFAULT,
    to: opts.to,
    subject: opts.subject,
    html: opts.html,
    replyTo: opts.replyTo,
  });
  if (error) {
    // No tirar — los mails no deben romper la operación principal.
    console.error("[email] send error:", error);
  }
}

/* ===========================================================
 * Layout HTML compartido (minimalista, sin templating engine)
 * =========================================================== */

function shell(opts: {
  preheader?: string;
  title: string;
  body: string;
  cta?: { label: string; href: string };
  footer?: string;
}): string {
  const preheader = opts.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden">${escapeHtml(opts.preheader)}</div>`
    : "";
  const cta = opts.cta
    ? `<p style="margin:24px 0">
        <a href="${opts.cta.href}" style="display:inline-block;background:#1B6B47;color:#fff;text-decoration:none;font-weight:600;padding:12px 22px;border-radius:999px;font-size:14px">${escapeHtml(opts.cta.label)}</a>
      </p>`
    : "";
  return `<!DOCTYPE html>
<html lang="es-AR">
<head><meta charset="utf-8"/></head>
<body style="margin:0;padding:0;background:#F7F7F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1A1A1A;line-height:1.55">
${preheader}
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F7F7F5;padding:32px 16px">
  <tr><td align="center">
    <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;background:#fff;border-radius:16px;border:1px solid #E8E6E0">
      <tr><td style="padding:28px 32px 8px 32px">
        <div style="font-size:22px;font-weight:700;letter-spacing:-0.01em">Atrio<span style="color:#1B6B47">.</span></div>
      </td></tr>
      <tr><td style="padding:8px 32px 28px 32px">
        <h1 style="font-size:22px;font-weight:600;margin:0 0 12px 0;line-height:1.25">${escapeHtml(opts.title)}</h1>
        <div style="font-size:14.5px;color:#4A4A48">${opts.body}</div>
        ${cta}
      </td></tr>
    </table>
    <p style="font-size:12px;color:#6B6B68;margin-top:16px">${
      opts.footer
        ? escapeHtml(opts.footer)
        : "Atrio · Inmobiliaria en Buenos Aires · atrio.com.ar"
    }</p>
  </td></tr>
</table>
</body></html>`;
}

/* ===========================================================
 * Eventos
 * =========================================================== */

type ContactInfo = {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
};

type LeadPropiedad = { titulo: string; slug: string } | null;

export async function notifyLeadCreated(input: {
  lead: ContactInfo & { canal: string };
  propiedad?: LeadPropiedad;
  /** Email del agente asignado, si existe. Default: NOTIFICATIONS_EMAIL. */
  agentEmail?: string | null;
}): Promise<void> {
  const { lead, propiedad, agentEmail } = input;
  const adminTo = agentEmail || NOTIFICATIONS_EMAIL;

  // 1) Aviso al agente / equipo
  const adminSubject = propiedad
    ? `Consulta sobre "${propiedad.titulo}" — ${lead.nombre}`
    : `Nueva consulta general — ${lead.nombre}`;
  const propLink = propiedad ? `${SITE_URL}/propiedades/${propiedad.slug}` : null;
  const adminBody = `
    <p style="margin:0 0 12px 0">Hola, recibimos una nueva consulta:</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 12px 0;font-size:14px">
      <tr><td style="padding:4px 12px 4px 0;color:#6B6B68">Nombre</td><td style="padding:4px 0">${escapeHtml(lead.nombre)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#6B6B68">Email</td><td style="padding:4px 0"><a href="mailto:${escapeHtml(lead.email)}" style="color:#0F4A2E">${escapeHtml(lead.email)}</a></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#6B6B68">Teléfono</td><td style="padding:4px 0">${escapeHtml(lead.telefono)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#6B6B68">Canal</td><td style="padding:4px 0">${escapeHtml(lead.canal)}</td></tr>
      ${propiedad ? `<tr><td style="padding:4px 12px 4px 0;color:#6B6B68">Propiedad</td><td style="padding:4px 0"><a href="${propLink}" style="color:#0F4A2E">${escapeHtml(propiedad.titulo)}</a></td></tr>` : ""}
    </table>
    <p style="margin:16px 0 8px 0;color:#6B6B68;font-size:12px;text-transform:uppercase;letter-spacing:0.14em">Mensaje</p>
    <blockquote style="margin:0;padding:12px 16px;background:#F7F7F5;border-left:3px solid #1B6B47;border-radius:6px;font-size:14.5px">${nl2br(lead.mensaje)}</blockquote>
  `;
  await send({
    to: adminTo,
    subject: adminSubject,
    replyTo: lead.email,
    html: shell({
      preheader: `${lead.nombre} mandó una consulta`,
      title: adminSubject,
      body: adminBody,
      cta: { label: "Ir al panel", href: `${SITE_URL}/admin/leads` },
    }),
  });

  // 2) Confirmación al usuario que consultó
  const userSubject = "Recibimos tu consulta";
  const userBody = `
    <p style="margin:0 0 12px 0">Hola ${escapeHtml(lead.nombre.split(" ")[0])}, gracias por escribirnos.</p>
    <p style="margin:0 0 12px 0">Recibimos tu consulta${propiedad ? ` sobre <strong>${escapeHtml(propiedad.titulo)}</strong>` : ""} y te respondemos en menos de 2 horas en horario laboral.</p>
    <p style="margin:16px 0 0 0;color:#6B6B68;font-size:13px">Si querés sumar info, podés responder este mismo mail.</p>
  `;
  await send({
    to: lead.email,
    subject: userSubject,
    html: shell({
      preheader: "Te contactamos pronto",
      title: "Recibimos tu consulta",
      body: userBody,
      cta: propiedad
        ? { label: "Ver la propiedad", href: propLink! }
        : { label: "Ver más propiedades", href: `${SITE_URL}/comprar` },
    }),
  });
}

export async function notifyTasacionRequested(input: {
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  tipo: string;
  ambientes?: number | null;
  m2?: number | null;
  comentarios?: string | null;
}): Promise<void> {
  // 1) Aviso al equipo
  const adminBody = `
    <p style="margin:0 0 12px 0">Nueva solicitud de tasación:</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 12px 0;font-size:14px">
      <tr><td style="padding:4px 12px 4px 0;color:#6B6B68">Nombre</td><td style="padding:4px 0">${escapeHtml(input.nombre)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#6B6B68">Email</td><td style="padding:4px 0"><a href="mailto:${escapeHtml(input.email)}" style="color:#0F4A2E">${escapeHtml(input.email)}</a></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#6B6B68">Teléfono</td><td style="padding:4px 0">${escapeHtml(input.telefono)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#6B6B68">Dirección</td><td style="padding:4px 0">${escapeHtml(input.direccion)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#6B6B68">Tipo</td><td style="padding:4px 0">${escapeHtml(input.tipo)}</td></tr>
      ${input.ambientes ? `<tr><td style="padding:4px 12px 4px 0;color:#6B6B68">Ambientes</td><td style="padding:4px 0">${input.ambientes}</td></tr>` : ""}
      ${input.m2 ? `<tr><td style="padding:4px 12px 4px 0;color:#6B6B68">m²</td><td style="padding:4px 0">${input.m2}</td></tr>` : ""}
    </table>
    ${input.comentarios ? `<p style="margin:16px 0 8px 0;color:#6B6B68;font-size:12px;text-transform:uppercase;letter-spacing:0.14em">Comentarios</p><blockquote style="margin:0;padding:12px 16px;background:#F7F7F5;border-left:3px solid #1B6B47;border-radius:6px;font-size:14.5px">${nl2br(input.comentarios)}</blockquote>` : ""}
  `;
  await send({
    to: NOTIFICATIONS_EMAIL,
    subject: `Solicitud de tasación — ${input.nombre}`,
    replyTo: input.email,
    html: shell({
      preheader: `${input.nombre} pidió tasación en ${input.direccion}`,
      title: `Tasación pedida por ${input.nombre}`,
      body: adminBody,
      cta: { label: "Ver en el panel", href: `${SITE_URL}/admin/tasaciones` },
    }),
  });

  // 2) Confirmación al usuario
  const userBody = `
    <p style="margin:0 0 12px 0">Hola ${escapeHtml(input.nombre.split(" ")[0])}, recibimos tu pedido de tasación para <strong>${escapeHtml(input.direccion)}</strong>.</p>
    <p style="margin:0 0 12px 0">Un agente lo revisa y te llega el valor estimado en menos de 48 horas. Sin cargo, sin compromiso.</p>
  `;
  await send({
    to: input.email,
    subject: "Recibimos tu pedido de tasación",
    html: shell({
      preheader: "Te llega el valor en menos de 48 horas",
      title: "Tasación recibida",
      body: userBody,
    }),
  });
}

export async function notifyClientPropertySubmitted(input: {
  titulo: string;
  direccion: string;
  zona: string;
  submitterEmail: string;
  submitterName?: string | null;
}): Promise<void> {
  const adminBody = `
    <p style="margin:0 0 12px 0">Un cliente subió una propiedad para revisión:</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 12px 0;font-size:14px">
      <tr><td style="padding:4px 12px 4px 0;color:#6B6B68">Título</td><td style="padding:4px 0">${escapeHtml(input.titulo)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#6B6B68">Dirección</td><td style="padding:4px 0">${escapeHtml(input.direccion)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#6B6B68">Zona</td><td style="padding:4px 0">${escapeHtml(input.zona)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#6B6B68">Por</td><td style="padding:4px 0">${escapeHtml(input.submitterName || input.submitterEmail)}</td></tr>
    </table>
  `;
  await send({
    to: NOTIFICATIONS_EMAIL,
    subject: `Submission para revisar — ${input.titulo}`,
    replyTo: input.submitterEmail,
    html: shell({
      preheader: `Hay una propiedad nueva esperando revisión`,
      title: "Submission para revisar",
      body: adminBody,
      cta: {
        label: "Revisar ahora",
        href: `${SITE_URL}/admin/propiedades?estado=en_revision`,
      },
    }),
  });

  // Confirmación al cliente
  const userBody = `
    <p style="margin:0 0 12px 0">Recibimos los datos de tu propiedad <strong>${escapeHtml(input.titulo)}</strong>.</p>
    <p style="margin:0 0 12px 0">Un agente la revisa, ajusta lo que haga falta y se contacta con vos antes de publicarla. Si todo está en orden, vas a verla online en menos de 48 horas.</p>
  `;
  await send({
    to: input.submitterEmail,
    subject: "Tu propiedad está en revisión",
    html: shell({
      preheader: "La revisamos y te avisamos cuando esté online",
      title: "Tu propiedad está en revisión",
      body: userBody,
    }),
  });
}

export async function notifyPropertyApproved(input: {
  titulo: string;
  slug: string;
  submitterEmail: string;
}): Promise<void> {
  const url = `${SITE_URL}/propiedades/${input.slug}`;
  const body = `
    <p style="margin:0 0 12px 0">¡Buenas noticias! Tu propiedad <strong>${escapeHtml(input.titulo)}</strong> fue revisada y ya está publicada en Atrio.</p>
    <p style="margin:0 0 12px 0">A partir de ahora, las consultas de potenciales compradores te van a llegar a través nuestro y te las pasamos directo.</p>
  `;
  await send({
    to: input.submitterEmail,
    subject: `Tu propiedad ya está publicada`,
    html: shell({
      preheader: "Pasó la revisión y ya está online",
      title: "Tu propiedad está online",
      body,
      cta: { label: "Verla en Atrio", href: url },
    }),
  });
}

export async function notifyPropertyRejected(input: {
  titulo: string;
  submitterEmail: string;
}): Promise<void> {
  const body = `
    <p style="margin:0 0 12px 0">Revisamos tu propiedad <strong>${escapeHtml(input.titulo)}</strong> y necesitamos ajustar algunos datos antes de poder publicarla.</p>
    <p style="margin:0 0 12px 0">Un agente se va a contactar con vos en las próximas horas para coordinar.</p>
  `;
  await send({
    to: input.submitterEmail,
    subject: "Necesitamos hablar sobre tu propiedad",
    html: shell({
      preheader: "Te contactamos para ajustar detalles",
      title: "Hay algunos detalles que ajustar",
      body,
      cta: { label: "Hablar con nosotros", href: `${SITE_URL}/contacto` },
    }),
  });
}
