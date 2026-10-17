/** Link do WhatsApp com mensagem opcional já preenchida (abre o app ou o WhatsApp Web). */
export function whatsappUrl(phone: string, message?: string) {
  const base = `https://wa.me/${phone}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
