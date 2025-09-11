// utils/pricingCalculator.ts
import { SubscriptionPlan } from "../types/registration";

export class PricingCalculator {
  // Individual user pricing
  static readonly USER_PRICING = {
    JAMB_UTME: 2000,
    WAEC: 3000,
    NECO: 2500,
    ALL_EXAMS: 5000, // Combo package
  };

  // Corporate subscription plans
  static readonly SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
      id: "5",
      name: "5 Students Plan",
      price: 15000,
      duration: "1 Year",
      maxStudents: 5,
    },
    {
      id: "10",
      name: "10 Students Plan",
      price: 25000,
      duration: "1 Year",
      maxStudents: 10,
    },
    {
      id: "20",
      name: "20 Students Plan",
      price: 45000,
      duration: "1 Year",
      maxStudents: 20,
    },
    {
      id: "50",
      name: "50 Students Plan",
      price: 100000,
      duration: "1 Year",
      maxStudents: 50,
    },
    {
      id: "100",
      name: "100 Students Plan",
      price: 180000,
      duration: "1 Year",
      maxStudents: 100,
    },
    {
      id: "unlimited",
      name: "Unlimited Plan",
      price: 300000,
      duration: "1 Year",
      maxStudents: -1,
    },
  ];

  /**
   * Calculate price for individual user registration
   */
  static calculateUserPrice(examType: string): number {
    switch (examType) {
      case "JAMB UTME":
        return this.USER_PRICING.JAMB_UTME;
      case "WAEC":
        return this.USER_PRICING.WAEC;
      case "NECO":
        return this.USER_PRICING.NECO;
      default:
        return this.USER_PRICING.JAMB_UTME; // Default to JAMB
    }
  }

  /**
   * Get subscription plan details by ID
   */
  static getSubscriptionPlan(planId: string): SubscriptionPlan | null {
    return this.SUBSCRIPTION_PLANS.find((plan) => plan.id === planId) || null;
  }

  /**
   * Calculate corporate price based on plan
   */
  static calculateCorporatePrice(planId: string): number {
    const plan = this.getSubscriptionPlan(planId);
    return plan ? plan.price : 0;
  }

  /**
   * Get all available subscription plans
   */
  static getAllSubscriptionPlans(): SubscriptionPlan[] {
    return this.SUBSCRIPTION_PLANS;
  }

  /**
   * Calculate recommended plan based on expected students
   */
  static getRecommendedPlan(expectedStudents: number): SubscriptionPlan {
    if (expectedStudents <= 5) return this.SUBSCRIPTION_PLANS[0];
    if (expectedStudents <= 10) return this.SUBSCRIPTION_PLANS[1];
    if (expectedStudents <= 20) return this.SUBSCRIPTION_PLANS[2];
    if (expectedStudents <= 50) return this.SUBSCRIPTION_PLANS[3];
    if (expectedStudents <= 100) return this.SUBSCRIPTION_PLANS[4];
    return this.SUBSCRIPTION_PLANS[5]; // Unlimited
  }

  /**
   * Format currency for display
   */
  static formatCurrency(amount: number): string {
    return `₦${amount.toLocaleString()}`;
  }

  /**
   * Calculate discount for multiple exam types (if applicable)
   */
  static calculateUserDiscount(examTypes: string[]): number {
    if (examTypes.length >= 2) {
      const totalRegularPrice = examTypes.reduce((sum, type) => {
        return sum + this.calculateUserPrice(type);
      }, 0);

      // 10% discount for multiple exams
      return Math.floor(totalRegularPrice * 0.1);
    }
    return 0;
  }

  /**
   * Get payment breakdown for corporate plans
   */
  static getCorporatePaymentBreakdown(planId: string) {
    const plan = this.getSubscriptionPlan(planId);
    if (!plan) return null;

    const pricePerStudent =
      plan.maxStudents > 0 ? plan.price / plan.maxStudents : 0;

    return {
      plan,
      pricePerStudent: Math.floor(pricePerStudent),
      savings:
        plan.maxStudents > 0
          ? Math.floor(3000 * plan.maxStudents - plan.price)
          : 0,
      effectiveDiscount:
        plan.maxStudents > 0
          ? Math.floor(
              ((3000 * plan.maxStudents - plan.price) /
                (3000 * plan.maxStudents)) *
                100
            )
          : 0,
    };
  }
}
