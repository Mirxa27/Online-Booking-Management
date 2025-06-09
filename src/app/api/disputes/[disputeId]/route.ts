import { NextRequest, NextResponse } from 'next/server';
import { disputeDb } from '@/lib/disputeStore';
import { DisputeStatus, DisputeMessage } from '@/lib/types'; // Import DisputeMessage if adding messages

export async function PUT(
  req: NextRequest,
  { params }: { params: { disputeId: string } }
) {
  try {
    const userId = req.headers.get('x-user-id'); // User making the update
    // const userRole = req.headers.get('x-user-role'); // Hypothetical role: 'guest', 'host', 'admin'
    if (!userId) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const { disputeId } = params;
    if (!disputeId) {
      return NextResponse.json({ message: 'Dispute ID is required' }, { status: 400 });
    }

    const {
        status, // New DisputeStatus
        adminInvolvedUserId, // To assign an admin
        resolutionDetails, // To set final resolution
        messageText, // For adding a message to the dispute
        isInternalNote // For admin messages
    } = await req.json();

    const dispute = await disputeDb.getDisputeById(disputeId);
    if (!dispute) {
      return NextResponse.json({ message: 'Dispute not found' }, { status: 404 });
    }

    // Basic authorization: only involved parties or an admin can update.
    // A real system would have more granular role-based access control (RBAC).
    const isAdmin = userId === 'adminUser123'; // Mock admin check
    if (dispute.guestId !== userId && dispute.hostId !== userId && !isAdmin) {
        return NextResponse.json({ message: 'Forbidden: You are not authorized to update this dispute.' }, { status: 403 });
    }

    const updates: Partial<Omit<Dispute, 'id' | 'bookingId' | 'listingId' | 'guestId' | 'hostId' | 'raisedAt' | 'raisedByUserId'>> = {};
    if (status) {
        // Add validation for valid status transitions if necessary
        updates.status = status as DisputeStatus;
        if (status === 'UNDER_ADMIN_REVIEW' && !dispute.adminInvolvedUserId && isAdmin) {
            updates.adminInvolvedUserId = userId; // Assign current admin if not already assigned
        }
        if (status.startsWith('RESOLVED_') || status.startsWith('CLOSED_')) {
            updates.resolvedAt = new Date();
        }
    }
    if (adminInvolvedUserId && isAdmin) { // Only admin can set this field directly
        updates.adminInvolvedUserId = adminInvolvedUserId;
        if (!status || status === dispute.status) { // If status isn't also changing to admin review, set it
            updates.status = 'UNDER_ADMIN_REVIEW';
        }
    }
    if (resolutionDetails) {
        updates.resolutionDetails = resolutionDetails;
    }

    let updatedDispute = dispute;
    if (Object.keys(updates).length > 0) {
        updatedDispute = await disputeDb.updateDispute(disputeId, updates) || dispute;
    }

    // Handle adding a message
    if (messageText && typeof messageText === 'string' && messageText.trim() !== '') {
        updatedDispute = await disputeDb.addMessageToDispute(disputeId, {
            userId,
            message: messageText,
            isInternalNote: isAdmin ? isInternalNote : false // Only admin can make internal notes
        }) || updatedDispute;

        // TODO: Potentially update dispute status based on who sent the message
        // e.g., if guest sent message and status was AWAITING_GUEST_RESPONSE, change to AWAITING_HOST_RESPONSE or UNDER_ADMIN_REVIEW
        if (updatedDispute && !isAdmin) { // If not an admin message
            if (userId === updatedDispute.guestId && updatedDispute.status === 'AWAITING_GUEST_RESPONSE') {
                updatedDispute = await disputeDb.updateDispute(disputeId, { status: 'AWAITING_HOST_RESPONSE' }) || updatedDispute;
            } else if (userId === updatedDispute.hostId && updatedDispute.status === 'AWAITING_HOST_RESPONSE') {
                 updatedDispute = await disputeDb.updateDispute(disputeId, { status: 'AWAITING_GUEST_RESPONSE' }) || updatedDispute;
            }
        }
    }


    if (!updatedDispute) { // Should not happen if initial find was successful
        return NextResponse.json({ message: 'Failed to update dispute' }, { status: 500 });
    }

    // TODO: Notify relevant parties about the update (e.g., guest, host, admin)
    console.log(`Dispute ${disputeId} updated by user ${userId}. New status: ${updatedDispute.status}. Message added: ${!!messageText}`);

    return NextResponse.json({ message: 'Dispute updated successfully.', dispute: updatedDispute }, { status: 200 });

  } catch (error) {
    console.error('Update Dispute API error:', error);
     if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error', error: (error as Error).message }, { status: 500 });
  }
}

// GET endpoint to fetch a dispute by its ID (could be useful)
export async function GET(
  req: NextRequest,
  { params }: { params: { disputeId: string } }
) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }

    const { disputeId } = params;
    if (!disputeId) {
      return NextResponse.json({ message: 'Dispute ID is required' }, { status: 400 });
    }

    const dispute = await disputeDb.getDisputeById(disputeId);
    if (!dispute) {
      return NextResponse.json({ message: 'Dispute not found' }, { status: 404 });
    }

    // Security: User must be guest, host, or an admin (mocked)
    const isAdmin = userId === 'adminUser123'; // Mock admin check
    if (dispute.guestId !== userId && dispute.hostId !== userId && !isAdmin) {
        return NextResponse.json({ message: 'Forbidden: You are not authorized to view this dispute.' }, { status: 403 });
    }

    return NextResponse.json(dispute, { status: 200 });

  } catch (error) {
    console.error('Get Dispute by ID API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
