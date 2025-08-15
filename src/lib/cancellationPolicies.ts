import { Booking, Listing, CancellationPolicyName } from './types';

interface PolicyRule {
  // Hours before check-in the cancellation is made
  hoursBeforeCheckIn: number;
  // Percentage of the total booking price to be refunded (0 to 100)
  refundPercentage: number;
  // Alternatively, specific deductions like 'firstNightNonRefundable' could be added
}

// Define rules for each policy type. Sorted by hoursBeforeCheckIn (descending) is often easiest.
const policies: Record<Exclude<CancellationPolicyName, 'Custom' | 'NonRefundable'>, PolicyRule[]> = {
  Flexible: [
    { hoursBeforeCheckIn: 24, refundPercentage: 100 }, // Full refund if cancelled more than 24 hours before
    { hoursBeforeCheckIn: 0, refundPercentage: 0 },    // No refund if cancelled within 24 hours (first night typically, but simplified here)
                                                       // A more complex rule could be: { hoursBeforeCheckIn: 0, refundPercentage: 0, firstNightNonRefundable: true }
  ],
  Moderate: [
    { hoursBeforeCheckIn: 5 * 24, refundPercentage: 100 }, // Full refund if cancelled more than 5 days before
    { hoursBeforeCheckIn: 0, refundPercentage: 50 },     // 50% refund if cancelled within 5 days
  ],
  Strict: [
    // Strict often has multiple tiers, e.g. full refund if >30 days, 50% if >14 days etc.
    // For simplicity:
    { hoursBeforeCheckIn: 14 * 24, refundPercentage: 100 }, // Full refund if cancelled more than 14 days before (must also be within 48h of booking - not handled here)
    { hoursBeforeCheckIn: 7 * 24, refundPercentage: 50 },  // 50% refund if cancelled 7-14 days before
    { hoursBeforeCheckIn: 0, refundPercentage: 0 },        // No refund if cancelled less than 7 days before
  ],
};

export function calculateRefund(
  booking: Booking,
  listing: Listing,
  cancellationDate: Date = new Date()
): { refundAmount: number; policyApplied: CancellationPolicyName; appliedRule?: PolicyRule } {

  const checkInDateTime = new Date(booking.checkInDate).getTime();
  const cancellationDateTime = cancellationDate.getTime();
  const hoursBeforeCheckIn = Math.max(0, (checkInDateTime - cancellationDateTime) / (1000 * 60 * 60));

  const policyName = listing.cancellationPolicy;
  let refundPercentage = 0;
  let appliedRule: PolicyRule | undefined = undefined;

  if (policyName === 'NonRefundable') {
    refundPercentage = 0;
  } else if (policyName === 'Custom') {
    // Custom policy logic would need to be implemented here or fetched.
    // For mock, assume no refund for custom unless details are parsed.
    console.warn(`Custom cancellation policy for listing ${listing.id} - refund calculation not implemented, defaulting to 0.`);
    refundPercentage = 0;
  } else {
    const rules = policies[policyName];
    for (const rule of rules) {
      if (hoursBeforeCheckIn >= rule.hoursBeforeCheckIn) {
        refundPercentage = rule.refundPercentage;
        appliedRule = rule;
        break; // Rules should be ordered from latest to earliest cancellation time relative to check-in
      }
    }
    // If no rule matched (e.g. cancellation after check-in, though typically not allowed via this flow)
    if (appliedRule === undefined && rules.length > 0) {
        // Default to the harshest rule (last one, which should be for 0 hours or less)
        const lastRule = rules[rules.length -1];
        refundPercentage = lastRule.refundPercentage;
        appliedRule = lastRule;
    }
  }

  // For simplicity, refund is based on totalPrice.
  // In reality, it might exclude service fees or have specific conditions.
  const calculatedRefundAmount = (booking.totalPrice * refundPercentage) / 100;

  console.log(`Cancellation for Booking ${booking.id}:
    Policy: ${policyName},
    Hours Before Check-in: ${hoursBeforeCheckIn.toFixed(2)},
    Refund Percentage: ${refundPercentage}%,
    Calculated Refund: ${calculatedRefundAmount.toFixed(2)}`);

  return {
    refundAmount: calculatedRefundAmount,
    policyApplied: policyName,
    appliedRule
  };
}
