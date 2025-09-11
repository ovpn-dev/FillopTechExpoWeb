// utils/systemIdGenerator.ts
export class SystemIdGenerator {
  /**
   * Generates a unique system ID for registration
   * Format: FLT-YYYY-XXXX-XXXX (16 characters)
   * FLT = Fillop Tech prefix
   * YYYY = Current year
   * XXXX-XXXX = Random alphanumeric
   */
  static generateSystemId(): string {
    const year = new Date().getFullYear();
    const randomPart1 = this.generateRandomString(4);
    const randomPart2 = this.generateRandomString(4);

    return `FLT-${year}-${randomPart1}-${randomPart2}`;
  }

  /**
   * Generates a corporate activation code
   * Format: 12-digit alphanumeric code
   */
  static generateActivationCode(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generates a user activation passcode
   * Format: 8-digit numeric code for individual users
   */
  static generateUserPasscode(): string {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  }

  /**
   * Validates system ID format
   */
  static validateSystemId(systemId: string): boolean {
    const pattern = /^FLT-\d{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
    return pattern.test(systemId);
  }

  /**
   * Validates activation code format
   */
  static validateActivationCode(code: string): boolean {
    const pattern = /^[A-Z0-9]{12}$/;
    return pattern.test(code);
  }

  /**
   * Validates user passcode format
   */
  static validateUserPasscode(passcode: string): boolean {
    const pattern = /^\d{8}$/;
    return pattern.test(passcode);
  }

  private static generateRandomString(length: number): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Generates transaction reference for payment
   */
  static generateTransactionRef(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `FLT${timestamp}${random}`;
  }
}
