import { db } from "@/lib/db";

export class MemoryEngine {
  /**
   * Fetches customer history and returns an AI-safe memory block.
   * Strips all PII except first name and prevents leaking backend metrics
   * into the LLM context.
   */
  public async getCustomerMemory(tenantId: string, customerId?: string): Promise<string> {
    if (!customerId) {
      return "## CUSTOMER CONTEXT\nGuest User. No previous history available.";
    }

    const customer = await db.customer.findUnique({
      where: { id: customerId },
      include: { loyaltyAccount: true }
    });

    if (!customer || customer.restaurantId !== tenantId) {
      return "## CUSTOMER CONTEXT\nGuest User. No previous history available.";
    }

    // AI-Safe Extraction
    const firstName = customer.fullName.split(" ")[0] || "Guest";
    const totalOrders = customer.totalOrders;
    const loyaltyPoints = customer.loyaltyAccount?.currentPoints || 0;
    
    // Future Sprint: Pull favorite dishes from CustomerEvent or Order history
    
    let md = "## CUSTOMER CONTEXT\n";
    md += `- Name: ${firstName}\n`;
    md += `- Customer Profile: ${totalOrders > 5 ? "Regular" : totalOrders > 0 ? "Returning" : "New"} Customer\n`;
    md += `- Loyalty Points: ${loyaltyPoints}\n`;

    return md.trim();
  }
}
