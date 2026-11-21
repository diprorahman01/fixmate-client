"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { Booking } from "@/lib/bookings";

type InvoiceBooking = Booking & {
  transactionId?: string;
  paidAt?: string;
};

function pdfSafe(value: unknown): string {
  return String(value ?? "-").replace(/[^\x20-\x7e]/g, " ").slice(0, 170);
}

function displayDate(value: unknown): string {
  if (!value) return "Not recorded";
  const date = new Date(String(value));
  return Number.isFinite(date.getTime())
    ? date.toLocaleString("en-US", { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" }) + " UTC"
    : "Not recorded";
}

/** Only render for authenticated customer's paid bookings from the protected API. */
export function DownloadInvoiceButton({ booking }: { booking: InvoiceBooking }) {
  const [downloading, setDownloading] = useState(false);
  if (booking.status !== "completed" || booking.paymentStatus !== "paid") return null;

  async function downloadInvoice() {
    if (downloading) return;
    setDownloading(true);
    try {
      // Import on demand, so the rest of the website doesn't load PDF code.
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ format: "a4", unit: "mm" });
      const width = 210;
      const amount = Number(booking.finalAmount);
      if (!Number.isFinite(amount) || amount <= 0) throw new Error("Invalid invoice amount");
      const money = `$${amount.toFixed(2)}`;
      const invoiceNo = `FM-${booking._id.slice(-10).toUpperCase()}`;
      pdf.setFillColor(5, 22, 36);
      pdf.rect(0, 0, width, 49, "F");
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(187, 255, 52);
      pdf.setFontSize(22);
      pdf.text("FixMate", 18, 23);
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.text("REPAIR SERVICE - PAYMENT INVOICE", 18, 33);
      pdf.text(invoiceNo, 192, 33, { align: "right" });

      pdf.setTextColor(30, 45, 59);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      let y = 65;
      const line = (label: string, value: string) => {
        pdf.setFont("helvetica", "bold");
        pdf.text(label, 18, y);
        pdf.setFont("helvetica", "normal");
        pdf.text(pdfSafe(value), 72, y);
        y += 9;
      };
      line("Invoice number", invoiceNo);
      line("Booking reference", booking._id);
      line("Customer", booking.customerName);
      line("Customer email", booking.customerEmail);
      line("Technician", booking.technicianName);
      line("Paid on", displayDate(booking.paidAt));
      if (booking.transactionId) line("Stripe transaction", booking.transactionId);
      y += 7;
      pdf.setFillColor(237, 244, 247);
      pdf.rect(18, y, 174, 13, "F");
      pdf.setFont("helvetica", "bold");
      pdf.text("Service", 23, y + 8);
      pdf.text("Amount (USD)", 187, y + 8, { align: "right" });
      y += 23;
      pdf.setFont("helvetica", "normal");
      const titleLines = pdf.splitTextToSize(pdfSafe(booking.serviceTitle), 125);
      pdf.text(titleLines, 23, y);
      pdf.text(money, 187, y, { align: "right" });
      y += Math.max(15, titleLines.length * 6 + 7);
      pdf.setDrawColor(192, 205, 213);
      pdf.line(18, y, 192, y);
      y += 12;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.text("TOTAL PAID", 23, y);
      pdf.text(`${money} USD`, 187, y, { align: "right" });
      y += 16;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(87, 107, 120);
      pdf.text("Payment status: PAID", 23, y);
      pdf.text("This invoice reflects the final repair amount recorded in FixMate.", 23, y + 7);
      pdf.text("Generated for the signed-in customer. No additional fees or taxes are assumed.", 23, y + 13);
      pdf.save(`FixMate-Invoice-${invoiceNo}.pdf`);
      toast.success("Invoice downloaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not generate invoice");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <button type="button" onClick={() => void downloadInvoice()} disabled={downloading}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-primary/50 bg-primary/10 px-5 py-3 font-semibold text-primary transition-colors hover:bg-primary/20 disabled:opacity-50">
      {downloading ? <Loader2 className="size-5 animate-spin" /> : <Download className="size-5" />}
      {downloading ? "Preparing PDF..." : "Download PDF Invoice"}
    </button>
  );
}
